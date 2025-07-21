"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { StockSymbol, stocks } from "../../../../lib/constants";

interface StockContextType {
  stock: StockSymbol;
  setStock: (stock: StockSymbol) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
  const [stock, setStock] = useState<StockSymbol>(stocks[0]);

  const value = {
    stock,
    setStock,
  };

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
}

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
};
