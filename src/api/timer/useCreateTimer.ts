import { getAuth } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { v4 as uuidv4 } from "uuid";

const useCreateTimer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async ({ description }: { description: string }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      console.log("user", user);

      const userDocRef = doc(db, "users", user!.uid);

      console.log(userDocRef);

      // this is actually create new timer!
      await updateDoc(userDocRef, {
        timers: arrayUnion({
          id: uuidv4(),
          description: description,
          date: Date.now(),
          time: 0,
        }),
      });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;

        setIsLoading(false);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  };

  return { create, isLoading, error };
};

export default useCreateTimer;