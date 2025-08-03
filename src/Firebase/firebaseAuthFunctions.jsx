import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

const provider = new GoogleAuthProvider();

export async function signUpWithEmail(email, password, name) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await sendEmailVerification(user);
    await setDoc(doc(db, "Users", user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
      createdAt: new Date().toISOString(),
    });
    return { user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function signInWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    if (!user.emailVerified) {
      await signOut(auth);
      return { error: "Please verify your email before logging in." };
    }
    return { user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function signUpWithGoogle() {
  try {
    let user;
    const result = await signInWithPopup(auth, provider);
    user = result.user;

    const userRef = doc(db, "Users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        createdAt: new Date().toISOString(),
        authProvider: "google",
      });
    }

    return { user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
