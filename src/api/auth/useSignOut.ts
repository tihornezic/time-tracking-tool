import { useState } from "react";
import { auth } from "../../firebase/firebase";

const useSignOut = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setIsSigningOut(true);
    setError(null);

    try {
      await auth.signOut();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        throw new Error(error.message);
      }
    } finally {
      setIsSigningOut(false);
    }
  };

  return { signOut, isSigningOut, error };
};

export default useSignOut;
