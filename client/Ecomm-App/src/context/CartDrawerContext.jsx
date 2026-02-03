import { createContext, useContext, useMemo, useState } from "react";

const CartDrawerContext = createContext(null);

export const CartDrawerProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((v) => !v);

  const value = useMemo(
    () => ({ isCartOpen, openCart, closeCart, toggleCart }),
    [isCartOpen]
  );

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
    </CartDrawerContext.Provider>
  );
};

export const useCartDrawer = () => useContext(CartDrawerContext);
