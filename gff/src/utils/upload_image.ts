import { supabase } from "components/utils";

export default async function uploadImage(file: File, fileName: string) {
    const { data, error } = await supabase.storage.from("gd-thumbnail").upload(fileName, file);
    if (error) {
        console.error("Upload failed:", error.message);
        return null;
    }
    const {
        data: { publicUrl }
    } = supabase.storage.from("gd-thumbnail").getPublicUrl(data.path);
    return publicUrl;
}