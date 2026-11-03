// Genera shopify/productos-v2.csv (Productos → Importar) con el catálogo oficial v1.0.
// Fotos desde GitHub (shopify/media): Shopify las copia a su CDN al importar.
const fs = require('fs');
const path = require('path');

const MEDIA = 'https://raw.githubusercontent.com/DEIV0510/monkey/main/shopify/media';

const COLUMNS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
  'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Policy',
  'Variant Fulfillment Service', 'Variant Price', 'Variant Requires Shipping', 'Variant Taxable',
  'Image Src', 'Image Position', 'Image Alt Text', 'Variant Image', 'Variant Weight Unit',
  'SEO Title', 'SEO Description', 'Status',
];

const p = (t) => `<p>${t}</p>`;
const ul = (items) => '<ul>' + items.map((i) => `<li>${i}</li>`).join('') + '</ul>';

const products = [
  {
    handle: 'grips',
    title: 'Grips',
    type: 'Grips',
    tags: 'Grips',
    seoTitle: 'Grips sin magnesio — Monkey Grip',
    seoDescription: 'Grips con adherencia sin magnesio: GRIPNEX™, POLYGRIP™, FORGEX™ y MG-FUSION™. Seis colores, tallas S, M y L. $160.000 COP por par.',
    price: 160000,
    body: [
      p('Entrena con Grips de Monkey Grip y disfruta de un agarre sin necesidad de magnesio. La tecnología GRIPNEX™ ofrece adherencia en barras lisas, corrugadas, pintadas, lacadas, con pintura electrostática y oxidadas.'),
      p('POLYGRIP™ integra un compuesto polimérico de base caucho que combina adherencia, flexibilidad, confort y durabilidad. FORGEX™ aporta una estructura de cinco capas internas con funciones diferenciadas, diseñada para responder a las exigencias mecánicas en los ejes longitudinal, transversal y perpendicular. MG-FUSION™ es el proceso de fabricación propio desarrollado desde cero por Monkey Grip para integrar los materiales y construir el producto final.'),
      p('Elige entre seis combinaciones de color y tres tallas según el perímetro de tu muñeca. Cada compra corresponde a un par. Precio: $160.000 COP por par, con envío pagado por separado. Garantía comercial de 3 meses.'),
    ].join(''),
    options: ['Color', 'Talla'],
    colors: [
      ['Negro + azul celeste', 'NeAzAz', 'grips-neazaz.jpg'],
      ['Fucsia + negro', 'FuNeNe', 'grips-funene.jpg'],
      ['Negro + blanco', 'NeBlBl', 'grips-neblbl.jpg'],
      ['Verde menta + naranja neón', 'VmNaBl', 'grips-vmnabl.jpg'],
      ['Blanco + fucsia', 'BlFuFu', 'grips-blfufu.jpg'],
      ['Morado + verde neón', 'MoVnVn', 'grips-movnvn.jpg'],
    ],
    sizes: [['S', '001'], ['M', '002'], ['L', '003']],
    // Las infografías solo son fuente de información: no se suben como fotos del producto.
    extraImages: [],
  },
  {
    handle: 'monkey-wristbands',
    title: 'Monkey Wristbands',
    type: 'Muñequeras',
    tags: 'Wristbands',
    seoTitle: 'Monkey Wristbands — Muñequeras deportivas | Monkey Grip',
    seoDescription: 'Muñequeras deportivas para controlar el sudor, con ajuste elástico y talla única. Seis colores. $40.000 COP por par.',
    price: 40000,
    body: [
      p('Las Monkey Wristbands son muñequeras deportivas fabricadas con una combinación de algodón, elastómero y nylon. Están diseñadas para ayudar a controlar el sudor durante el entrenamiento, permitir limpiar la humedad de la frente y el rostro y proporcionar mayor confort en las muñecas.'),
      p('Su tejido elástico se adapta a diferentes medidas de muñeca, con un diseño práctico para el entrenamiento.'),
      ul([
        'Ayudan a controlar el sudor antes de que llegue a las manos.',
        'Permiten limpiar el sudor de la frente y el rostro.',
        'Proporcionan confort adicional alrededor de las muñecas.',
        'Se adaptan a distintas medidas de muñeca gracias a su elasticidad.',
        'Incorporan una combinación de algodón, elastómero y nylon.',
      ]),
    ].join(''),
    options: ['Color'],
    colors: [
      ['Blanco + fucsia', 'WB-BlFu-001', 'wristbands-blfu.jpg'],
      ['Blanco + negro', 'WB-BlNe-001', 'wristbands-blne.jpg'],
      ['Morado + verde neón', 'WB-MoVn-001', 'wristbands-movn.jpg'],
      ['Negro + fucsia', 'WB-NeFu-001', 'wristbands-nefu.jpg'],
      ['Negro + naranja', 'WB-NeNa-001', 'wristbands-nena.jpg'],
      ['Negro + azul celeste', 'WB-NeAz-001', 'wristbands-neaz.jpg'],
    ],
    extraImages: [],
  },
  {
    handle: 'monkey-grip-travel-bag',
    title: 'Monkey Grip Travel Bag',
    type: 'Maletas',
    tags: 'Travel Bag',
    seoTitle: 'Monkey Grip Travel Bag — Sistema MODEX™ | Monkey Grip',
    seoDescription: 'Maleta con sistema MODEX™: 50 L base y hasta 60 L expandida, tres pods incluidos. Verde, gris, negro y morado. $460.000 COP + envío.',
    price: 460000,
    grams: 816, // 1.8 lb declaradas en la ficha (sin accesorios)
    weightUnit: 'lb',
    body: [
      p('Una maleta para entrenar, viajar y acompañar tu día. MODEX™ Modular Expansion System combina una capacidad base declarada de 50 L con tres módulos para organizar tus esenciales, tu equipo y tu carga. Hasta 60 L de capacidad expandida.'),
      p('Lleva tu rutina en una sola maleta. Monkey Grip Travel Bag integra el sistema MODEX™ para adaptar la organización de tus pertenencias a tus actividades. QUICK POD ofrece acceso a tus esenciales; GEAR POD ayuda a organizar implementos y accesorios; CARGO POD aporta espacio para separar calzado, ropa u otros objetos.'),
      p('Su exterior está elaborado en lona tipo huracán repelente al agua, con malla tipo cáñamo con apresto y forro en lona tipo seda. Incorpora cremalleras militares, hebillas de policarbonato inyectado y reatas multifilamento. Disponible en verde, gris, negro y morado.'),
      p('Incluye la maleta y los tres módulos: QUICK POD, GEAR POD y CARGO POD. Garantía de 6 meses.'),
    ].join(''),
    options: ['Color'],
    colors: [
      ['Verde', '', 'travel-bag-verde.jpg'],
      ['Gris', '', 'travel-bag-gris.jpg'],
      ['Negro', '', 'travel-bag-negro.jpg'],
      ['Morado', '', 'travel-bag-morado.jpg'],
    ],
    extraImages: [],
  },
];

