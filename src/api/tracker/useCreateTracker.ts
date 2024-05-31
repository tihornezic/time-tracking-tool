import { getAuth } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { EnumTrackerStatus, Tracker } from "../../types/types";

const useCreateTracker = () => {
  // TODO: the isLoading and error should be made into a custom hook
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async ({ description }: { description: string }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const userDocRef = doc(db, "users", user!.uid);

      await updateDoc(userDocRef, {
        trackers: arrayUnion({
          id: uuidv4(),
          description: description,
          startDate: Date.now(),
          endDate: null,
          seconds: 0,
          status: EnumTrackerStatus.active,
        } as Tracker),
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

export default useCreateTracker;
