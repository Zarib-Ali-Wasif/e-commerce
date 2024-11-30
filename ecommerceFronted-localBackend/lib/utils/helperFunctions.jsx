// Helper Functions
const calculateCartSummary = (cart, productsList) => {
  const subtotal = calculateSubtotal(cart, productsList);
  const total = calculateTotal(subtotal);

  return {
    subtotal,
    discount: 0, // You can update this with dynamic discount logic
    gst: 16, // Static GST for now, you can change it dynamically
    total,
    totalItems: state.cart.reduce((sum, item) => sum + item.quantity, 0),
  };
};

const calculateSubtotal = (cart, productsList) => {
  return cart.reduce((total, item) => {
    const cartProduct = getProductDetails(item.cartItemId, productsList);
    return total + (cartProduct.price || 0) * item.quantity;
  }, 0);
};

const calculateTotal = (subtotal) => {
  const discount = 0; // Dynamic discount can be applied here
  const gst = 16; // Example GST percentage
  const discountAmount = (subtotal * discount) / 100;
  const gstAmount = (subtotal * gst) / 100;
  return (subtotal - discountAmount + gstAmount).toFixed(2);
};

const getProductDetails = (productId, productsList) =>
  productsList.find((product) => product._id === productId) || {};

export { calculateCartSummary, getProductDetails };
