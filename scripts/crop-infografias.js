// Recorta las fotos de las infografías oficiales (solo la parte fotográfica, sin textos)
// para acompañar la información en las fichas. Las infografías completas NO se publican.
// Uso: node scripts/crop-infografias.js [carpeta de salida]  (por defecto, assets del tema)
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const GRIPS = 'C:/Users/Lenovo/Desktop/GRIPS';
const OUT = process.argv[2] || path.join(__dirname, '..', 'shopify-theme', 'assets');
const SRC = {
  grips: path.join(GRIPS, 'Infografía Monkey Grip (1).png'),
  guia: path.join(__dirname, '..', 'shopify', 'media', 'grips-guia-tallas.jpg'),
  wristbands: path.join(GRIPS, 'WhatsApp Image 2026-10-30 at 12.59.48 PM.jpeg'),
  bag: path.join(GRIPS, 'WhatsApp Image 2026-10-30 at 1.00.09 PM.jpeg'),
};

// [archivo, fuente, x, y, ancho, alto]
const CROPS = [
  ['mg-ig-grips-atleta', 'grips', 392, 0, 386, 362],
  ['mg-ig-gripnex', 'grips', 1060, 88, 266, 417, { recolor: [[40, 200, 60, 70, 'cyan', 'right']], isolate: 258 }],
  ['mg-ig-gripnex-zoom', 'grips', 878, 169, 174, 174, { circle: [86.5, 86.5, 85] }],
  ['mg-ig-barra-lisa', 'grips', 1338, 89, 96, 60],
  ['mg-ig-barra-corrugada', 'grips', 1338, 156, 96, 60],
  ['mg-ig-barra-pintada', 'grips', 1338, 222, 96, 60],
  ['mg-ig-barra-electrostatica', 'grips', 1338, 290, 96, 60],
  ['mg-ig-barra-oxidada', 'grips', 1338, 357, 96, 60],
  ['mg-ig-polygrip', 'grips', 15, 690, 314, 206],
  ['mg-ig-caucho', 'grips', 331, 557, 58, 56],
  ['mg-ig-silice', 'grips', 331, 618, 58, 56],
  ['mg-ig-goma-miel', 'grips', 331, 679, 58, 56],
  ['mg-ig-aceites', 'grips', 331, 741, 58, 56],
  ['mg-ig-aditivos', 'grips', 331, 804, 58, 56],
  ['mg-ig-forgex', 'grips', 515, 690, 362, 206],
  ['mg-ig-grips-colores', 'grips', 1040, 655, 492, 114],
  ['mg-ig-guia-muneca', 'guia', 282, 430, 488, 838],
  ['mg-ig-wb-manos', 'wristbands', 402, 0, 434, 432],
  ['mg-ig-wb-vista', 'wristbands', 860, 58, 430, 288, { recolor: [[330, 70, 100, 90, 'yellow', 'vertical'], [385, 105, 45, 30, 'orange', 'vertical']] }],
  ['mg-ig-wb-tejido', 'wristbands', 1336, 171, 172, 172],
  ['mg-ig-wb-algodon', 'wristbands', 688, 480, 82, 82],
  ['mg-ig-wb-elastomero', 'wristbands', 803, 480, 82, 82],
  ['mg-ig-wb-nylon', 'wristbands', 916, 480, 82, 82],
  ['mg-ig-wb-detalle-logo', 'wristbands', 1030, 477, 155, 113],
  ['mg-ig-wb-detalle-acabados', 'wristbands', 1197, 477, 155, 113],
  ['mg-ig-wb-detalle-textura', 'wristbands', 1368, 477, 155, 113],
  ['mg-ig-wb-uso-pesas', 'wristbands', 1168, 676, 111, 152],
  ['mg-ig-wb-uso-gimnasia', 'wristbands', 1283, 676, 126, 152],
  ['mg-ig-wb-uso-general', 'wristbands', 1414, 676, 110, 152],
  ['mg-ig-tb-frontal', 'bag', 25, 515, 143, 257],
  ['mg-ig-tb-lateral', 'bag', 168, 515, 124, 257],
  ['mg-ig-tb-posterior', 'bag', 292, 515, 134, 257],
  ['mg-ig-tb-superior', 'bag', 426, 515, 122, 257],
  ['mg-ig-tb-sin-accesorios', 'bag', 838, 550, 164, 240],
  ['mg-ig-tb-materiales', 'bag', 22, 1180, 136, 216],
  ['mg-ig-tb-ergonomia', 'bag', 355, 1180, 147, 216],
  ['mg-ig-tb-detalles', 'bag', 690, 1180, 132, 216],
];

