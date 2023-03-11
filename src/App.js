import React, { useState } from "react";
import "./App.css";

function App() {
  const [imgsrc, setImg] = useState(null);
  return (
    <div className="App">
      <input
        hidden
        accept="image/*"
        type="file"
        id="uploadPhotoInput"
        name="uploadPhotoInput"
        capture="environment"
        value=""
        onChange={(e) => {
          e.preventDefault();
          alert(e.target.files[0].name);
          setImg(URL.createObjectURL(e.target.files[0]));
          // handleChanges(e.target.files[0], "image");
        }}
        // onClick={handleClick}
      />
      {imgsrc && <img src={imgsrc} alt="sdf" />}
    </div>
  );
}

export default App;
