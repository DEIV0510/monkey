// Arma templates/index.json (portada) y ajusta templates/product.json del tema de Shopify.
// Los productos se referencian por handle (los creados con scripts/build-shopify-csv.js).
const fs = require('fs');
const path = require('path');

const THEME = path.join(__dirname, '..', 'shopify-theme');

const blocks = (type, list) => {
  const out = { blocks: {}, block_order: [] };
  list.forEach((settings, i) => {
    const id = `${type}-${i + 1}`;
    out.blocks[id] = { type, settings };
    out.block_order.push(id);
  });
  return out;
};
const feats = (list) => blocks('feature', list.map((text) => ({ text })));

const index = {
  sections: {
    hero: {
      type: 'mg-hero',
      settings: {
        kicker: 'Performance Gear · CrossFit',
        title_line_1: 'Agarra más.',
        title_line_2: 'Rinde más.',
        text: 'Equipamiento premium diseñado para llevar tu rendimiento al siguiente nivel. Fabricado por colombianos para los CrossFitters del mundo.',
        button_1_label: 'Comprar ahora',
        button_1_link: 'shopify://collections/all',
        button_2_label: 'Ver productos',
        button_2_link: '#categorias',
        trust_1: 'Diseño premium',
        trust_2: 'Hecho en Colombia',
        trust_3: 'Pensado para atletas',
        product: 'monkey-hand-grip',
        tag_title: 'Monkey Hand Grip',
        tag_text: 'Caucho de alto rendimiento',
        color_scheme: 'scheme-1',
      },
    },
    categorias: {
      type: 'mg-categories',
      settings: { eyebrow: 'Catálogo', title: 'Equipamiento para\nrendir al máximo', color_scheme: 'scheme-1' },
      ...blocks('category', [
        { product: 'monkey-hand-grip', title: 'Grips', text: 'Domina cada repetición', link_label: 'Ver colección', image_position: 'object-position: center' },
        { product: 'ultrarope', title: 'UltraRope', text: 'Velocidad sin fricción', link_label: 'Ver colección', image_position: 'object-position: 15% center' },
        { product: 'monkey-backpack', title: 'Backpack', text: 'Todo tu equipo, un lugar', link_label: 'Ver colección', image_position: 'object-position: center' },
        { product: 'rinonera-slim', title: 'Riñoneras', text: 'Rendimiento que va contigo', link_label: 'Ver colección', image_position: 'object-position: 15% center' },
      ]),
    },
    grips: {
      type: 'mg-grip-showcase',
      settings: {
        product: 'monkey-hand-grip',
        option_name: 'Color',
        color_map: 'Amarillo:#FFEC00\nRojo:#E7302B\nRosa Neón:#FF3D68\nMorado:#5B2E8C\nLavanda:#B7A6DE\nCeleste:#7FD6EA\nNegro Cyan:#22B8D6\nVerde:#79C143',
        eyebrow: 'Producto insignia',
        title: 'Tu agarre no\ndebería ser el\nlímite.',
        text: 'Hand grips fabricados en compuesto de caucho específicamente modificado para un alto rendimiento.',
        button_label: 'Ver Grips',
        anchor: 'grips',
        color_scheme: 'scheme-1',
      },
      ...feats(['Sistema multicapa de bloqueo', 'Doble neopreno de confort', 'Herraje acerado electrosoldado', 'Velcro 100% nylon']),
    },
    tecnologia: {
      type: 'mg-tech',
      settings: { eyebrow: 'Ingeniería del agarre', title: 'Diseñado para\nresistir.', product: 'monkey-hand-grip', image_index: 9, color_scheme: 'scheme-2' },
      ...blocks('item', [
        { title: 'Agarre seguro', text: 'Sistema de bloqueo multicapa en ejes X, Y, Z y anti-torsión.' },
        { title: 'Máxima comodidad', text: 'Doble capa de neopreno que evita talladuras durante el WOD.' },
        { title: 'Materiales resistentes', text: 'Herraje acerado electrosoldado y velcro 100% nylon.' },
        { title: 'Alto rendimiento', text: 'Compuesto de caucho modificado para atletas exigentes.' },
      ]),
    },
    backpack: {
      type: 'mg-split',
      settings: {
        product: 'monkey-backpack', image_index: 1, show_gallery: true, reverse: false,
        eyebrow: 'Equipamiento diario', title: 'Todo tu equipo.\nUn solo lugar.',
        text: 'Diseñada para acompañarte dentro y fuera del box.',
        colors: '', button_label: 'Ver Backpack', anchor: 'backpack', color_scheme: 'scheme-1',
      },
      ...feats([
        'Compartimento principal tipo baúl, 100% libre',
        'Bolsillo lateral expandible para termos y shakers',
        'Bolsillo de seguridad oculto para objetos de valor',
        'Doble organización interna: cremallera + malla',
      ]),
    },
    rinoneras: {
      type: 'mg-split',
      settings: {
        product: 'rinonera-slim', image_index: 1, show_gallery: false, reverse: true,
        eyebrow: 'Lifestyle · Urbano', title: 'Rendimiento que\nva contigo.',
        text: 'Riñonera Slim en lona repelente al agua, pensada para tu día a día dentro y fuera del box.',
        colors: 'Gris:#8a8f94, Verde:#5c6b3f, Azul:#3b4a5a', button_label: 'Ver Riñoneras', anchor: 'rinoneras', color_scheme: 'scheme-2',
      },
      ...feats([
        'Bolsillo frontal y compartimento vertical de gran apertura',
        'Bolsillos laterales para monedas o llaves',
        'Compartimento resguardado en la parte trasera',
        'Lona repelente al agua',
      ]),
    },
    ultrarope: {
      type: 'mg-split',
      settings: {
        product: 'ultrarope', image_index: 1, show_gallery: false, reverse: false,
        eyebrow: 'Speed Rope', title: 'Velocidad que\nno se detiene.',
        text: 'Maniguetas 100% maquinadas para dobles unders sin fricción, WOD tras WOD.',
        colors: 'Azul:#2452c8, Morado:#8a2be2, Rojo:#d6231e', button_label: 'Ver UltraRope', anchor: 'ultrarope', color_scheme: 'scheme-1',
      },
      ...feats([
        'Doble rodamiento flotante sin fricción',
        'Guaya acerada recubierta en PVC',
        'Bujes de peso para alto volumen de repeticiones',
        'Incluye llave Bristol y repuestos',
      ]),
    },
    porque: {
      type: 'mg-why',
      settings: { eyebrow: 'Por qué Monkey Grip', title: 'Hecho para atletas\nque exigen más.', color_scheme: 'scheme-2' },
      ...blocks('reason', [
        { icon: 'spark', title: 'Diseño premium', text: 'Hecho para atletas exigentes.' },
        { icon: 'layers', title: 'Hecho en Colombia', text: 'Diseñado y elaborado localmente.' },
        { icon: 'pulse', title: 'Alto rendimiento', text: 'Pensado para acompañar tus entrenamientos.' },
        { icon: 'users', title: 'Comunidad Monkey', text: 'Para quienes buscan superar sus límites.' },
      ]),
    },
    nosotros: {
      type: 'mg-about',
      settings: {
        eyebrow: 'Nuestra historia',
        title: 'Hecho en Colombia.\nListo para el mundo.',
        text: '<p>Monkey Grip crea indumentaria premium para CrossFitters que exigen más de su equipo. Diseñado y elaborado por colombianos para atletas de todo el mundo.</p>',
        button_label: 'Conoce nuestra historia',
        color_scheme: 'scheme-1',
      },
    },
    instagram: {
      type: 'mg-instagram',
      settings: {
        eyebrow: 'Comunidad', title: 'Sigue el\nmovimiento.',
        products: ['monkey-hand-grip', 'monkey-backpack', 'ultrarope', 'rinonera-slim'],
        limit: 6, per_product: 2, color_scheme: 'scheme-1',
      },
    },
    final: {
      type: 'mg-final-cta',
      settings: {
        eyebrow: 'Monkey Grip',
        title: '¿Listo para mejorar\ntu rendimiento?',
        text: 'Equipamiento premium hecho en Colombia, diseñado para atletas que no negocian su rendimiento.',
        button_label: 'Comprar ahora',
        button_link: 'shopify://collections/all',
        color_scheme: 'scheme-1',
      },
    },
  },
  order: ['hero', 'categorias', 'grips', 'tecnologia', 'backpack', 'rinoneras', 'ultrarope', 'porque', 'nosotros', 'instagram', 'final'],
};
fs.writeFileSync(path.join(THEME, 'templates', 'index.json'), JSON.stringify(index, null, 2) + '\n');

const productPath = path.join(THEME, 'templates', 'product.json');
const product = JSON.parse(fs.readFileSync(productPath, 'utf8'));
const main = product.sections.main;
main.blocks.share.settings.share_label = 'Compartir';
Object.assign(main.settings, { gallery_layout: 'thumbnail_slider', mobile_thumbnails: 'show', media_size: 'medium' });
Object.assign(product.sections['related-products'].settings, { heading: 'También te puede gustar', color_scheme: 'scheme-1' });
fs.writeFileSync(productPath, JSON.stringify(product, null, 2) + '\n');

console.log('index.json y product.json listos');