// Limpieza de restos de la infografía: copy = tapar texto o líneas con un trozo de fondo limpio,
// circle = negro fuera del círculo, recolor = borrar puntos/líneas de un color tomando el píxel vecino.
const MATCH = {
  yellow: (r, g, b) => g > 120 && b < Math.min(r, g) - 15,
  orange: (r, g, b) => r > 150 && g > 60 && g < 200 && b < 100,
  cyan: (r, g, b) => b > 120 && g > 90 && r < 70 && b > r + 80,
};
async function clean(input, width, height, opts) {
  const { data } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => (y * width + x) * 3;
  for (const [sx, sy, w, h, dx, dy] of opts.copy || []) {
    const src = Buffer.from(data);
    for (let y = 0; y < h; y++) src.copy(data, px(dx, dy + y), px(sx, sy + y), px(sx + w, sy + y));
  }
  if (opts.circle) {
    const [cx, cy, r] = opts.circle;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) data.fill(0, px(x, y), px(x, y) + 3);
    }
  }
  for (const [rx, ry, rw, rh, color, from] of opts.recolor || []) {
    const hit = (x, y) => MATCH[color](data[px(x, y)], data[px(x, y) + 1], data[px(x, y) + 2]);
    for (let y = ry; y < Math.min(ry + rh, height); y++) for (let x = rx; x < Math.min(rx + rw, width); x++) {
      if (!hit(x, y)) continue;
      for (let d = 1; d < 40; d++) {
        const cand = from === 'left' ? [[x - d, y]] : from === 'right' ? [[x + d, y]] : [[x, y + d], [x, y - d]];
        const ok = cand.find(([cx, cy]) => cx >= 0 && cx < width && cy >= 0 && cy < height && !hit(cx, cy));
        if (ok) { data.copy(data, px(x, y), px(ok[0], ok[1]), px(ok[0], ok[1]) + 3); break; }
      }
    }
  }
  if (opts.isolate) {
    // Fondo negro alrededor del grip turquesa (filas por encima de la correa), con borde suavizado.
    const grip = (i) => data[i + 1] > 150 && data[i + 2] > 130 && data[i] > 60 && data[i] < 190 && data[i + 1] > data[i] + 50;
    for (let y = 0; y < opts.isolate; y++) {
      let first = -1, last = -1;
      for (let x = 0; x < width; x++) if (grip(px(x, y))) { if (first < 0) first = x; last = x; }
      for (let x = 0; x < width; x++) {
        const dist = first < 0 ? 99 : Math.max(first - x, x - last, 0);
        const keep = dist === 0 ? 1 : Math.max(0, 1 - dist / 4);
        for (let c = 0; c < 3; c++) data[px(x, y) + c] = Math.round(data[px(x, y) + c] * keep);
      }
    }
  }
  return sharp(data, { raw: { width, height, channels: 3 } });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, src, left, top, width, height, opts] of CROPS) {
    // Las piezas pequeñas se duplican con lanczos para que el navegador no las estire peor.
    const scale = width < 400 ? 2 : 1;
    let img = sharp(SRC[src]).extract({ left, top, width, height });
    if (opts) img = await clean(await img.toBuffer(), width, height, opts);
    await img
      .resize(width * scale, height * scale, { kernel: 'lanczos3' })
      .sharpen(scale > 1 ? { sigma: 0.6 } : undefined)
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(OUT, `${name}.jpg`));
    console.log(`${name}.jpg ${width * scale}x${height * scale}`);
  }
})();
