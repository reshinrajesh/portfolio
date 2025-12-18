import { getBio } from "@/app/actions";
import ProfileEditor from "./ProfileEditor";

export const revalidate = 0;

export default async function ProfilePage() {
    const bioContent = await getBio();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
                <p className="text-muted-foreground mt-1">Update your personal bio page</p>
            </div>

            <ProfileEditor initialContent={bioContent} />
        </div>
    );
}
