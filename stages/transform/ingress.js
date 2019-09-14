const { io, log } = require("lastejobb");

const seen = {};

const ingress = io.lesDatafil("ingress");
Object.keys(ingress).forEach(key => cleanup(key));
io.skrivBuildfil(__filename, ingress);

function cleanup(key) {
  const e = ingress[key];
  clean(e, "ingress");
  clean(e, "brødtekst");
  if (Object.keys(e).length <= 0) {
    delete ingress[key];
  }
}

function clean(e, key) {
  const item = e[key];
  if (!item) return;
  Object.keys(item).forEach(key => {
    let html = item[key];
    const tekst = stripHtml(html);
    const gyldigTekst = filtrer(tekst);
    if (gyldigTekst) item[key] = gyldigTekst;
    else delete item[key];
  });
  if (Object.keys(item).length <= 0) delete e[key];
}

function filtrer(tekst) {
  if (tekst.indexOf("<p>") >= 0) debugger;
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
