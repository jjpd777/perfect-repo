import {auth, db, googleProvider} from "../firebase";

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