import { getMediaFiles } from "@/app/actions";
import MediaGallery from "./MediaGallery";

export const revalidate = 0;

export default async function MediaPage() {
    const files = await getMediaFiles();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Media Gallery</h1>
                <p className="text-muted-foreground mt-1">Manage your uploaded images and videos</p>
            </div>

            <MediaGallery initialFiles={files} />
        </div>
    );
}
