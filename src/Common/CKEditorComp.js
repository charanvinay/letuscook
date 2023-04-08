import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";

const CKEditorComp = (props) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        placeholder: "Type your text here...",
        // plugins: [ Paragraph, Bold, Italic, Essentials ],
        toolbar: ["bold", "italic", "|", "bulletedList", "numberedList"],
      }}
      data={props.value}
      onReady={(editor) => {
        // editor.focus();
      }}
      key={props.id}
      onChange={(event, editor) => {
        const data = editor.getData();
        props.handleChanges(data);
      }}
    />
  );
};

export default CKEditorComp;
