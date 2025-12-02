"use client";

import React, { createContext, useContext, useState } from 'react';

interface WhatsAppContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <WhatsAppContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsApp deve ser usado dentro de um WhatsAppProvider');
  }
  return context;
}