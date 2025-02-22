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
import "../../pages/Category/Category.css";
const CategoryModal = ({
  isOpen,
  toggle,
  isEditMode,
  category,
  setCategory,
  preview,
  setPreview,
  validator,
  handleSubmit,
  handleChange,
  handleImageChange,
  isDeleteModal = false,
  confirmDelete,
}) => {
  const footerButtons = (
    <>
      <button type="button" className="btn btn-light" onClick={toggle}>
        Close
      </button>
      <button type="submit" className="btn btn-success" onClick={handleSubmit}>
        {isEditMode ? "Update Category" : "Add Category"}
      </button>
    </>
  );
  return (
    <Modal
      fade={true}
      isOpen={isOpen}
      toggle={toggle}
      centered
      contentClassName="border-0"
      className="edit-model"
    >
      <ModalHeader className="bg-light p-3 border-0" toggle={toggle}>
        <h5 className="modal-title m-0">
          {isDeleteModal
            ? "Are you Sure?"
            : isEditMode
            ? "Edit Category"
            : "Add Category"}
        </h5>
      </ModalHeader>
      <ModalBody className="p-3">
        {isDeleteModal ? (
          <div className="mt-2 text-center">
            <lord-icon
              src="https://cdn.lordicon.com/gsqxdxog.json"
              trigger="loop"
              colors="primary:#f7b84b,secondary:#f06548"
              className="w-100 h-100"
            ></lord-icon>
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4>Are you Sure ?</h4>
              <p className="text-muted mx-4 mb-0">
                Are you Sure You want to Remove this Record ?
              </p>
            </div>
          </div>
        ) : (
          <Form className="tablelist-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <Label
                htmlFor="categoryName"
                className="form-label text-start w-100"
              >
                Category Name
              </Label>
              <Input
                type="text"
                id="categoryName"
                className="form-control"
                placeholder="Enter Category Name"
                name="name"
                value={category.name}
                onChange={handleChange}
              />
              {validator.message("name", category.name, "required")}
            </div>

            <div className="mb-3">
              <Label
                htmlFor="categoryDescription"
                className="form-label text-start w-100"
              >
                Description
              </Label>
              <Input
                type="textarea"
                id="categoryDescription"
                className="form-control"
                placeholder="Enter Description"
                name="description"
                value={category.description}
                onChange={handleChange}
              />
              {validator.message(
                "description",
                category.description,
                "required"
              )}
            </div>

            <div className="mb-3">
              <Label
                htmlFor="categoryImage"
                className="form-label text-start w-100"
              >
                Category Image
              </Label>
              <Input
                type="file"
                id="categoryImage"
                className="mb-2"
                accept="image/*"
                onChange={handleImageChange}
              />
              {validator.message("image", category.image, "required")}
              {preview && (
                <div className="img-preview">
                  <img src={preview} alt="Preview" className="preview-img" />
                </div>
              )}
            </div>
          </Form>
        )}
      </ModalBody>
      <ModalFooter className="border-0 p-3">
        <div className="hstack gap-2 justify-content-end">
          {isDeleteModal ? (
            <>
              <button
                type="button"
                className="btn w-sm btn-light"
                onClick={toggle}
              >
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
            </>
          ) : (
            <>
              <button type="button" className="btn btn-light" onClick={toggle}>
                Close
              </button>
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleSubmit}
              >
                {isEditMode ? "Update Category" : "Add Category"}
              </button>
            </>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CategoryModal;
