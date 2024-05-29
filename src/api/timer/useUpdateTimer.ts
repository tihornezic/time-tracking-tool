import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firebase";

const useUpdateTimer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async ({ oldObj, newObj }: { oldObj: any; newObj?: any }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const userDocRef = doc(db, "users", user!.uid);

      // if no newObj got passed, delete only
      if (oldObj !== undefined) {
        await updateDoc(userDocRef, {
          timers: arrayRemove(oldObj),
        });
      }

      // Then, add the new activity
      await updateDoc(userDocRef, {
        timers: arrayUnion(newObj),
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

  return { update, isLoading, error };
};

export default useUpdateTimer;
