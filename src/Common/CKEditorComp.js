import React from "react";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { getIsDarkMode } from "../redux/slices/userSlice";

const modules = {
  toolbar: [
    [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      { list: "ordered" },
      { list: "bullet" },
    ],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
];

const CKEditorComp = (props) => {
  const handleChange = (html) => {
    props.handleChanges(html);
  };
  const isDarkMode = useSelector(getIsDarkMode);
  const classname = isDarkMode ? "ctsm-editor dark" : "ctsm-editor"
  return (
    <ReactQuill
      theme="snow"
      onChange={handleChange}
      value={props.value}
      modules={modules}
      formats={formats}
      // bounds={".app"}
      className={classname}
      placeholder="Type your text here..."
    />
  );
};

export default CKEditorComp;
