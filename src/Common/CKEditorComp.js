import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
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
  const [editorHtml, setEditorHtml] = useState(props.value || null);
  
  const handleChange = (html) => {
    console.log(html);
    setEditorHtml(html);
    props.handleChanges(html);
  };
  return (
    // <CKEditor
    //   editor={ClassicEditor}
    //   config={{
    //     placeholder: "Type your text here...",
    //     // plugins: [ Paragraph, Bold, Italic, Essentials ],
    //     toolbar: ["bold", "italic", "|", "bulletedList", "numberedList"],
    //   }}
    //   data={props.value}
    //   onReady={(editor) => {
    //     // editor.focus();
    //   }}
    //   key={props.id}
    //   onChange={(event, editor) => {
    //     const data = editor.getData();
    //     props.handleChanges(data);
    //   }}
    // />
    <ReactQuill
      theme="snow"
      onChange={handleChange}
      value={editorHtml}
      modules={modules}
      formats={formats}
      // bounds={".app"}
      placeholder="Type your text here..."
    />
  );
};

export default CKEditorComp;
