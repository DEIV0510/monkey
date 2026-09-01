// Genera variantes del logo pensadas para fondos oscuros (navbar/footer/loader negros).
const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'assets', 'img', 'source');
const OUT = path.join(__dirname, '..', 'assets', 'img', 'logo');

async function buildFromWhiteBg(inputFile, { recolorBlackTo } = {}) {
  const img = sharp(inputFile).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const alpha = 255 - Math.min(r, g, b);
    data[i + 3] = alpha;
    const isBlackish = r < 70 && g < 70 && b < 70;
    if (isBlackish && recolorBlackTo) {
      data[i] = recolorBlackTo[0];
      data[i + 1] = recolorBlackTo[1];
      data[i + 2] = recolorBlackTo[2];
    }
  }
  return sharp(data, { raw: { width, height, channels } }).png();
}

async function recolorIcon(inputFile, outName, rgb) {
  const img = sharp(inputFile).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    if (data[i + 3] > 0) {
      data[i] = rgb[0]; data[i + 1] = rgb[1]; data[i + 2] = rgb[2];
    }
  }
  await sharp(data, { raw: { width, height, channels } }).png().toFile(path.join(OUT, outName));
}

async function run() {
  // Lockup completo (mono + MONKEY amarillo + GRIP blanco) listo para fondo negro
  const darkFull = await buildFromWhiteBg(path.join(SRC, 'logo-page-1.png'), { recolorBlackTo: [255, 255, 255] });
  await darkFull.trim({ threshold: 10 }).toFile(path.join(OUT, 'logo-full-darkbg.png'));

  // Icono del mono en blanco y en amarillo (partiendo del icono ya recortado con alpha)
  await recolorIcon(path.join(OUT, 'logo-icon-mono.png'), 'logo-icon-white.png', [255, 255, 255]);
  await recolorIcon(path.join(OUT, 'logo-icon-mono.png'), 'logo-icon-yellow.png', [255, 236, 0]);

  console.log('Variantes dark-bg listas');
}

run().catch((e) => { console.error(e); process.exit(1); });
