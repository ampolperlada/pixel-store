'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type ModalContextType = {
  showLoginModal: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  showSignupModal: boolean;
  setShowSignupModal: Dispatch<SetStateAction<boolean>>;
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeAllModals: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openLoginModal = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const openSignupModal = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  return (
    <ModalContext.Provider value={{
      showLoginModal,
      setShowLoginModal,
      showSignupModal,
      setShowSignupModal,
      openLoginModal,
      openSignupModal,
      closeAllModals
    }}>
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