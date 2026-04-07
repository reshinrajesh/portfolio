import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load migration variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.migration') });

const sourceUrl = process.env.SOURCE_DATABASE_URL;
const destUrl = process.env.DESTINATION_DATABASE_URL;

if (!sourceUrl || !destUrl || sourceUrl.includes('replace-with')) {
    console.error('❌ ERROR: Please configure .env.migration first!');
    process.exit(1);
}

// Connect to both databases
const sourceDb = postgres(sourceUrl, { transform: postgres.camel });
const destDb = postgres(destUrl, { transform: postgres.camel });

const tablesToMigrate = [
    'users',
    'verification_tokens',
    'authenticators',
    'posts',
    'skills',
    'status_incidents',
    'albums',
    'gallery_images',
    'site_content',
    'access_logs'
];

async function runMigration() {
    console.log('🚀 Starting Data Migration...');
    for (const table of tablesToMigrate) {
        console.log(`\n📦 Migrating table: ${table}`);
        try {
            // 1. Fetch all rows from source
            const rows = await sourceDb.unsafe(`SELECT * FROM ${table}`);
            console.log(`   Found ${rows.length} rows.`);

            if (rows.length === 0) continue;

            // 2. Insert into destination
            // Clean dynamic insertion using postgresjs helper
            for (const row of rows) {
                // Upsert to avoid conflicts if script is run multiple times
                await destDb.unsafe(
                    `INSERT INTO "${table}" (${Object.keys(row).map(k => `"${k}"`).join(',')}) 
                     VALUES (${Object.keys(row).map((_, i) => `$${i + 1}`).join(',')})
                     ON CONFLICT DO NOTHING`,
                    Object.values(row)
                );
            }
            console.log(`   ✅ Synced ${rows.length} rows into destination.`);
        } catch (error) {
            console.error(`   ❌ Failed to migrate ${table}:`, error);
        }
    }
    
    console.log('\n🎉 Migration Complete!');
    await sourceDb.end();
    await destDb.end();
}

runMigration().catch(console.error);
