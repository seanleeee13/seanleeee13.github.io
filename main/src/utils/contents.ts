import gdLogo from "../assets/gdlogo.png";
import somethingLogo from "../assets/something.png";
import adminLogo from "../assets/admin.png";

const imagemap: Record<string, string> = {
    admin: adminLogo,
    gff: gdLogo,
    something: somethingLogo,
};
const descriptionmap: Record<string, string> = {
    admin: "Admin Dashboard",
    gff: "GD Friends Forum",
    something: "Something Chess AI",
};
const sourcemap: Record<string, string> = {
    admin: "Admin: Flaticon (https://www.flaticon.com/kr/free-icon/crown_679660)",
    gff: "GFF: Geometry Dash (https://www.geometrydash.com)",
    something:
        "Something: Pixabay (https://pixabay.com/photos/checkmate-chess-board-chess-board-1511866)",
};
const usable = [["something", "Something"]];

export { imagemap, descriptionmap, sourcemap, usable };