import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {firebaseConfig} from "./UtilsFirebase/firebaseconfig"

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = firebase.database();

const googleProvider = new firebase.auth.GoogleAuthProvider();

export {auth, db, googleProvider};