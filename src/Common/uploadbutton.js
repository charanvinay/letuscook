import React from "react";
import { Button, message, Upload } from "antd";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const Uploadbutton = (props) => {
  const uploadChange = (file) => {
    // console.log(file);
    props.onImageUpload(file);
  };
  return (
    <Upload
      action={null}
      accept="image/*"
      style={{ padding: "2px" }}
      onChange={(fileList) => {
        uploadChange(fileList.file.originFileObj);
      }}
      showUploadList={false}
    >
      <Button icon={<CameraAltIcon fontSize="15px" />}></Button>
    </Upload>
  );
};

export default Uploadbutton;
