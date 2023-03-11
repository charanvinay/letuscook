import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app)

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    let user_obj = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      authProvider: "google",
      accessToken: user.accessToken,
      photoURL: user.photoURL,
    };
    localStorage.setItem('loggedUser', JSON.stringify(user_obj));
    let loggedUser = query(
      collection(db, "users"),
      where("uid", "==", user.uid)
    );
    let user_docs = await getDocs(loggedUser);
    if (user_docs.docs.length === 0) {
      await addDoc(collection(db, "users"), user_obj);
    }
  } catch (error) {
    console.log(error);
  }
};

const logOut = ()=>{
  signOut(auth);
}
export { db, auth, app, signInWithGoogle, logOut };
