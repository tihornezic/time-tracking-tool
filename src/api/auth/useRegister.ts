import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredentials.user;
      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        username: username,
        email: email,
      });

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

  return { register, isLoading, error };
};

export default useRegister;
