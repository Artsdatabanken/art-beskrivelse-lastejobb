const { io, log } = require("lastejobb");

const seen = {};

const ingress = io.lesDatafil("ingress");
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
    let html = item[key];
    const tekst = stripHtml(html);
    const gyldigTekst = filtrer(tekst);
    if (gyldigTekst) item[key] = gyldigTekst;
  });
}

function filtrer(tekst) {
  const ban = [
    "Informasjon hentet fra Bondens kulturmarksflora for Midt-Norge."
  ];
  for (var stop of ban) if (tekst === stop) return null;
  if (seen[tekst]) log.warn("Duplikat tekst: " + tekst);
  seen[tekst] = true;
  return tekst;
}

function stripHtml(v) {
  v = v.replace(/\<\/?em\>/g, "");
  v = v.replace(/\<\/?strong\>/g, "");
  v = v.replace(/\<\/?p\>/g, "");
  v = v.replace(/\<a href=\"(.*?)\">.*<\/a>/g, "$1");
  v = v.replace(/\n/g, "");
  return v.trim();
}
