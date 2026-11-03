// Genera las plantillas JSON del tema Shopify (portada y fichas) con el contenido de las fichas maestras v1.0.
// OJO: sobrescribe lo que se haya editado en Personalizar; antes bajar el tema con `theme pull` y comparar.
const fs = require('fs');
const path = require('path');

const THEME = path.join(__dirname, '..', 'shopify-theme');
const write = (rel, data) => fs.writeFileSync(path.join(THEME, rel), JSON.stringify(data, null, 2) + '\n');

const blocks = (type, list) => {
  const out = { blocks: {}, block_order: [] };
  list.forEach((settings, i) => {
    const id = `${type}-${i + 1}`;
    out.blocks[id] = { type: settings._type || type, settings: Object.fromEntries(Object.entries(settings).filter(([k]) => k !== '_type')) };
    out.block_order.push(id);
  });
  return out;
};
const lines = (arr) => arr.join('\n');

const GRIP_COLORS = lines([
  'Negro + azul celeste|#111111|#3cb7ee',
  'Fucsia + negro|#ff2f8e|#111111',
  'Negro + blanco|#111111|#ffffff',
  'Verde menta + naranja neón|#7fdcd2|#ff7a1a',
  'Blanco + fucsia|#ffffff|#ff2f8e',
  'Morado + verde neón|#5b22b8|#a4ff1f',
]);
const WB_COLORS = lines([
  'Blanco + fucsia|#ffffff|#ff2f8e',
  'Blanco + negro|#ffffff|#111111',
  'Morado + verde neón|#5b22b8|#a4ff1f',
  'Negro + fucsia|#111111|#ff2f8e',
  'Negro + naranja|#111111|#ff7a1a',
  'Negro + azul celeste|#111111|#3cb7ee',
]);

/* ---------- Portada ---------- */
write('templates/index.json', {
  sections: {
    hero: {
      type: 'mg-hero',
      settings: {
        product: 'grips',
        kicker: 'Grips · Tecnología GRIPNEX™',
        title_line_1: 'Adherencia extrema.',
        title_line_2: 'Sin magnesio.',
        text: 'Agarre en barras lisas, corrugadas, pintadas, lacadas, con pintura electrostática y oxidadas.',
        price_note: 'COP por par · envío aparte',
        button_1_label: 'Comprar Grips',
        button_2_label: 'Ver productos',
        button_2_link: '#productos',
        colors_label: '6 colores',
        colors: GRIP_COLORS,
        color_scheme: 'scheme-1',
      },
    },
    trust: {
      type: 'mg-trust',
      settings: { color_scheme: 'scheme-1' },
      ...blocks('item', [
        { icon: 'pin', text: '<strong>Hecho en Colombia</strong> por Monkey Grip' },
        { icon: 'layers', text: 'Proceso de fabricación propio <strong>MG-FUSION™</strong>' },
        { icon: 'shield', text: '<strong>Garantía comercial de 3 meses</strong> en Grips' },
      ]),
    },
    productos: {
      type: 'mg-products',
      settings: { title: 'Equipamiento para\nrendir al máximo', text: 'Precios por producto. El envío se cotiza y se paga aparte.', anchor: 'productos', color_scheme: 'scheme-1' },
      ...blocks('product', [
        { product: 'grips', tagline: 'Adherencia sin magnesio. Tallas S, M y L.', price_note: 'COP por par', colors: GRIP_COLORS, note: '', media_bg: 'light', button_label: 'Ver y comprar' },
        { product: 'monkey-wristbands', tagline: 'Control de sudor. Par, talla única.', price_note: 'COP por par', colors: WB_COLORS, note: '', media_bg: 'light', button_label: 'Ver y comprar' },
        { product: 'monkey-grip-travel-bag', tagline: '50 L base, hasta 60 L. Incluye 3 pods.', price_note: 'COP + envío', colors: '', note: 'Verde · Gris · Negro · Morado', media_bg: 'white', button_label: 'Ver y comprar' },
      ]),
    },
    tecnologias: {
      type: 'mg-band',
      settings: {
        product: 'grips',
        title_line_1: 'Cuatro tecnologías.',
        title_line_2: 'Un agarre.',
        button_label: 'Ver ficha de Grips',
        asset: 'mg-ig-gripnex.jpg',
        asset_w: 532,
        asset_h: 834,
        image_alt: 'Grip Monkey Grip verde menta con correa blanca',
        caption: 'GRIPNEX™: agarre sin magnesio en cualquier barra.',
        reverse: false,
        color_scheme: 'scheme-2',
      },
      ...blocks('feature', [
        { label: 'GRIPNEX™', text: 'Adherencia sin magnesio en barras lisas, corrugadas, pintadas, lacadas, electrostáticas y oxidadas.' },
        { label: 'POLYGRIP™', text: 'Compuesto polimérico de base caucho: adherencia, flexibilidad, confort y durabilidad.' },
        { label: 'FORGEX™', text: 'Estructura de cinco capas internas con funciones diferenciadas.' },
        { label: 'MG-FUSION™', text: 'Proceso de fabricación propio, desarrollado desde cero por Monkey Grip.' },
      ]),
    },
    travel_bag: {
      type: 'mg-band',
      settings: {
        product: 'monkey-grip-travel-bag',
        kicker: 'Monkey Grip Travel Bag · Sistema MODEX™',
        title_line_1: 'Adapta. Organiza.',
        title_line_2: 'Expande.',
        text: 'Una maleta para entrenar, viajar y acompañar tu día, con tres módulos para tus esenciales, tu equipo y tu carga.',
        button_label: 'Ver Travel Bag',
        asset: 'mg-modex-1.jpg',
        asset_w: 1024,
        asset_h: 1024,
        image_alt: 'Composición publicitaria conceptual del sistema MODEX de la Monkey Grip Travel Bag',
        caption: 'Composición conceptual del sistema MODEX™.',
        reverse: true,
        color_scheme: 'scheme-1',
      },
      ...blocks('stat', [
        { value: '50 L', label: 'Capacidad base' },
        { value: '60 L', label: 'Expandida' },
        { value: '3 pods', label: 'Incluidos' },
        { value: '6 meses', label: 'Garantía' },
      ]),
    },
    mas: {
      type: 'mg-extras',
      settings: { title: 'Más equipamiento', text: 'Consulta precio y disponibilidad por WhatsApp.', products: ['rinonera-slim', 'ultrarope'], anchor: 'mas', color_scheme: 'scheme-2' },
    },
    nosotros: {
      type: 'mg-about',
      settings: {
        title_line_1: 'Hecho en Colombia.',
        title_line_2: 'Listo para el mundo.',
        text: '<p>Monkey Grip diseña y fabrica equipamiento para CrossFitters que exigen más de su equipo. Diseñado y elaborado por colombianos para atletas de todo el mundo.</p>',
        link_label: 'Síguenos en @monkeygripco',
        color_scheme: 'scheme-1',
      },
    },
  },
  order: ['hero', 'trust', 'productos', 'tecnologias', 'travel_bag', 'mas', 'nosotros'],
});

