import { useState } from "react";
import { auth } from "../../firebase/firebase";

const useSignOut = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState(null);

  const signOut = async () => {
    setIsSigningOut(true);
    setError(null);

    try {
      await auth.signOut();
      console.log("User signed out!");
    } catch (err: any) {
      setError(err.message);
      console.error("Error signing out:", err.message);
    } finally {
      setIsSigningOut(false);
    }
  };

  return { signOut, isSigningOut, error };
};

export default useSignOut;
