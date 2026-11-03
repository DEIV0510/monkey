// Catálogo oficial (carpeta Desktop\GRIPS, fichas v1.0 de octubre 2026):
// copia los originales a assets/img/source/v2 y genera las versiones web.
// Las fotos se redimensionan sin recortar ni deformar (requisito de las fichas).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GRIPS = 'C:/Users/Lenovo/Desktop/GRIPS';
const DOCX = process.argv[2]; // carpeta con los .docx descomprimidos
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets', 'img', 'source', 'v2');
const IMG = path.join(ROOT, 'assets', 'img');

const wa = (time) => path.join(GRIPS, `WhatsApp Image 2026-10-30 at ${time}.jpeg`);

const jobs = [
  // Grips: 6 colores oficiales (vista frontal, trasera y lateral en una sola foto)
  { src: wa('1.12.59 PM (2)'), out: 'grips/grips-neazaz', widths: [1200, 640] },
  { src: wa('1.12.59 PM'), out: 'grips/grips-funene', widths: [1200, 640] },
  { src: wa('1.13.00 PM'), out: 'grips/grips-neblbl', widths: [1200, 640] },
  { src: wa('1.13.00 PM (1)'), out: 'grips/grips-vmnabl', widths: [1200, 640] },
  { src: wa('1.12.58 PM'), out: 'grips/grips-blfufu', widths: [1200, 640] },
  { src: wa('1.12.59 PM (1)'), out: 'grips/grips-movnvn', widths: [1200, 640] },
  { src: path.join(GRIPS, 'Infografía Monkey Grip (1).png'), out: 'grips/grips-infografia', widths: [1536], quality: 90 },
  { src: path.join(DOCX, 'PaquetedefinitivodeproductoGripsdocx/word/media/image2.png'), out: 'grips/grips-guia-tallas', widths: [1200], quality: 88 },

  // Monkey Wristbands: recortes sin fondo
  { src: path.join(GRIPS, 'Wristbands Blanco fucsia sin fondo.png'), out: 'wristbands/wb-blfu', widths: [900, 480], trim: true },
  { src: path.join(GRIPS, 'Wristbands BlancoNegro sin fondo.png'), out: 'wristbands/wb-blne', widths: [900, 480], trim: true },
  { src: path.join(GRIPS, 'Wristbands morado verdeneon sin fondo.png'), out: 'wristbands/wb-movn', widths: [900, 480], trim: true },
  { src: path.join(GRIPS, 'Wristbands negro fucsia sin fondo.png'), out: 'wristbands/wb-nefu', widths: [900, 480], trim: true },
  { src: path.join(GRIPS, 'Wristbands negro naranja sin fondo.png'), out: 'wristbands/wb-nena', widths: [900, 480], trim: true },
  { src: path.join(GRIPS, 'Wristbands negroAzul sin fondo.png'), out: 'wristbands/wb-neaz', widths: [900, 480], trim: true },
  { src: wa('12.59.48 PM'), out: 'wristbands/wristbands-infografia', widths: [1536], quality: 90 },

  // Monkey Grip Travel Bag: fotos reales por color + infografía + carrusel MODEX (conceptual)
  { src: wa('1.14.39 PM'), out: 'travel-bag/travel-bag-verde', widths: [1000, 560] },
  { src: wa('1.14.38 PM'), out: 'travel-bag/travel-bag-gris', widths: [1000, 560] },
  { src: wa('1.14.38 PM (2)'), out: 'travel-bag/travel-bag-negro', widths: [1000, 560] },
  { src: wa('1.14.38 PM (1)'), out: 'travel-bag/travel-bag-morado', widths: [1000, 560] },
  { src: wa('1.00.09 PM'), out: 'travel-bag/travel-bag-infografia', widths: [1024], quality: 90 },
  ...[1, 2, 3, 4, 5].map((n) => ({
    src: path.join(DOCX, `Paquetedefinitivodeproductomaletasdocx/word/media/image${n}.jpg`),
    out: `travel-bag/modex-${n}`,
    widths: [1024],
    quality: 90,
  })),
];

async function run() {
  fs.mkdirSync(SRC, { recursive: true });
  for (const job of jobs) {
    const base = path.basename(job.out);
    fs.copyFileSync(job.src, path.join(SRC, base + path.extname(job.src)));
    fs.mkdirSync(path.dirname(path.join(IMG, job.out)), { recursive: true });
    let input = sharp(job.src);
    if (job.trim) input = sharp(await input.trim({ threshold: 1 }).toBuffer());
    for (const [i, width] of job.widths.entries()) {
      const suffix = i === 0 ? '' : `-${width}`;
      const out = path.join(IMG, `${job.out}${suffix}.webp`);
      await input.clone().resize({ width, withoutEnlargement: true }).webp({ quality: job.quality || 84, alphaQuality: 90 }).toFile(out);
      const meta = await sharp(out).metadata();
      console.log(`${job.out}${suffix}.webp`, `${meta.width}x${meta.height}`, `${Math.round(fs.statSync(out).size / 1024)} KB`);
    }
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
