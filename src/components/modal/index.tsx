"use client";

import React, { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import ReactModal from "react-modal";

interface ModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

const customStyles = {
  overlay: {
    background: 'rgba(0,0,0,0.7)',
    zIndex: 100,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    width: '100%',
    borderRadius: '1rem',
    minWidth: '300px',
    maxWidth: '50%',
    minHeight: '20vh',
    maxHeight: '90vh',
    overflow: 'auto',
  },
};

const Modal = ({ modalIsOpen, setModalIsOpen, children }: ModalProps) => {
  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalIsOpen]);

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
