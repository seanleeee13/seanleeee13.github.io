const hashPart = window.location.hash.split("?")[1];
const query = hashPart ? "?" + hashPart : window.location.search || "";

export default query;