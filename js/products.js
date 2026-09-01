/**
 * CATÁLOGO DE PRODUCTOS — MONKEY GRIP
 * Estructura separada de la marca/config para poder agregar productos,
 * variantes de color, precios y stock de forma independiente.
 */
window.MONKEY_PRODUCTS = {
  categories: [
    {
      slug: 'grips',
      name: 'Grips',
      short: 'Domina cada repetición',
      href: '#grips',
      image: 'assets/img/grips/grip-amarillo.webp',
    },
    {
      slug: 'ultrarope',
      name: 'UltraRope',
      short: 'Velocidad sin fricción',
      href: '#ultrarope',
      image: 'assets/img/rope/rope-infografia.webp',
    },
    {
      slug: 'backpack',
      name: 'Backpack',
      short: 'Todo tu equipo, un lugar',
      href: '#backpack',
      image: 'assets/img/backpack/backpack-hero.webp',
    },
    {
      slug: 'riñonera',
      name: 'Riñoneras',
      short: 'Rendimiento que va contigo',
      href: '#riñoneras',
      image: 'assets/img/waistbag/waistbag-infografia.webp',
    },
  ],

  // Variantes reales de color disponibles en fotografía de producto.
  grips: [
    { slug: 'amarillo', label: 'Amarillo', hex: '#FFEC00', image: 'assets/img/grips/grip-amarillo.webp' },
    { slug: 'rojo', label: 'Rojo', hex: '#E7302B', image: 'assets/img/grips/grip-rojo.webp' },
    { slug: 'rosa', label: 'Rosa Neón', hex: '#FF3D68', image: 'assets/img/grips/grip-rosa.webp' },
    { slug: 'morado', label: 'Morado', hex: '#5B2E8C', image: 'assets/img/grips/grip-morado.webp' },
    { slug: 'lavanda', label: 'Lavanda', hex: '#B7A6DE', image: 'assets/img/grips/grip-lavanda.webp' },
    { slug: 'celeste', label: 'Celeste', hex: '#7FD6EA', image: 'assets/img/grips/grip-celeste.webp' },
    { slug: 'negro-cyan', label: 'Negro Cyan', hex: '#22B8D6', image: 'assets/img/grips/grip-negro-cyan.webp' },
    { slug: 'verde', label: 'Verde', hex: '#79C143', image: 'assets/img/grips/grip-verde.webp' },
  ],

  waistbagColors: [
    { slug: 'gris', label: 'Gris' },
    { slug: 'verde', label: 'Verde' },
    { slug: 'azul', label: 'Azul' },
  ],

  ropeColors: [
    { slug: 'azul', label: 'Azul', hex: '#2452C8' },
    { slug: 'morado', label: 'Morado', hex: '#8A2BE2' },
    { slug: 'rojo', label: 'Rojo', hex: '#D6231E' },
  ],
};
