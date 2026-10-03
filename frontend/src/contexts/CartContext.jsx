import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('olympiadhub_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === item.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: (next[existingIdx].quantity || 1) + (item.quantity || 1)
        };
        return next;
      }
      return [
        ...prev,
        {
          id: item.id || `item_${Date.now()}`,
          name: item.name || item.title || 'Olympiad Learning Package',
          price: Number(item.price) || 999,
          originalPrice: Number(item.originalPrice) || Number(item.price ? item.price * 1.3 : 1499),
          category: item.category || 'Online Classes',
          grade: item.grade || 'All Classes',
          subject: item.subject || 'Olympiad',
          thumbnailText: item.thumbnailText || 'COURSE',
          quantity: item.quantity || 1
        }
      ];
    });

    setLastAddedItem(item);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Add Multiple Items at Once
  const addMultipleToCart = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    setCartItems((prev) => {
      let next = [...prev];
      items.forEach((item) => {
        const existingIdx = next.findIndex((i) => i.id === item.id);
        if (existingIdx > -1) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: (next[existingIdx].quantity || 1) + (item.quantity || 1)
          };
        } else {
          next.push({
            id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: item.name || item.title || 'Olympiad Learning Package',
            price: Number(item.price) || 999,
            originalPrice: Number(item.originalPrice) || Number(item.price ? item.price * 1.3 : 1499),
            category: item.category || 'Study Package',
            grade: item.grade || 'All Classes',
            subject: item.subject || 'Olympiad',
            thumbnailText: item.thumbnailText || 'PACKAGE',
            quantity: item.quantity || 1
          });
        }
      });
      return next;
    });

    setLastAddedItem(items[items.length - 1]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Remove Item from Cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Update Item Quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  // Clear Entire Cart
  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Computations
  const totalItems = cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const subtotal = cartItems.reduce(
    (acc, curr) => acc + (Number(curr.price) || 0) * (curr.quantity || 1),
    0
  );
  const totalOriginal = cartItems.reduce(
    (acc, curr) =>
      acc + (Number(curr.originalPrice) || Number(curr.price) || 0) * (curr.quantity || 1),
    0
  );
  const totalSavings = Math.max(0, totalOriginal - subtotal);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addMultipleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        subtotal,
        totalOriginal,
        totalSavings,
        showToast,
        lastAddedItem,
        setShowToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
