const { io } = require("lastejobb");

const ingress = io.lesDatafil("tekst");
const r = {};
Object.keys(ingress).forEach(key => (r[key] = cleanup(ingress[key])));
io.skrivBuildfil(__filename, r);

function cleanup(e) {
  clean(e, "ingress");
  clean(e, "brødtekst");
  return e;
}

function clean(e, key) {
  const item = e[key];
  if (!item) return;
  Object.keys(item).forEach(key => {
    const v = item[key];
    item[key] = stripHtml(v);
  });
}

function stripHtml(v) {
  v = v.replace(/\<\/?em\>/g, "");
  v = v.replace(/\<\/?strong\>/g, "");
  v = v.replace(/\<\/?p\>/g, "");
  v = v.replace(/\<a href=\"(.*?)\">.*<\/a>/g, "$1");
  v = v.replace(/\n/g, "");
  return v.trim();
}
