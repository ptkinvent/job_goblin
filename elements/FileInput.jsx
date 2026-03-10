import { useEffect, useRef, useState } from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Alert from "./alert";
import { truncateFileName } from "../utils/utils";

export default function FileInput({
  accept = null,
  label,
  multiple = false,
  required = true,
  maxFileCount = null,
  maxFileSize = 100,
  formData,
  setFormData,
  setFormInvalid,
}) {
  const [dragging, setDragging] = useState(false);
  const [fileCountInvalid, setFileCountInvalid] = useState(false);
  const [fileSizeInvalid, setFileSizeInvalid] = useState(false);
  const [fileTypeInvalid, setFileTypeInvalid] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Check file count
    if (maxFileCount) {
      setFileCountInvalid(formData.files.length > maxFileCount);
    }

    // Check file size
    const totalSize = formData.files.map((file) => file.size).reduce((sum, a) => sum + a, 0);
    setFileSizeInvalid(totalSize / 1024 / 1024 > maxFileSize);

    // Check file types
    const fileTypeInvalid =
      accept &&
      !formData.files.every((file) => {
        const fileType = file.name.split(".").pop();
        const allowedFileTypes = accept.split(", ").map((fileType) => fileType.toLowerCase().replace(".", ""));
        return allowedFileTypes.includes(fileType.toLowerCase());
      });
    setFileTypeInvalid(fileTypeInvalid);
  }, [formData]);

  useEffect(() => {
    setFormInvalid(fileCountInvalid || fileTypeInvalid || fileSizeInvalid || formData.files.length === 0);
  }, [fileCountInvalid, fileTypeInvalid, fileSizeInvalid, formData]);

  function handleDragEnter(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const selectedFiles = Array.prototype.slice.call(e.dataTransfer.files);
    if (multiple) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        uploadType: "document",
        files: [...prevFormData.files, ...selectedFiles], // Append
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        uploadType: "document",
        files: [selectedFiles[0]], // Replace
      }));
    }

    // Just set the files to something so that it doesn't block form submission. These aren't the actual files.
    ref.current.files = e.dataTransfer.files;
  }

  function handleChangeFile(e) {
    const selectedFiles = Array.prototype.slice.call(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      uploadType: "document",
      files: [...prevFormData.files, ...selectedFiles],
    }));
  }

  function handleRemoveFile(index) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      files: prevFormData.files.filter((_, i) => i !== index),
    }));
  }

  return (
    <>
      {fileCountInvalid && (
        <Alert
          color="warning"
          className="mt-3"
          icon={<ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />}
          rounded={false}
        >
          Please upload {maxFileCount} {maxFileCount === 1 ? "document" : "documents or fewer"}.
        </Alert>
      )}

      {fileSizeInvalid && (
        <Alert
          color="warning"
          className="mt-3"
          icon={<ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />}
          rounded={false}
        >
          Please upload less than {maxFileSize} MB at a time.
        </Alert>
      )}

      {fileTypeInvalid && (
        <Alert
          color="warning"
          className="mt-3"
          icon={<ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />}
          rounded={false}
        >
          Please select only {accept} files.
        </Alert>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-2 flex justify-center rounded-lg border border-dashed ${
          dragging
            ? "bg-primary-100 border-primary-500 dark:bg-secondary-800"
            : "border-secondary-900/25 dark:border-secondary-600"
        } px-6 py-10`}
      >
        <div className="text-center">
          <div className="mt-4 flex text-sm leading-6 text-secondary-600 justify-center">
            <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
              <span>
                {multiple
                  ? formData.files.length > 0
                    ? `Upload more files (${formData.files.length} selected)`
                    : "Upload files"
                  : formData.files.length > 0
                  ? `${formData.files[0].name}`
                  : "Upload a file"}
              </span>
              <input
                name="content"
                type="file"
                className="sr-only"
                multiple={multiple}
                accept={accept}
                required={required}
                onChange={handleChangeFile}
                ref={ref}
              />
            </label>
          </div>
          <p className="text-xs leading-5 text-secondary-600">{label}</p>

          {multiple && (
            <ul className="flex flex-col px-4 mt-6 mb-4">
              {formData.files.map((file, index) => (
                <li key={index} className="flex items-center gap-2 justify-between text-sm leading-6">
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium text-secondary-600 dark:text-secondary-400">
                      {truncateFileName(file.name, 35)}
                    </span>
                    <span className="flex-shrink-0 text-secondary-500">{(file.size / 1024 / 1024).toFixed(1)}mb</span>
                  </div>
                  <XMarkIcon
                    className="size-5 flex-shrink-0 stroke-secondary-500 hover:stroke-danger-500 cursor-pointer"
                    onClick={() => handleRemoveFile(index)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
