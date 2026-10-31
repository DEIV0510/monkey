// Genera shopify/productos.csv para Productos → Importar en el admin de Shopify.
// Solo datos reales (infografías de la marca). Precio 0 = "Precio por WhatsApp" en el tema.
const fs = require('fs');
const path = require('path');

const IMG = 'https://monkey-eta-ruby.vercel.app/assets/img';

const COLUMNS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Variant Price', 'Variant Inventory Policy',
  'Variant Fulfillment Service', 'Variant Requires Shipping', 'Variant Taxable',
  'Image Src', 'Image Position', 'Image Alt Text', 'Variant Image', 'Status',
];

const list = (items) => '<ul>' + items.map((i) => `<li>${i}</li>`).join('') + '</ul>';

const products = [
  {
    handle: 'monkey-hand-grip',
    title: 'Monkey Hand Grip',
    type: 'Grips',
    tags: 'Grips',
    body: '<p>Hand grip fabricado en compuesto de cauchos específicamente modificados para un alto rendimiento.</p>' + list([
      'Sistema de 4 capas de bloqueo: ejes X, Y, Z y anti-torsión',
      '5.ª capa de confort',
      'Capa de doble neopreno para mayor confort y evitar las talladuras durante los WODs',
      'Herraje acerado electrosoldado para una resistencia única',
      'Velcro 100% nylon',
    ]),
    option: 'Color',
    variants: [
      ['Amarillo', `${IMG}/grips/grip-amarillo.webp`],
      ['Rojo', `${IMG}/grips/grip-rojo.webp`],
      ['Rosa Neón', `${IMG}/grips/grip-rosa.webp`],
      ['Morado', `${IMG}/grips/grip-morado.webp`],
      ['Lavanda', `${IMG}/grips/grip-lavanda.webp`],
      ['Celeste', `${IMG}/grips/grip-celeste.webp`],
      ['Negro Cyan', `${IMG}/grips/grip-negro-cyan.webp`],
      ['Verde', `${IMG}/grips/grip-verde.webp`],
    ],
    extraImages: [[`${IMG}/grips/grip-construction.webp`, 'Construcción multicapa del Monkey Hand Grip']],
  },
  {
    handle: 'ultrarope',
    title: 'UltraRope',
    type: 'Cuerdas',
    tags: 'UltraRope',
    body: '<p>Cuerda de velocidad con maniguetas 100% maquinadas.</p>' + list([
      'Doble rodamiento flotante sin fricción',
      'Bujes de peso para alto volumen de repeticiones',
      'Guaya acerada recubierta en PVC',
      'Incluye llave Bristol y repuestos',
    ]),
    option: 'Color',
    variants: [['Azul'], ['Morado'], ['Rojo']],
    images: [[`${IMG}/rope/rope-infografia.webp`, 'UltraRope en azul, morado y rojo']],
  },
  {
    handle: 'monkey-backpack',
    title: 'Monkey BackPack',
    type: 'Backpacks',
    tags: 'Backpack',
    body: '<p>La Monkey BackPack está pensada para cada momento de tu día a día: no importa a qué actividad te dediques, siempre vas a poder llevar todas tus cosas de manera ordenada y segura.</p>' + list([
      'Compartimento principal con apertura tipo baúl 100% libre',
      'Protección posterior: compartimento para PC forrado en neopreno anti-impactos',
      'Bolsillo superior de acceso rápido para objetos pequeños y esenciales',
      'Bolsillo lateral expandible, compatible con termos de alto cilindraje y shakers',
      'Bolsillo de seguridad oculto en la parte trasera, con protección antirrobo',
      'Bolsillo secundario de profundidad total con compartimentos de malla',
      'Exterior con velcro para parches y reatas para mosquetones y accesorios',
      'Espacio para calzado o kit de aseo post-WOD, con barrera contra la humedad y olores',
    ]),
    option: 'Title',
    variants: [['Default Title']],
    images: [
      [`${IMG}/backpack/backpack-hero.webp`, 'Monkey BackPack'],
      [`${IMG}/backpack/backpack-infografia-1.webp`, 'Compartimentos de la Monkey BackPack'],
      [`${IMG}/backpack/backpack-infografia-2.webp`, 'Organización interna de la Monkey BackPack'],
    ],
  },
  {
    handle: 'rinonera-slim',
    title: 'Riñonera Slim',
    type: 'Riñoneras',
    tags: 'Riñoneras',
    body: '<p>Riñonera Slim en lona repelente al agua.</p>' + list([
      'Bolsillo frontal y compartimento vertical de gran apertura',
      'Compartimento superior de tamaño medio',
      'Bolsillos laterales para monedas o llaves',
      'Compartimento resguardado en la parte trasera',
      'Amplio panel de velcro para personalización',
    ]),
    option: 'Color',
    variants: [['Gris'], ['Verde'], ['Azul']],
    images: [[`${IMG}/waistbag/waistbag-infografia.webp`, 'Riñonera Slim en gris, verde y azul']],
  },
];

const rows = [];
for (const p of products) {
  const images = p.images
    || p.variants.map(([value, src]) => [src, `${p.title} ${value}`]).concat(p.extraImages || []);
  const total = Math.max(p.variants.length, images.length);
  for (let i = 0; i < total; i++) {
    const row = Object.fromEntries(COLUMNS.map((c) => [c, '']));
    row.Handle = p.handle;
    if (i === 0) {
      Object.assign(row, {
        Title: p.title, 'Body (HTML)': p.body, Vendor: 'Monkey Grip', Type: p.type,
        Tags: p.tags, Published: 'TRUE', 'Option1 Name': p.option, Status: 'active',
      });
    }
    const variant = p.variants[i];
    if (variant) {
      Object.assign(row, {
        'Option1 Value': variant[0], 'Variant Price': '0', 'Variant Inventory Policy': 'continue',
        'Variant Fulfillment Service': 'manual', 'Variant Requires Shipping': 'TRUE',
        'Variant Taxable': 'TRUE', 'Variant Image': variant[1] || '',
      });
    }
    const image = images[i];
    if (image) {
      Object.assign(row, { 'Image Src': image[0], 'Image Position': String(i + 1), 'Image Alt Text': image[1] });
    }
    rows.push(row);
  }
}

const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const csv = [COLUMNS.join(',')].concat(rows.map((r) => COLUMNS.map((c) => esc(r[c])).join(','))).join('\n') + '\n';

const outDir = path.join(__dirname, '..', 'shopify');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'productos.csv'), csv, 'utf8');
console.log(`${rows.length} filas, ${products.length} productos → shopify/productos.csv`);
