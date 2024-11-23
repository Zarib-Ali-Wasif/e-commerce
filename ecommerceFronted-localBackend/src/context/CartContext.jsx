import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
    async function fetchUserDetails() {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlciIsImVtYWlsIjoidXNlckBlbWFpbC5jb20iLCJzdWIiOiI2NzNiMTQ5Mzc1Mzg0YWFlY2JlZjBhNjEiLCJyb2xlcyI6InVzZXIiLCJpYXQiOjE3MzIzODQyNjcsImV4cCI6MTczMjk4OTA2N30.mbOaGzRZa5yuVtd_o5KxVdMEsDMzd5oFlmYsiIlgHb0";

      try {
        const response = await axios.get(`http://localhost:3000/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        });
        const user = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        return response.data;
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    }

    fetchUserDetails();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: product.id, quantity: 1 }];
    });
  };

  // Update quantity in the cart
  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () =>
    cart.reduce((total, item) => {
      const product = getProductDetails(item.id);
      return total + (product.price || 0) * item.quantity;
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

  const getProductDetails = (productId) =>
    productsList.find((product) => product.id === productId) || {};

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
