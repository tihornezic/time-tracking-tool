import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { useState } from "react";

const useGetTimer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const userDocRef = doc(db, "users", user!.uid);

      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data().timers);
        return docSnap.data().timers;
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
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

export default useGetTimer;
