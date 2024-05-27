import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const registerUpWithEmailAndPassword = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log(userCredentials);

    const user = userCredentials.user;
    const userDocRef = doc(db, "users", user.uid);

    await setDoc(userDocRef, {
      username: username,
      email: email,
    });
  } catch (error: any) {
    const errorCode = await error.code;
    const errorMessage = await error.message;

    console.log(errorMessage);
    return errorMessage;
  }
};

export default registerUpWithEmailAndPassword;
