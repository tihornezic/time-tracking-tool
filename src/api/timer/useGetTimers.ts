import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { useState } from "react";

const useGetTimers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const userDocRef = doc(db, "users", user!.uid);

  const get = async () => {
    try {
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        return docSnap.data().timers;
      } else {
        // docSnap.data() will be undefined in this case
        throw new Error("No such document!");
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;

        setIsLoading(false);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  };

  return { get, isLoading, error };
};

export default useGetTimers;
