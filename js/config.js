/**
 * CONFIGURACIÓN CENTRAL — MONKEY GRIP
 * Cambia estos valores para actualizar todo el sitio desde un solo lugar.
 */
window.MONKEY_CONFIG = {
  brand: {
    name: 'Monkey Grip',
    tagline: 'Agarra más. Rinde más.',
    instagram: '@monkeygripco',
    instagramUrl: 'https://instagram.com/monkeygripco',
  },
  contact: {
    // Número temporal — reemplázalo por el número real de Monkey Grip cuando esté disponible.
    whatsappNumber: '573001234567',
    whatsappDefaultMessage: 'Hola Monkey Grip, quiero más información sobre sus productos.',
    address: 'Calle 18A Sur #29C-55, Bogotá, Colombia',
    city: 'Bogotá, Colombia',
  },
};

window.buildWhatsAppLink = function (message) {
  const cfg = window.MONKEY_CONFIG.contact;
  const text = encodeURIComponent(message || cfg.whatsappDefaultMessage);
  return `https://wa.me/${cfg.whatsappNumber}?text=${text}`;
};
