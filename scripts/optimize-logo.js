const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '..', 'assets', 'img', 'logo');

async function shrink(file, maxWidth) {
  const full = path.join(DIR, file);
  const buf = fs.readFileSync(full);
  const resized = await sharp(buf).resize({ width: maxWidth, withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(full, resized);
  const webp = await sharp(resized).webp({ quality: 92 }).toBuffer();
  fs.writeFileSync(full.replace('.png', '.webp'), webp);
}

async function run() {
  await shrink('logo-full-color.png', 900);
  await shrink('logo-full-darkbg.png', 900);
  await shrink('logo-wordmark-white.png', 900);
  await shrink('logo-wordmark-yellow.png', 900);
  await shrink('logo-icon-mono.png', 400);
  await shrink('logo-icon-white.png', 400);
  await shrink('logo-icon-yellow.png', 400);

  // Favicons desde el icono mono (fondo transparente)
  const iconBuf = fs.readFileSync(path.join(DIR, 'logo-icon-yellow.png'));
  for (const size of [512, 192, 32]) {
    await sharp(iconBuf).resize(size, size, { fit: 'contain', background: { r: 5, g: 5, b: 5, alpha: 1 } })
      .png().toFile(path.join(DIR, `favicon-${size}.png`));
  }
  console.log('Logo optimizado');
}

run().catch((e) => { console.error(e); process.exit(1); });
