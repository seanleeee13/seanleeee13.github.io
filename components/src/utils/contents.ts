import gdLogo from "../assets/gdlogo.png";
import somethingLogo from "../assets/something.png";
import adminLogo from "../assets/admin.png";
import supabase, { type UserInterface } from "./supabase_key";

const imagemap: Record<string, string> = {
    admin: adminLogo,
    gff: gdLogo,
    something: somethingLogo
};
const descriptionmap: Record<string, string> = {
    admin: "Admin Dashboard",
    gff: "GD Friends Forum",
    something: "Something Chess AI"
};
const usable: [string, string][] = [["something", "Something"]];

const getContents = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        return usable;
    }
    const users = await supabase.from("user").select("*").eq("id", session.user.id).single();
    if (users.error) {
        return usable;
    }
    const user = users.data as UserInterface;
    return [...(user?.role ?? []), ...(user?.vrole ?? []), ...usable];
}

export { imagemap, descriptionmap, usable, getContents };