/* ---------- Fichas de producto ---------- */
const mainProduct = (list) => ({
  type: 'main-product',
  ...blocks('b', list),
  settings: {
    enable_sticky_info: true,
    color_scheme: 'scheme-1',
    media_position: 'left',
    gallery_layout: 'thumbnail_slider',
    media_size: 'medium',
    constrain_to_viewport: true,
    media_fit: 'contain',
    image_zoom: 'lightbox',
    mobile_thumbnails: 'show',
    hide_variants: true,
    enable_video_looping: false,
    padding_top: 28,
    padding_bottom: 28,
  },
});
const related = { type: 'related-products', settings: { heading: 'También te puede gustar', heading_size: 'h2', products_to_show: 4, columns_desktop: 4, color_scheme: 'scheme-1', image_ratio: 'square', image_shape: 'default', show_secondary_image: false, show_vendor: false, show_rating: false, columns_mobile: '2', padding_top: 36, padding_bottom: 28 } };
const contactBlock = (message) => ({ _type: 'contact', column: '2', title: '', big_title: false, message });

// Grips
write('templates/product.grips.json', {
  sections: {
    main: mainProduct([
      { _type: 'title' },
      { _type: 'text', text: 'Adherencia sin magnesio para tus entrenamientos en barra.', text_style: 'body' },
      { _type: 'price' },
      { _type: 'text', text: 'COP por par · Envío no incluido: se paga por separado.', text_style: 'subtitle' },
      { _type: 'variant_picker', picker_type: 'button', swatch_shape: 'circle' },
      {
        _type: 'mg_size_guide',
        link_label: 'Ver guía de tallas',
        title: 'Guía de tallas',
        intro: 'La talla se elige según el perímetro de la muñeca, medido en centímetros.',
        rows: 'S|12–16 cm\nM|16–21 cm\nL|más de 21 cm',
        steps: lines([
          'Rodea tu muñeca con una cinta métrica, lo más ajustada posible. Si no tienes una, utiliza un hilo, lana o una tira de papel y enróscala alrededor de la muñeca.',
          'Haz una marca que indique el perímetro de tu muñeca, ajustándola bien.',
          'Extiende el hilo, la lana o el papel sobre una regla y comprueba cuántos centímetros mide. Si usaste cinta métrica, lee la medida directamente.',
          'Consulta la tabla y selecciona la talla correspondiente.',
        ]),
        media_index: 0,
        asset: 'mg-ig-guia-muneca.jpg',
      },
      { _type: 'sku', text_style: 'body' },
      { _type: 'quantity_selector' },
      { _type: 'buy_buttons', show_dynamic_checkout: true, show_gift_card_recipient: false },
      { _type: 'mg_facts', items: 'Garantía comercial de 3 meses.\nCada compra corresponde a un par.\nEnvío cotizado y pagado aparte.' },
    ]),
    intro: {
      type: 'mg-product-intro',
      settings: {
        title_line_1: 'Adherencia extrema',
        title_line_2: 'sin magnesio.',
        tagline: 'Tu equipo. Tu rendimiento. Sin límites.',
        asset: 'mg-ig-grips-atleta.jpg',
        image_alt: 'Atleta con grips Monkey Grip en un gimnasio de CrossFit',
        image_w: 772,
        image_h: 724,
        benefits: '',
        attrs: lines([
          'Adherencia|Agarre en cualquier tipo de barra.',
          'Confort|Se adapta a tu mano para un entrenamiento más cómodo.',
          'Protección|Cuida tus manos en cada repetición.',
          'Durabilidad|Diseñados para un uso intensivo y de larga vida útil.',
          'Compatibilidad|Funciona en barras lisas, corrugadas, pintadas, lacadas, con pintura electrostática y oxidadas.',
        ]),
        color_scheme: 'scheme-1',
      },
    },
    tecnologias: {
      type: 'mg-detail',
      settings: { title: 'Nuestras', title_accent: 'tecnologías', anchor: 'tecnologias', layout: 'rows', color_scheme: 'scheme-2' },
      ...blocks('row', [
        {
          asset: 'mg-ig-gripnex.jpg', image_alt: 'Grip Monkey Grip verde menta con su superficie GRIPNEX', image_w: 532, image_h: 834,
          inset: 'mg-ig-gripnex-zoom.jpg', inset_alt: 'Detalle de la textura de la superficie GRIPNEX',
          title: 'GRIPNEX™', sub: 'La siguiente generación en adherencia',
          text: 'Tecnología de adherencia desarrollada para proporcionar un agarre sin necesidad de magnesio en diferentes tipos de barra.',
          bullets: lines(['Máxima fricción sin magnesio.', 'Agarre constante.', 'Mayor control en cada repetición.']),
          items_title: 'Adherencia real en cualquier barra', items_ratio: 'wide',
          items: lines([
            'mg-ig-barra-lisa.jpg|Lisa|',
            'mg-ig-barra-corrugada.jpg|Corrugada|',
            'mg-ig-barra-pintada.jpg|Pintada / lacada|',
            'mg-ig-barra-electrostatica.jpg|Pintura electrostática|',
            'mg-ig-barra-oxidada.jpg|Oxidada|',
          ]),
          attrs: '', note: '',
        },
        {
          asset: 'mg-ig-polygrip.jpg', image_alt: 'Materiales del compuesto POLYGRIP: caucho, sílice, goma miel y aceites', image_w: 628, image_h: 412,
          inset: '', inset_alt: '',
          title: 'POLYGRIP™', sub: 'Materiales que hacen la diferencia',
          text: 'Compuesto polimérico de base caucho desarrollado con una formulación propia para combinar adherencia, flexibilidad, confort y durabilidad.',
          bullets: '',
          items_title: 'Composición', items_ratio: 'square',
          items: lines([
            'mg-ig-caucho.jpg|Caucho natural|Base principal del compuesto.',
            'mg-ig-silice.jpg|Sílice|Mejora la adherencia y resistencia.',
            'mg-ig-goma-miel.jpg|Goma miel|Aumenta la elasticidad y durabilidad.',
            'mg-ig-aceites.jpg|Aceites extensores|Dan flexibilidad y confort.',
            'mg-ig-aditivos.jpg|Aditivos especiales|Mejoran el rendimiento y la estabilidad.',
          ]),
          attrs: lines(['Flexibilidad|Movimiento natural.', 'Resistencia|Uso intensivo.', 'Confort|Entrenamientos más largos.', 'Mayor vida útil|Materiales premium.']),
          note: '',
        },
        {
          asset: 'mg-ig-forgex.jpg', image_alt: 'Las cinco capas internas de la estructura FORGEX', image_w: 724, image_h: 412,
          inset: '', inset_alt: '',
          title: 'FORGEX™', sub: 'Estructura de cinco capas y resistencia en 3 ejes',
          text: 'Sistema de construcción de cinco capas internas con funciones diferenciadas, diseñado para responder a las exigencias mecánicas del grip en sus tres ejes: longitudinal, transversal y perpendicular.',
          bullets: '',
          items_title: 'Resistencia en 3 ejes', items_ratio: 'square',
          items: lines(['|Longitudinal|Mayor tracción.', '|Transversal|Mayor estabilidad.', '|Perpendicular|Mayor control.']),
          attrs: lines(['Estructura 5 capas|Funciones diferenciadas.', 'Alto rendimiento|En entrenamientos exigentes.', 'Resistencia total|Diseño pensado para durar.']),
          note: '',
        },
        {
          asset: 'mg-ig-grips-colores.jpg', image_alt: 'Los seis colores oficiales de los Grips Monkey Grip', image_w: 492, image_h: 114,
          inset: '', inset_alt: '',
          title: 'MG-FUSION™', sub: 'Proceso de fabricación propio',
          text: 'Proceso de fabricación desarrollado desde cero por Monkey Grip, mediante el cual integramos nuestros materiales y construimos el producto final.',
          bullets: '',
          items_title: 'Catálogo oficial de colores', items_ratio: 'square',
          items: lines([
            '|Negro + azul celeste|NeAzAz',
            '|Fucsia + negro|FuNeNe',
            '|Negro + blanco|NeBlBl',
            '|Verde menta + naranja neón|VmNaBl',
            '|Blanco + fucsia|BlFuFu',
            '|Morado + verde neón|MoVnVn',
          ]),
          attrs: '',
          note: 'Entrena. Progresa. Repite. Sin límites.',
        },
      ]),
    },
    ficha: {
      type: 'mg-columns',
      settings: { anchor: 'ficha', color_scheme: 'scheme-1' },
      ...blocks('c', [
        {
          _type: 'table', column: '1', title: 'Ficha técnica', big_title: true,
          rows: lines([
            'Producto|Grips de Monkey Grip',
            'Presentación|Par',
            'Compuesto|Compuesto polimérico de base caucho POLYGRIP™',
            'Estructura|Cinco capas internas con funciones diferenciadas FORGEX™',
            'Fabricación|Proceso propio MG-FUSION™ desarrollado desde cero',
            'Adherencia|GRIPNEX™ sin magnesio',
            'Compatibilidad|Barras lisas, corrugadas, pintadas, lacadas, con pintura electrostática y oxidadas',
            'Tallas|S 12–16 cm; M 16–21 cm; L más de 21 cm',
            'Colores|Seis combinaciones oficiales',
            'Precio y garantía|$160.000 COP por par; envío separado; garantía comercial de 3 meses',
          ]),
        },
        { _type: 'size_table', column: '2', title: 'Guía de tallas', big_title: false, intro: 'La talla se elige según el perímetro de la muñeca, medido en centímetros.', head_1: 'Talla', head_2: 'Perímetro de la muñeca', rows: 'S|12–16 cm\nM|16–21 cm\nL|más de 21 cm' },
        {
          _type: 'list', column: '2', title: 'Cómo medir la muñeca', big_title: false, numbered: true,
          items: lines([
            'Rodea tu muñeca con una cinta métrica, lo más ajustada posible. Si no tienes una, utiliza un hilo, lana o una tira de papel y enróscala alrededor de la muñeca.',
            'Haz una marca que indique el perímetro de tu muñeca, ajustándola bien.',
            'Extiende el hilo, la lana o el papel sobre una regla y comprueba cuántos centímetros mide. Si usaste cinta métrica, lee la medida directamente.',
            'Consulta la tabla y selecciona la talla correspondiente.',
          ]),
        },
        { _type: 'image', column: '2', title: '', big_title: false, asset: 'mg-ig-guia-muneca.jpg', image_alt: 'Cinta métrica alrededor de la muñeca para medir su perímetro', image_w: 488, image_h: 838 },
      ]),
    },
    cuidados: {
      type: 'mg-columns',
      settings: { anchor: 'cuidados', color_scheme: 'scheme-2' },
      ...blocks('c', [
        {
          _type: 'list', column: '1', title: 'Uso y cuidados', big_title: false, numbered: false,
          items: lines([
            'Antes de cada uso, limpia la superficie de tus Grips con agua o, preferiblemente, alcohol.',
            'Después de usarlos, déjalos en un lugar ventilado y libre de luz directa del sol.',
            'Para lavar el neopreno, utiliza únicamente jabón neutro. Nunca uses jabones con glicerina.',
            'Lava a mano. Nunca laves los Grips en lavadora.',
            'Si vas a guardarlos por un tiempo prolongado, limpia los Grips con alcohol y déjalos secos en un lugar seco.',
            'Evita el contacto de los Grips con magnesio. Si la barra tiene magnesio, límpiala antes de usarla.',
            'Ten precaución al soltarte de la barra, debido a su alta adherencia.',
            'No es un juguete. Mantener fuera del alcance de los niños.',
          ]),
        },
        {
          _type: 'text', column: '2', title: 'Garantía comercial de 3 meses', big_title: false,
          text: '<p>Tus Grips cuentan con una garantía comercial de 3 meses. Si el producto presenta una falla cubierta por esta garantía, recibirás la reposición por un producto totalmente nuevo. Sigue las instrucciones de uso, cuidado y conservación para mantener el producto en buenas condiciones. Si necesitas hacer efectiva la garantía, comunícate con Monkey Grip para recibir atención de postventa y la evaluación de tu caso.</p><p>Esta garantía comercial es adicional y no limita, sustituye ni restringe los derechos legales del consumidor ni la garantía legal aplicable. La atención de una reclamación respetará esos derechos; las recomendaciones de cuidado no implican su pérdida automática.</p>',
        },
        contactBlock('Hola Monkey Grip, necesito ayuda con la garantía de mis Grips.'),
      ]),
    },
    'related-products': related,
  },
  order: ['main', 'intro', 'tecnologias', 'ficha', 'cuidados', 'related-products'],
});

