import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env
const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let val = match[2].replace(/^"(.*)"$/, '$1').replace(/\r$/, '').trim();
        process.env[match[1]] = val;
    }
});

async function run() {
    const { createHulyIssue } = await import('./src/lib/huly');
    try {
        console.log("Creating incident...");
        const hulyIssue = await createHulyIssue({
            name: "Admin",
            email: "admin@reshinrajesh.in",
            subject: "Test Incident Creation",
            message: "Testing automatic huly creation via CLI",
            category: "INCIDENT",
            labels: ["incident", "manual-entry"]
        });
        
        console.log("Result:", hulyIssue);
    } catch (e) {
        console.error(e);
    }
}

run();
