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

export function generateWhatsAppMessage(items, whatsappNumber) {
  const itemLines = items
    .map(item => `• ${item.name} (${item.unit}) x ${item.quantity} @ ₹${item.price} = ₹${item.price * item.quantity}`)
    .join('\n');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `🌿 *Annakshetram Order Request*\n_Satvikam Jeevanam, Shuddham Bhojanam_\n\n${itemLines}\n\n*Total: ₹${total}*\n\nPlease confirm my order and share payment details. 🙏`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
