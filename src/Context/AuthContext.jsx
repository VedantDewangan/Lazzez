import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth, db } from "../Firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let unsubscribe;
    const handleAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const user = result.user;
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
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Google redirect error:", error.message);
      }
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Wait for latest user state
          await user.reload();

          if (
            user.emailVerified ||
            user.providerData[0].providerId === "google.com"
          ) {
            setCurrentUser(user);
          } else {
            // Not verified: sign out and don't set user
            await auth.signOut();
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }

        setLoading(false);
      });
    };
    handleAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
