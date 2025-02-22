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
import "./Category.css";
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
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      contentClassName="border-0"
      className="edit-model"
    >
      <ModalHeader
        className="bg-light p-3 border-0 model-header"
        toggle={toggle}
      >
        <h5 className="modal-title m-0">
          {isEditMode ? "Edit Category" : "Add Category"}
        </h5>
      </ModalHeader>
      <ModalBody className="p-3 model-body">
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
            {validator.message("description", category.description, "required")}
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
      </ModalBody>
      <ModalFooter className="border-0 p-3" style={{ paddingTop: "0.5rem" }}>
        <div className="hstack gap-2 justify-content-end">
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
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CategoryModal;