// Monkey Wristbands
write('templates/product.wristbands.json', {
  sections: {
    main: mainProduct([
      { _type: 'title' },
      { _type: 'text', text: 'Muñequeras deportivas · Control de sudor · Ajuste adaptable · Confort', text_style: 'body' },
      { _type: 'price' },
      { _type: 'text', text: 'COP por par (2 unidades) · Talla única, elástica · Envío no incluido: se paga por separado.', text_style: 'subtitle' },
      { _type: 'variant_picker', picker_type: 'button', swatch_shape: 'circle' },
      { _type: 'sku', text_style: 'body' },
      { _type: 'quantity_selector' },
      { _type: 'buy_buttons', show_dynamic_checkout: true, show_gift_card_recipient: false },
      { _type: 'mg_facts', items: 'Par (2 unidades) de algodón, elastómero y nylon.\nEnvío cotizado y pagado aparte.' },
    ]),
    intro: {
      type: 'mg-product-intro',
      settings: {
        title_line_1: 'Soporte. Confort.',
        title_line_2: 'Estilo. Siempre contigo.',
        tagline: 'Diseñadas para acompañar cada entrenamiento.',
        asset: 'mg-ig-wb-manos.jpg',
        image_alt: 'Manos en la barra con Monkey Wristbands blanco y fucsia',
        image_w: 434,
        image_h: 432,
        benefits: '',
        attrs: lines([
          'Alta absorción|Mantiene tus manos secas por más tiempo.',
          'Confort|Suave al contacto con la piel.',
          'Durabilidad|Resiste entrenamientos intensos y lavados frecuentes.',
          'Versatilidad|Ideal para CrossFit, gimnasio y deportes en general.',
        ]),
        color_scheme: 'scheme-1',
      },
    },
    tecnologias: {
      type: 'mg-info-cards',
      settings: { title: 'Tecnologías', anchor: 'tecnologias', color_scheme: 'scheme-2' },
      ...blocks('card', [
        { title: 'SWEATLOCK™', sub: 'Mantiene tus manos secas', text: 'Tejido de alta absorción que controla el sudor y te mantiene cómodo en todo momento. Ayuda a absorber y retener el sudor, reduciendo la humedad que se desplaza desde los brazos hacia las manos.' },
        { title: 'FLEXFIT™', sub: 'Ajuste perfecto', text: 'Fibras elásticas que se adaptan a tu muñeca sin perder su forma, brindando soporte constante durante el entrenamiento.' },
        { title: 'SOFTGUARD™', sub: 'Confort duradero', text: 'Material suave que protege tu piel, evitando irritaciones en entrenamientos intensos.' },
      ]),
    },
    detalle: {
      type: 'mg-detail',
      settings: { title: '', title_accent: '', anchor: 'detalles', layout: 'rows', color_scheme: 'scheme-1' },
      ...blocks('d', [
        {
          _type: 'row',
          asset: 'mg-ig-wb-vista.jpg', image_alt: 'Monkey Wristbands blanco y fucsia, vista frontal y posterior', image_w: 430, image_h: 288,
          inset: 'mg-ig-wb-tejido.jpg', inset_alt: 'Detalle del tejido de punto',
          title: 'Tejido premium', sub: 'Vista frontal y posterior',
          text: 'Alta absorción de sudor, suave al contacto con la piel y de secado rápido.',
          bullets: '',
          items_title: 'Composición', items_ratio: 'square',
          items: lines([
            'mg-ig-wb-algodon.jpg|Algodón|Suavidad y absorción.',
            'mg-ig-wb-elastomero.jpg|Elastómero|Elasticidad y ajuste.',
            'mg-ig-wb-nylon.jpg|Nylon|Resistencia y durabilidad.',
          ]),
          attrs: '', note: '',
        },
        {
          _type: 'gallery', title: 'Detalles', text: '', ratio: '4 / 3', columns_mobile: 1,
          items: lines([
            'mg-ig-wb-detalle-logo.jpg|Tejido de alta calidad|Logo Monkey Grip tejido.',
            'mg-ig-wb-detalle-acabados.jpg|Acabados reforzados|Mayor resistencia y durabilidad.',
            'mg-ig-wb-detalle-textura.jpg|Textura real|Colores sólidos y gran definición.',
          ]),
        },
        {
          _type: 'gallery', title: 'Usos', text: '', ratio: '3 / 4', columns_mobile: 3,
          items: lines([
            'mg-ig-wb-uso-pesas.jpg|Levantamiento de pesas',
            'mg-ig-wb-uso-gimnasia.jpg|Gimnasia',
            'mg-ig-wb-uso-general.jpg|Entrenamiento general',
          ]),
        },
      ]),
    },
    ficha: {
      type: 'mg-columns',
      settings: { anchor: 'ficha', color_scheme: 'scheme-1' },
      ...blocks('c', [
        {
          _type: 'table', column: '1', title: 'Ficha técnica', big_title: true,
          rows: lines([
            'Nombre oficial|Monkey Wristbands',
            'Categoría|Muñequeras deportivas',
            'Composición|Algodón, elastómero y nylon',
            'Dimensiones aproximadas|10 × 5 cm',
            'Talla|Única, elástica',
            'Presentación|Par (2 unidades)',
            'Precio público|$40.000 COP',
            'Envío|No incluido',
          ]),
        },
        {
          _type: 'table', column: '2', title: 'Colores', big_title: true,
          rows: lines([
            'Blanco + fucsia|WB-BlFu-001',
            'Blanco + negro|WB-BlNe-001',
            'Morado + verde neón|WB-MoVn-001',
            'Negro + fucsia|WB-NeFu-001',
            'Negro + naranja|WB-NeNa-001',
            'Negro + azul celeste|WB-NeAz-001',
          ]),
        },
      ]),
    },
    cuidados: {
      type: 'mg-columns',
      settings: { anchor: 'cuidados', color_scheme: 'scheme-2' },
      ...blocks('c', [
        {
          _type: 'list', column: '1', title: 'Cuidados y mantenimiento', big_title: false, numbered: false,
          items: lines([
            'Lavar con agua fría y detergente suave, a mano o en lavadora, a una temperatura máxima de 30 °C.',
            'Lavar con colores similares.',
            'No utilizar cloro ni blanqueadores.',
            'Secar al aire y a la sombra.',
            'Evitar secadora, plancha y altas temperaturas para conservar la elasticidad y los colores.',
          ]),
        },
        {
          _type: 'text', column: '2', title: 'Garantía', big_title: false,
          text: '<p>Las Monkey Wristbands no cuentan con garantía comercial adicional por desgaste derivado del uso. Los defectos de fabricación y las reclamaciones cubiertas por la garantía legal se atenderán conforme a la normativa vigente en Colombia.</p>',
        },
        contactBlock('Hola Monkey Grip, tengo una consulta sobre mis Monkey Wristbands.'),
      ]),
    },
    'related-products': related,
  },
  order: ['main', 'intro', 'tecnologias', 'detalle', 'ficha', 'cuidados', 'related-products'],
});

