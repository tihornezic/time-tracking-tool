import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { Tracker } from "../../types/types";

const useUpdateTracker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async ({
    oldObj,
    newObj,
  }: {
    oldObj?: Tracker;
    newObj?: Tracker;
  }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const userDocRef = doc(db, "users", user!.uid);

      // if no newObj got passed, delete only
      if (oldObj !== undefined) {
        await updateDoc(userDocRef, {
          trackers: arrayRemove(oldObj),
        });
      }

      // Then, add the new activity
      await updateDoc(userDocRef, {
        trackers: arrayUnion(newObj),
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

export default useUpdateTracker;
