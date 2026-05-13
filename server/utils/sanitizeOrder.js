/**
 * Strip payment / admin-only fields from order documents before sending to customers.
 */
function sanitizeOrderForCustomer(order) {
  if (!order) return null;
  const o = typeof order.toObject === 'function' ? order.toObject({ virtuals: false }) : { ...order };

  delete o.razorpaySignature;
  delete o.paymentLogs;
  delete o.adminNotes;
  delete o.isSeenByAdmin;
  delete o.seenByAdminAt;
  delete o.__v;
  delete o._id;

  return o;
}

function sanitizeOrdersForCustomer(orders) {
  if (!Array.isArray(orders)) return [];
  return orders.map(sanitizeOrderForCustomer);
}

module.exports = { sanitizeOrderForCustomer, sanitizeOrdersForCustomer };
