/**
 * CATÁLOGO — MONKEY GRIP
 * Fuente: fichas maestras v1.0 (Grips, Monkey Wristbands, Monkey Grip Travel Bag), octubre 2026.
 * Precios en COP. El envío nunca está incluido: se cotiza y se paga por separado.
 *
 * Inventario: `stock` guarda la disponibilidad por SKU (o por color en la Travel Bag).
 * Un código ausente se trata como disponible; poner `false` para marcarlo como agotado.
 * No hay cantidades reales cargadas todavía.
 */
window.MONKEY_CATALOG = {
  products: {
    grips: {
      id: 'grips',
      name: 'Grips',
      url: 'grips.html',
      price: 160000,
      unit: 'par',
      unitPlural: 'pares',
      tagline: 'Adherencia sin magnesio para tus entrenamientos en barra.',
      media: 'light',
      colors: [
        { code: 'NeAzAz', name: 'Negro + azul celeste', swatch: ['#111111', '#3cb7ee'], image: 'assets/img/grips/grips-neazaz.webp', thumb: 'assets/img/grips/grips-neazaz-640.webp' },
        { code: 'FuNeNe', name: 'Fucsia + negro', swatch: ['#ff2f8e', '#111111'], image: 'assets/img/grips/grips-funene.webp', thumb: 'assets/img/grips/grips-funene-640.webp' },
        { code: 'NeBlBl', name: 'Negro + blanco', swatch: ['#111111', '#ffffff'], image: 'assets/img/grips/grips-neblbl.webp', thumb: 'assets/img/grips/grips-neblbl-640.webp' },
        { code: 'VmNaBl', name: 'Verde menta + naranja neón', swatch: ['#7fdcd2', '#ff7a1a'], image: 'assets/img/grips/grips-vmnabl.webp', thumb: 'assets/img/grips/grips-vmnabl-640.webp' },
        { code: 'BlFuFu', name: 'Blanco + fucsia', swatch: ['#ffffff', '#ff2f8e'], image: 'assets/img/grips/grips-blfufu.webp', thumb: 'assets/img/grips/grips-blfufu-640.webp' },
        { code: 'MoVnVn', name: 'Morado + verde neón', swatch: ['#5b22b8', '#a4ff1f'], image: 'assets/img/grips/grips-movnvn.webp', thumb: 'assets/img/grips/grips-movnvn-640.webp' },
      ],
      sizes: [
        { code: 'S', suffix: '001', range: '12–16 cm' },
        { code: 'M', suffix: '002', range: '16–21 cm' },
        { code: 'L', suffix: '003', range: 'más de 21 cm' },
      ],
      sku: function (color, size) { return color.code + '-' + size.suffix; },
      stock: {},
    },

    wristbands: {
      id: 'wristbands',
      name: 'Monkey Wristbands',
      url: 'wristbands.html',
      price: 40000,
      unit: 'par',
      unitPlural: 'pares',
      tagline: 'Muñequeras para controlar el sudor. Par, talla única.',
      media: 'light',
      colors: [
        { code: 'WB-BlFu-001', name: 'Blanco + fucsia', swatch: ['#ffffff', '#ff2f8e'], image: 'assets/img/wristbands/wb-blfu.webp', thumb: 'assets/img/wristbands/wb-blfu-480.webp' },
        { code: 'WB-BlNe-001', name: 'Blanco + negro', swatch: ['#ffffff', '#111111'], image: 'assets/img/wristbands/wb-blne.webp', thumb: 'assets/img/wristbands/wb-blne-480.webp' },
        { code: 'WB-MoVn-001', name: 'Morado + verde neón', swatch: ['#5b22b8', '#a4ff1f'], image: 'assets/img/wristbands/wb-movn.webp', thumb: 'assets/img/wristbands/wb-movn-480.webp' },
        { code: 'WB-NeFu-001', name: 'Negro + fucsia', swatch: ['#111111', '#ff2f8e'], image: 'assets/img/wristbands/wb-nefu.webp', thumb: 'assets/img/wristbands/wb-nefu-480.webp' },
        { code: 'WB-NeNa-001', name: 'Negro + naranja', swatch: ['#111111', '#ff7a1a'], image: 'assets/img/wristbands/wb-nena.webp', thumb: 'assets/img/wristbands/wb-nena-480.webp' },
        { code: 'WB-NeAz-001', name: 'Negro + azul celeste', swatch: ['#111111', '#3cb7ee'], image: 'assets/img/wristbands/wb-neaz.webp', thumb: 'assets/img/wristbands/wb-neaz-480.webp' },
      ],
      sizes: null,
      sku: function (color) { return color.code; },
      stock: {},
    },

    'travel-bag': {
      id: 'travel-bag',
      name: 'Monkey Grip Travel Bag',
      url: 'travel-bag.html',
      price: 460000,
      unit: 'unidad',
      unitPlural: 'unidades',
      tagline: 'Adapta. Organiza. Expande. Incluye los 3 pods.',
      media: 'white',
      colors: [
        { code: 'verde', name: 'Verde', image: 'assets/img/travel-bag/travel-bag-verde.webp', thumb: 'assets/img/travel-bag/travel-bag-verde-560.webp' },
        { code: 'gris', name: 'Gris', image: 'assets/img/travel-bag/travel-bag-gris.webp', thumb: 'assets/img/travel-bag/travel-bag-gris-560.webp' },
        { code: 'negro', name: 'Negro', image: 'assets/img/travel-bag/travel-bag-negro.webp', thumb: 'assets/img/travel-bag/travel-bag-negro-560.webp' },
        { code: 'morado', name: 'Morado', image: 'assets/img/travel-bag/travel-bag-morado.webp', thumb: 'assets/img/travel-bag/travel-bag-morado-560.webp' },
      ],
      sizes: null,
      // La ficha no define SKU para la maleta: el pedido se identifica por color.
      sku: function () { return null; },
      stock: {},
    },
  },

  // Productos de la marca sin ficha comercial ni precio confirmados: solo consulta.
  extras: [
    { id: 'rinonera', name: 'Riñonera Slim', note: 'Lona repelente al agua. Gris, verde y azul.', image: 'assets/img/waistbag/waistbag-infografia.webp' },
    { id: 'ultrarope', name: 'UltraRope', note: 'Maniguetas 100% maquinadas. Azul, morado y rojo.', image: 'assets/img/rope/rope-infografia.webp' },
  ],
};

window.formatCOP = function (value) {
  return '$' + Number(value).toLocaleString('es-CO', { maximumFractionDigits: 0 });
};
