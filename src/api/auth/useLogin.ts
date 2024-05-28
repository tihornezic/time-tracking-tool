import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No user found with this username.");
      }

      // assuming usernames are unique and there's only one match
      const userDoc = querySnapshot.docs[0];
      const userEmail = userDoc.data().email;

      await signInWithEmailAndPassword(auth, userEmail, password);

      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;

        setIsLoading(false);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
