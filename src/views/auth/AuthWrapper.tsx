import COLORS from "../../constants/colors";
import { EnumAuth } from "../../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import { Message } from "primereact/message";
import useRegister from "../../api/auth/useRegister";
import useLogin from "../../api/auth/useLogin";
import AuthForm from "./components/AuthForm";
import AlreadyHaveAccount from "./components/AlreadyHaveAccount";
import useAuthStateListener from "../../api/auth/useAuthStateListener";

type AuthWrapperProps = {
  authType: EnumAuth;
};

export type AuthFormData = {
  email: string;
  username: string;
  password: string;
};

const AuthWrapper = ({ authType }: AuthWrapperProps) => {
  const navigate = useNavigate();
  const { key } = useLocation();
  const { user } = useAuthStateListener();

  if (user !== null) navigate("/trackers");

  const {
    register,
    isLoading: isRegisterLoading,
    error: registerError,
  } = useRegister();

  const { login, isLoading: isLoginLoading, error: loginError } = useLogin();

  const handleSubmit = async (e: FormEvent, formData: AuthFormData) => {
    e.preventDefault();

    if (authType === EnumAuth.register) {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });

      navigate("/trackers");
    }

    if (authType === EnumAuth.login) {
      // sign in with the retrieved email and password
      await login({
        username: formData.username,
        password: formData.password,
      });

      navigate("/trackers");
    }
  };

  return (
    <div className="flex flex-column sm:w-8 md:w-5 lg:w-5 xl:w-25rem">
      {/* upper section */}
      <div
        className="p-4 pb-7 border-round-lg"
        style={{ backgroundColor: COLORS.tertiary }}
      >
        <div className="text-2xl font-bold mb-5 text-center">
          {authType === EnumAuth.login ? "Login" : "Register"}
        </div>

        {(registerError || loginError) && (
          <Message
            className="my-3 w-full"
            severity="error"
            text={registerError || loginError}
          />
        )}

        {/* form */}
        <AuthForm
          key={key}
          authType={authType}
          onSubmit={handleSubmit}
          isLoading={isRegisterLoading || isLoginLoading}
        />
      </div>

      <AlreadyHaveAccount authType={authType} />
    </div>
  );
};

export default AuthWrapper;
