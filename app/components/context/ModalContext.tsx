// context/ModalContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type ModalContextType = {
  showLoginModal: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <ModalContext.Provider value={{ showLoginModal, setShowLoginModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
