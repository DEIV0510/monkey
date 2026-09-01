const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.join(__dirname, '..', 'assets', 'img', 'source');
const IMG = path.join(__dirname, '..', 'assets', 'img');

async function emit(inputFile, outDirRel, baseName, opts = {}) {
  const outDir = path.join(IMG, outDirRel);
  fs.mkdirSync(outDir, { recursive: true });
  let pipeline = sharp(inputFile).trim({ threshold: 8 });
  if (opts.maxWidth) pipeline = pipeline.resize({ width: opts.maxWidth, withoutEnlargement: true });
  const webpBuf = await pipeline.clone().webp({ quality: opts.quality || 88 }).toBuffer();
  fs.writeFileSync(path.join(outDir, `${baseName}.webp`), webpBuf);
  const pngBuf = await pipeline.clone().png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(outDir, `${baseName}.png`), pngBuf);
  const meta = await sharp(webpBuf).metadata();
  return { width: meta.width, height: meta.height };
}

async function run() {
  const results = {};

  // GRIPS — 8 colorways reales, foto de producto completa
  const grips = [
    { file: 'grip2.png', slug: 'rojo', label: 'Rojo' },
    { file: 'grip3.png', slug: 'verde', label: 'Verde' },
    { file: 'grip4.png', slug: 'lavanda', label: 'Lavanda' },
    { file: 'grip5.png', slug: 'amarillo', label: 'Amarillo' },
    { file: 'grip6.png', slug: 'rosa', label: 'Rosa Neón' },
    { file: 'grip7.png', slug: 'morado', label: 'Morado' },
    { file: 'grip8.png', slug: 'negro-cyan', label: 'Negro Cyan' },
    { file: 'grip9.png', slug: 'celeste', label: 'Celeste' },
  ];
  for (const g of grips) {
    results[`grip-${g.slug}`] = await emit(path.join(SRC, g.file), 'grips', `grip-${g.slug}`, { maxWidth: 900 });
  }

  // Infografia tecnica de construccion del grip (seccion beneficios/tecnologia)
  results['grip-construction'] = await emit(path.join(SRC, 'grip.png'), 'grips', 'grip-construction', { maxWidth: 1200 });

  // BACKPACK
  results['backpack-hero'] = await emit(path.join(SRC, 'bolso.png'), 'backpack', 'backpack-hero', { maxWidth: 900 });
  results['backpack-infografia-1'] = await emit(path.join(SRC, 'bolso2.png'), 'backpack', 'backpack-infografia-1', { maxWidth: 1200 });
  results['backpack-infografia-2'] = await emit(path.join(SRC, 'bolso3.png'), 'backpack', 'backpack-infografia-2', { maxWidth: 1200 });

  // RIÑONERA (infografia completa, incluye 3 colores reales: gris/verde/azul)
  results['waistbag-infografia'] = await emit(path.join(SRC, 'riñonera.png'), 'waistbag', 'waistbag-infografia', { maxWidth: 1200 });

  // ULTRAROPE (maniguetas) infografia completa, incluye 3 colores reales: azul/morado/rojo
  results['rope-infografia'] = await emit(path.join(SRC, 'manigueta.png'), 'rope', 'rope-infografia', { maxWidth: 1200 });

  fs.writeFileSync(path.join(__dirname, 'image-meta.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

run().catch((e) => { console.error(e); process.exit(1); });
