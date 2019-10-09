const { io, log } = require("lastejobb");
const fetch = require("node-fetch");

const r = {};
const typer = io.lesDatafil("art-kode/type").items;

log.info("Laster ned tekster...");
const MAX_THREADS = 5;
for (let i = 0; i < MAX_THREADS; i++) downloadNext();

async function downloadNext() {
  if (typer.length % 10000 === 0) log.info(typer.length + " arter gjenstår...");

  const item = typer.pop();
  if (!item) {
    io.skrivDatafil("ingress", r);
    return;
  }
  download(item).then(r => downloadNext());
}

async function download(type) {
  const taxon = type.kode.replace("AR-", "");
  const url =
    "https://beta.artsdatabanken.no/api/resource/?ResourceIds=Taxon/" + taxon;
  await download2(url, type.kode);
}

async function download2(url, kode) {
  const r = await fetch(url);
  let text = await r.text();
  if (text.charCodeAt(0) === 0xfeff) text = text.substr(1); // https://github.com/Artsdatabanken/artsdatabanken.no/issues/27
  let json = JSON.parse(text);
  if (Array.isArray(json)) {
    if (json.length <= 0) return;
    json = json[0];
  }
  if (!json.Description) return;
  mapDescription(kode, json.Description);
}

function mapDescription(kode, desc) {
  desc.forEach(d => {
    map(kode, d, "Intro", "beskrivelse");
    map(kode, d, "Body", "brødtekst");
  });
}

function map(kode, d, srcField, dstField) {
  if (!d[srcField]) return;
  if (!r[kode]) r[kode] = {};
  const type = r[kode];
  if (!type[dstField]) type[dstField] = {};
  const field = type[dstField];
  field[d.Language] = d[srcField];
}
