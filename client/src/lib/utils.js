import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
}

export function generateWhatsAppMessage(items, whatsappNumber, address = null) {
  const itemLines = items
    .map(item => `• ${item.name} (${item.unit}) x ${item.quantity} @ ₹${item.price} = ₹${item.price * item.quantity}`)
    .join('\n');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let addressBlock = '';
  if (address && address.line1) {
    addressBlock = `\n\n📦 *Delivery Address*\n${address.fullName}\n📞 ${address.phone}\n${address.line1}${address.line2 ? ', ' + address.line2 : ''}\n${address.city}, ${address.state} - ${address.pincode}`;
  }

  const message = `🌿 *Annakshetram Order Request*\n_Satvikam Jeevanam, Shuddham Bhojanam_\n\n${itemLines}\n\n*Total: ₹${total}*${addressBlock}\n\nPlease confirm my order and share payment details. 🙏`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