const rows = [];
for (const prod of products) {
  const variants = [];
  for (const [colorName, code, file] of prod.colors) {
    if (prod.sizes) {
      for (const [size, suffix] of prod.sizes) variants.push({ o1: colorName, o2: size, sku: `${code}-${suffix}`, file });
    } else {
      variants.push({ o1: colorName, o2: '', sku: code, file });
    }
  }
  const images = prod.colors.map(([colorName, , file]) => [file, `${prod.title} ${colorName}: fotografía real`]).concat(prod.extraImages);
  const total = Math.max(variants.length, images.length);
  for (let i = 0; i < total; i++) {
    const row = Object.fromEntries(COLUMNS.map((c) => [c, '']));
    row.Handle = prod.handle;
    if (i === 0) {
      Object.assign(row, {
        Title: prod.title, 'Body (HTML)': prod.body, Vendor: 'Monkey Grip', Type: prod.type, Tags: prod.tags,
        Published: 'TRUE', 'SEO Title': prod.seoTitle, 'SEO Description': prod.seoDescription, Status: 'active',
      });
    }
    const v = variants[i];
    if (v) {
      Object.assign(row, {
        'Option1 Name': prod.options[0], 'Option1 Value': v.o1,
        'Option2 Name': prod.options[1] || '', 'Option2 Value': v.o2,
        'Variant SKU': v.sku, 'Variant Grams': String(prod.grams || 0),
        'Variant Inventory Tracker': 'shopify', 'Variant Inventory Policy': 'continue',
        'Variant Fulfillment Service': 'manual', 'Variant Price': String(prod.price),
        'Variant Requires Shipping': 'TRUE', 'Variant Taxable': 'TRUE',
        'Variant Image': `${MEDIA}/${v.file}`, 'Variant Weight Unit': prod.weightUnit || 'g',
      });
    }
    const img = images[i];
    if (img) Object.assign(row, { 'Image Src': `${MEDIA}/${img[0]}`, 'Image Position': String(i + 1), 'Image Alt Text': img[1] });
    rows.push(row);
  }
}

const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const csv = [COLUMNS.join(',')].concat(rows.map((r) => COLUMNS.map((c) => esc(r[c])).join(','))).join('\n') + '\n';
const out = path.join(__dirname, '..', 'shopify', 'productos-v2.csv');
fs.writeFileSync(out, csv, 'utf8');
console.log(`${rows.length} filas · ${products.length} productos · ${rows.filter((r) => r['Variant SKU'] || r['Option1 Value']).length} variantes → ${path.relative(process.cwd(), out)}`);