// Monkey Grip Travel Bag
write('templates/product.travel-bag.json', {
  sections: {
    main: mainProduct([
      { _type: 'title' },
      { _type: 'text', text: 'Adapta. Organiza. Expande.', text_style: 'body' },
      { _type: 'price' },
      { _type: 'text', text: 'COP + envío. Incluye la maleta y los tres módulos: QUICK POD, GEAR POD y CARGO POD.', text_style: 'subtitle' },
      { _type: 'variant_picker', picker_type: 'button', swatch_shape: 'circle' },
      { _type: 'quantity_selector' },
      { _type: 'buy_buttons', show_dynamic_checkout: true, show_gift_card_recipient: false },
      { _type: 'mg_facts', items: 'Incluye 3 pods.\nGarantía de 6 meses.\nEnvío adicional: se informa antes de finalizar la compra.' },
    ]),
    intro: {
      type: 'mg-product-intro',
      settings: {
        title_line_1: 'Un solo equipo.',
        title_line_2: 'Todas tus actividades.',
        benefits: lines([
          'Organiza por actividad: distribuye esenciales, implementos y carga en tres módulos.',
          'Adapta tu capacidad: 50 L base y hasta 60 L expandida, según las capacidades declaradas.',
          'Mantén tus esenciales a mano con QUICK POD.',
          'Separa calzado, ropa u otros objetos con CARGO POD.',
          'Acompaña entrenamiento, viajes, trabajo y actividades del día a día.',
        ]),
        attrs_title: 'Para todas tus actividades',
        attrs: lines(['Gym / CrossFit|', 'Fotografía|', 'Trekking|', 'Fisioterapia|', 'Uso diario|']),
        color_scheme: 'scheme-1',
      },
    },
    vistas: {
      type: 'mg-detail',
      settings: { title: '', title_accent: '', anchor: 'vistas', layout: 'rows', color_scheme: 'scheme-1' },
      ...blocks('v', [
        {
          _type: 'gallery', title: 'Vistas', text: 'Monkey Grip Travel Bag en color verde.', ratio: '9 / 16', columns_mobile: 2,
          items: lines([
            'mg-ig-tb-frontal.jpg|Vista frontal',
            'mg-ig-tb-lateral.jpg|Vista lateral',
            'mg-ig-tb-posterior.jpg|Vista posterior',
            'mg-ig-tb-superior.jpg|Vista superior',
            'mg-ig-tb-sin-accesorios.jpg|Sin accesorios|50 L',
          ]),
        },
      ]),
    },
    modex: {
      type: 'mg-modex',
      settings: {
        title_line_1: 'Sistema',
        title_line_2: 'MODEX™',
        text: 'Modular Expansion System: sistema modular desarrollado por Monkey Grip que te permite adaptar la configuración de tu Travel Bag según la actividad y expandir su capacidad de 50 L hasta 60 L mediante tres módulos removibles. Los tres pods están incluidos en el precio.',
        intro_asset: 'mg-modex-1.jpg',
        intro_alt: 'Composición publicitaria conceptual: presentación del sistema MODEX',
        full_asset: 'mg-modex-5.jpg',
        full_alt: 'Composición publicitaria conceptual del sistema completo: maleta con QUICK POD, GEAR POD y CARGO POD',
        full_caption: 'El sistema completo. Composición publicitaria conceptual.',
        note: 'Las imágenes del sistema MODEX™ son composiciones publicitarias conceptuales: sus detalles ilustrados no muestran la construcción real. Los objetos de ambientación (calzado, celular, audífonos, grips, sogas, recipientes y otros accesorios) no se incluyen en la compra.',
        color_scheme: 'scheme-2',
      },
      ...blocks('m', [
        { _type: 'stat', value: '50 L', label: 'Capacidad base' },
        { _type: 'stat', value: '60 L', label: 'Expandida' },
        { _type: 'stat', value: '3 pods', label: 'Incluidos' },
        { _type: 'stat', value: '6 meses', label: 'Garantía' },
        {
          _type: 'pod', asset: 'mg-modex-2.jpg', title: 'QUICK POD™', sub: 'Módulo de acceso rápido',
          text: 'Módulo para organizar los esenciales que necesitas tener al alcance: celular, llaves, documentos, audífonos y snacks.',
          bullets: lines(['Acceso inmediato.', 'Ideal para documentos, accesorios y objetos pequeños.', 'Organización interna.', 'Removible y versátil.']),
        },
        {
          _type: 'pod', asset: 'mg-modex-3.jpg', title: 'GEAR POD™', sub: 'Módulo de organización',
          text: 'Módulo para reunir implementos y accesorios de entrenamiento, como grips, muñequeras y sogas.',
          bullets: lines(['Mayor capacidad de organización.', 'Perfecto para implementos, accesorios y utensilios.', 'Sistema modular.', 'Removible y versátil.']),
        },
        {
          _type: 'pod', asset: 'mg-modex-4.jpg', title: 'CARGO POD™', sub: 'Módulo de carga expandible',
          text: 'Módulo de carga para separar calzado, ropa u otros accesorios.',
          bullets: lines(['Capacidad adicional sin usar el compartimento principal.', 'Ideal para zapatos, ropa húmeda, comida, suplementación, etc.', 'Mantiene el contenido aislado.', 'Colapsable y removible.']),
        },
      ]),
    },
    construccion: {
      type: 'mg-detail',
      settings: { title: '', title_accent: '', anchor: 'construccion', layout: 'cards', color_scheme: 'scheme-1' },
      ...blocks('k', [
        {
          _type: 'row', asset: 'mg-ig-tb-materiales.jpg', image_alt: 'Gotas de agua sobre la lona de la Travel Bag', image_w: 272, image_h: 432,
          title: 'Materiales premium', sub: '', text: '',
          bullets: lines(['Tela de alta resistencia.', 'Repelente al agua.', 'Cierres reforzados.', 'Costuras de alto rendimiento.', 'Diseñada para uso intensivo.']),
          items: '', attrs: '', note: '',
        },
        {
          _type: 'row', asset: 'mg-ig-tb-ergonomia.jpg', image_alt: 'Espaldar acolchado y correas de la Travel Bag', image_w: 294, image_h: 432,
          title: 'Diseño ergonómico', sub: '', text: '',
          bullets: lines(['Espaldar acolchado.', 'Correas ajustables.', 'Distribución de peso eficiente.', 'Comodidad en movimientos y desplazamientos largos.']),
          items: '', attrs: '', note: '',
        },
        {
          _type: 'row', asset: 'mg-ig-tb-detalles.jpg', image_alt: 'Hebilla y reatas de compresión de la Travel Bag', image_w: 264, image_h: 432,
          title: 'Detalles que hacen la diferencia', sub: '', text: '',
          bullets: lines(['Sistema modular.', 'Reatas de compresión.', 'Paneles de velcro.', 'Múltiples puntos de sujeción.', 'Diseño funcional y robusto.']),
          items: '', attrs: '', note: '',
        },
      ]),
    },
    ficha: {
      type: 'mg-columns',
      settings: { anchor: 'ficha', color_scheme: 'scheme-1' },
      ...blocks('c', [
        {
          _type: 'table', column: '1', title: 'Ficha técnica', big_title: true,
          rows: lines([
            'Marca y modelo|Monkey Grip Travel Bag',
            'Sistema modular|MODEX™ Modular Expansion System',
            'Módulos incluidos|QUICK POD, GEAR POD y CARGO POD',
            'Capacidad base declarada|50 L',
            'Capacidad expandida declarada|Hasta 60 L',
            'Dimensiones declaradas|50 × 30 × 26 cm (alto × ancho × profundidad)',
            'Peso declarado|1.8 lb, sin accesorios',
            'Material exterior|Lona tipo huracán repelente al agua',
            'Malla|Tipo cáñamo con apresto',
            'Forro|Lona tipo seda',
            'Cremalleras|Militares',
            'Hebillas|Policarbonato inyectado',
            'Reatas|Multifilamento',
            'Colores|Verde, gris, negro y morado',
            'Precio|$460.000 COP + envío, incluidos los tres pods',
            'Garantía|6 meses',
          ]),
        },
        {
          _type: 'list', column: '2', title: 'Usos', big_title: false, numbered: false,
          items: lines([
            'Entrenamiento: organiza tus implementos y prendas.',
            'Viajes: distribuye tus pertenencias por función.',
            'Trabajo y vida diaria: reúne lo que necesitas durante la jornada.',
            'Exploración: organiza equipo personal según tu actividad.',
          ]),
        },
        {
          _type: 'text', column: '2', title: 'Cuidados recomendados', big_title: false,
          text: '<p>Retira el contenido antes de limpiar. Usa un paño suave húmedo y jabón neutro; elimina residuos y deja secar a la sombra en un lugar ventilado antes de guardar. Evita cloro, solventes, abrasivos, calor directo y guardar la maleta húmeda. No fuerces cremalleras ni hebillas.</p><p>Estas son recomendaciones de conservación, no condiciones adicionales de garantía.</p>',
        },
        { _type: 'text', column: '2', title: 'Garantía de 6 meses', big_title: false, text: '<p>La atención se realiza a través del canal oficial de Monkey Grip.</p>' },
        contactBlock('Hola Monkey Grip, tengo una consulta sobre la garantía de mi Travel Bag.'),
      ]),
    },
    'related-products': related,
  },
  order: ['main', 'intro', 'vistas', 'modex', 'construccion', 'ficha', 'related-products'],
});

// Ficha por defecto (Riñonera Slim, UltraRope): compacta, con descripción en la columna de compra
write('templates/product.json', {
  sections: {
    main: mainProduct([
      { _type: 'title' },
      { _type: 'price' },
      { _type: 'variant_picker', picker_type: 'button', swatch_shape: 'circle' },
      { _type: 'quantity_selector' },
      { _type: 'buy_buttons', show_dynamic_checkout: true, show_gift_card_recipient: false },
      { _type: 'description' },
    ]),
    'related-products': related,
  },
  order: ['main', 'related-products'],
});

console.log('Plantillas: index, product, product.grips, product.wristbands, product.travel-bag');
