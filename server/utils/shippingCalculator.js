/**
 * Calculate shipping charges based on state and order value
 * @param {String} state - Customer's state
 * @param {Number} orderTotal - Order subtotal
 * @param {Object} shippingConfig - Shipping configuration from settings
 * @returns {Object} { charge, isLocal, appliedSlab }
 */
const calculateShippingCharge = (state, orderTotal, shippingConfig) => {
  if (!shippingConfig) {
    // Default fallback if no config
    return {
      charge: orderTotal >= 500 ? 0 : 50,
      isLocal: false,
      appliedSlab: null,
    };
  }

  const { localState, localCharges, otherStatesCharges } = shippingConfig;
  
  // Normalize state names for comparison (case-insensitive, trim spaces)
  const normalizedCustomerState = state?.trim().toLowerCase();
  const normalizedLocalState = localState?.trim().toLowerCase();
  
  // Check if customer is in local state
  const isLocal = normalizedCustomerState === normalizedLocalState;
  
  // Select appropriate charge slabs
  const chargeSlabs = isLocal ? localCharges : otherStatesCharges;
  
  // Find applicable slab based on order total
  let applicableSlab = null;
  for (const slab of chargeSlabs) {
    if (orderTotal >= slab.minOrder && orderTotal < slab.maxOrder) {
      applicableSlab = slab;
      break;
    }
  }
  
  // If no slab found, use the last slab (highest range)
  if (!applicableSlab && chargeSlabs.length > 0) {
    applicableSlab = chargeSlabs[chargeSlabs.length - 1];
  }
  
  return {
    charge: applicableSlab?.charge || 0,
    isLocal,
    appliedSlab: applicableSlab ? {
      minOrder: applicableSlab.minOrder,
      maxOrder: applicableSlab.maxOrder,
      charge: applicableSlab.charge,
    } : null,
  };
};

/**
 * Get next free shipping threshold
 * @param {String} state - Customer's state
 * @param {Number} orderTotal - Order subtotal
 * @param {Object} shippingConfig - Shipping configuration from settings
 * @returns {Number|null} Amount needed to reach free shipping, or null if already free
 */
const getNextFreeShippingThreshold = (state, orderTotal, shippingConfig) => {
  if (!shippingConfig) return null;
  
  const { localState, localCharges, otherStatesCharges } = shippingConfig;
  const normalizedCustomerState = state?.trim().toLowerCase();
  const normalizedLocalState = localState?.trim().toLowerCase();
  const isLocal = normalizedCustomerState === normalizedLocalState;
  
  const chargeSlabs = isLocal ? localCharges : otherStatesCharges;
  
  // Find the first slab with 0 charge that's above current order total
  for (const slab of chargeSlabs) {
    if (slab.charge === 0 && orderTotal < slab.minOrder) {
      return slab.minOrder - orderTotal;
    }
  }
  
  return null;
};

module.exports = {
  calculateShippingCharge,
  getNextFreeShippingThreshold,
};
