import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {firebaseConfig} from "./UtilsFirebase/firebaseconfig"

// import firebaseConfig from './firebaseconfig';


// const firebaseConfig = {
//     apiKey: "AIzaSyCDclOgGIRs5ra32jJ4mGXh520vFiTLn9o",
//     authDomain: "listosoftware-826ef.firebaseapp.com",
//     databaseURL: "https://listosoftware-826ef-default-rtdb.firebaseio.com",
//     projectId: "listosoftware-826ef",
//     storageBucket: "listosoftware-826ef.appspot.com",
//     messagingSenderId: "735903886998",
//     appId: "1:735903886998:web:8f7559587bf19215c21cb7",
//     measurementId: "G-KWJZJY9B4J"
//   };

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = firebase.database();



const googleProvider = new firebase.auth.GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const signInWithEmailAndPassword = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      const user = res.user;
      await db.collection("users").add({
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const logout = () => {
    auth.signOut();
  };

  export {
    auth,
    db,
    signInWithGoogle,
    signInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
  };