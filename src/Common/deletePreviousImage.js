import { deleteObject, getStorage, ref } from "firebase/storage";

const deletePreviousImage = (photo) => {
  const storage = getStorage();
  const storageRef = ref(storage, photo);
  // console.log(storageRef);
  deleteObject(storageRef)
    .then(() => {
      console.log("File deleted successfully");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export default deletePreviousImage;
