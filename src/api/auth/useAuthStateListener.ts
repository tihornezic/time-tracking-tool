import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { User } from "firebase/auth";

const useAuthStateListener = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
  };
};

export default useAuthStateListener;
