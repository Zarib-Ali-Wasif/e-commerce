const calculateCartSummary = (cart, productsList) => {
  const subtotal = calculateSubtotal(cart, productsList);
  const discount = calculateTotalDiscount(cart, productsList);
  const gst = 16; // Static GST percentage
  const total = calculateTotal(subtotal, discount, gst);

  return {
    subtotal: subtotal.toFixed(2),
    discount: discount.toFixed(2),
    gst,
    total: total,
    totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
  };
};

const calculateSubtotal = (cart, productsList) => {
  return cart.reduce((total, item) => {
    const cartProduct = getProductDetails(item.cartItemId, productsList);
    return total + (cartProduct.price || 0) * item.quantity;
  }, 0);
};

const calculateTotalDiscount = (cart, productsList) => {
  return cart.reduce((totalDiscount, item) => {
    const cartProduct = getProductDetails(item.cartItemId, productsList);
    const discountPercent = cartProduct.discount.discountPercent || 0;
    const itemPrice = (cartProduct.price || 0) * item.quantity;
    const itemDiscount = (itemPrice * discountPercent) / 100;
    return totalDiscount + itemDiscount;
  }, 0);
};

const calculateTotal = (subtotal, discountAmount, gst) => {
  const gstAmount = (subtotal * gst) / 100;
  return (subtotal - discountAmount + gstAmount).toFixed(2);
};

const getProductDetails = (productId, productsList) => {
  if (!productId || !Array.isArray(productsList)) {
    return {}; // Return an empty object if input is invalid
  }
  return productsList.find((product) => product._id === productId) || {};
};

export { calculateCartSummary, getProductDetails };
