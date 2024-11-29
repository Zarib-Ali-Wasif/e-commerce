import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [productsList, setProductsList] = useState(() => {
    const savedProducts = localStorage.getItem("productsList");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [cartSummary, setCartSummary] = useState(() => {
    const savedSummary = localStorage.getItem("cartSummary");
    return savedSummary ? JSON.parse(savedSummary) : {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    saveCartSummary(); // Save cart summary whenever cart is updated
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("productsList", JSON.stringify(productsList));
  }, [productsList]);

  useEffect(() => {
    localStorage.setItem("cartSummary", JSON.stringify(cartSummary));
  }, [cartSummary]);

  useEffect(() => {
    if (
      localStorage.getItem("isAuthenticated") !== "true" ||
      !localStorage.getItem("isAuthenticated")
    ) {
      localStorage.setItem("isAuthenticated", false);
    }
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.cartItemId === product._id
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.cartItemId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { cartItemId: product._id, quantity: 1 }];
    });
  };

  // Update quantity in the cart
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () =>
    cart.reduce((total, item) => {
      const cartProduct = getCartProductDetails(item.cartItemId);
      return total + (cartProduct.price || 0) * item.quantity;
    }, 0);

  const calculateTotal = (subtotal) => {
    const discount = 0; // You can update this with a dynamic discount
    const gst = 16; // Example GST percentage
    const discountAmount = (subtotal * discount) / 100;
    const gstAmount = (subtotal * gst) / 100;
    return (subtotal - discountAmount + gstAmount).toFixed(2);
  };

  const saveCartSummary = () => {
    const subtotal = calculateSubtotal();
    const total = calculateTotal(subtotal);

    const summary = {
      subtotal,
      discount: 0,
      gst: 16,
      total,
      totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    };

    setCartSummary(summary);
  };

  const getCartProductDetails = (cartProductId) =>
    productsList.find((product) => product._id === cartProductId) || {};

  return (
    <CartContext.Provider
      value={{
        cart,
        cartSummary,
        productsList,
        setProductsList,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
