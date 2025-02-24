import React, { useEffect, useRef } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const CommonDeleteModal = ({
  isOpen,
  toggle,
  title,
  message,
  confirmDelete,
}) => {
  const lordIconRef = useRef(null);

  useEffect(() => {
    if (window.lordicon) {
      window.lordicon.create(lordIconRef.current);
    }
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      contentClassName="border-0"
      className="delete-model"
    >
      <ModalBody className="p-3">
        <div className="mt-2 text-center">
          <lord-icon
            ref={lordIconRef}
            src="https://cdn.lordicon.com/hwjcdycb.json"
            trigger="loop"
            colors="primary:#f7b84b,secondary:#f06548"
            style={{ width: "100px", height: "100px" }}
          ></lord-icon>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you Sure ?</h4>
            <p className="text-muted mx-4 mb-0">{message}</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="border-0 p-3 d-flex justify-content-center">
        <div className="hstack gap-2 ">
          <button type="button" className="btn w-sm btn-light" onClick={toggle}>
            Close
          </button>
          <button
            type="button"
            className="btn w-sm btn-danger"
            id="delete-record"
            onClick={confirmDelete}
          >
            Yes, Delete It!
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CommonDeleteModal;
