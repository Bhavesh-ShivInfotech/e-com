import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";

const CommonModal = ({
  isOpen,
  toggle,
  title,
  children,
  footerButtons,
  size,
  centered = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={centered}
      size={size}
      contentClassName="border-0"
    >
      <ModalHeader className="bg-light p-3 border-0" toggle={toggle}>
        <h5 className="modal-title m-0">{title}</h5>
      </ModalHeader>
      <ModalBody className="p-3">{children}</ModalBody>
      <ModalFooter className="border-0 p-3">
        <div className="hstack gap-2 justify-content-end">{footerButtons}</div>
      </ModalFooter>
    </Modal>
  );
};

export default CommonModal;
