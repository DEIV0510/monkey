// Convierte los renders del PDF (fondo blanco o negro) en PNG con alpha real y recorta al contenido.
const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'assets', 'img', 'source');
const OUT = path.join(__dirname, '..', 'assets', 'img', 'logo');

async function keyOut(inputFile, mode) {
  const img = sharp(inputFile).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    let alpha;
    if (mode === 'white') {
      alpha = 255 - Math.min(r, g, b);
    } else {
      alpha = Math.max(r, g, b);
    }
    data[i + 3] = alpha;
  }
  return sharp(data, { raw: { width, height, channels } }).png();
}

async function run() {
  // Logo completo a color (MONKEY amarillo + GRIP negro + mono) fondo blanco -> transparente
  const full = await keyOut(path.join(SRC, 'logo-page-1.png'), 'white');
  await full.trim({ threshold: 10 }).toFile(path.join(OUT, 'logo-full-color.png'));

  // Wordmark amarillo solo (sin mono) fondo blanco -> transparente
  const wordmarkYellow = await keyOut(path.join(SRC, 'logo-page-2.png'), 'white');
  await wordmarkYellow.trim({ threshold: 10 }).toFile(path.join(OUT, 'logo-wordmark-yellow.png'));

  // Icono mono en circulo, fondo blanco -> transparente
  const icon = await keyOut(path.join(SRC, 'logo-page-3.png'), 'white');
  await icon.trim({ threshold: 10 }).toFile(path.join(OUT, 'logo-icon-mono.png'));

  // Wordmark blanco (para fondos negros) fondo negro -> transparente
  const wordmarkWhite = await keyOut(path.join(SRC, 'logo-page-4.png'), 'black');
  await wordmarkWhite.trim({ threshold: 10 }).toFile(path.join(OUT, 'logo-wordmark-white.png'));

  console.log('Logo assets listos en', OUT);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
