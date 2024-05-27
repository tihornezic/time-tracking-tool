import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import COLORS from "../constants/colors";
import { Password } from "primereact/password";
import User from "../assets/user.svg";
import { Image } from "primereact/image";
import { EnumAuth } from "../types/types";
import { useNavigate } from "react-router-dom";
import registerUpWithEmailAndPassword from "../api/auth/register";
import { useState } from "react";
import loginInWithEmailAndPassword from "../api/auth/login";
import { auth } from "../firebase/firebase";
import { Message } from "primereact/message";
import Tabs from "../components/tabs/Tabs";

type AuthProps = {
  authType: EnumAuth;
};

const Auth = ({ authType }: AuthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // add validation

    console.log("Form Data Submitted:", formData);

    if (authType === EnumAuth.register) {
      const result = await registerUpWithEmailAndPassword({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });

      console.log(result);
    }

    if (authType === EnumAuth.login) {
      setIsLoading(true);

      // sign in with the retrieved email and password
      const response = await loginInWithEmailAndPassword({
        // response will either be user object if successful, or error msg if not
        username: formData.username,
        password: formData.password,
      });

      if (typeof response !== "object") {
        setError(response);
      }

      navigate('/trackers')
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

        {error && <Message severity="error" text={error} />}

        {/* form */}
        <form onSubmit={handleSubmit}>
          {authType === EnumAuth.register && (
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={"E-mail"}
              type="text"
              className="w-full mb-5"
              pt={{
                root: {
                  style: {
                    border: "none",
                  },
                },
              }}
            />
          )}

          <InputText
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={"Username"}
            // type={authType === EnumAuth.login ? "text" : "email"}
            type="text"
            className="w-full mb-5"
            pt={{
              root: {
                style: {
                  border: "none",
                },
              },
            }}
          />

          <Password
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            toggleMask
            unstyled
            feedback={false}
            style={{ width: "100% !important" }}
            pt={{
              input: {
                style: {
                  border: "none",
                  minWidth: "100%",
                },
              },
            }}
          />

          <Button
            type="submit"
            label={authType === EnumAuth.login ? "Login" : "Register"}
            className="w-full mt-6"
            style={{
              backgroundColor: COLORS.secondary,
              borderColor: COLORS.secondary,
            }}
          />
        </form>
      </div>

      {/* lower section */}
      <div
        className="flex mt-5 border-round-lg align-content-center justify-content-evenly"
        style={{ backgroundColor: COLORS.tertiary }}
      >
        <Image src={User} alt="Image" width="100" />

        {/* need an account & register here */}
        <div className="flex flex-column justify-content-center">
          <div
            className="text-xl font-medium text-center"
            style={{ color: COLORS.tertiary100 }}
          >
            {authType === EnumAuth.login
              ? "Need an account?"
              : "Have an account?"}
          </div>

          <Button
            label={authType === EnumAuth.login ? "Register here" : "Login"}
            link
            className="font-semibold"
            pt={{
              root: {
                style: {
                  padding: 0,
                },
              },
              label: {
                style: {
                  display: "flex",
                  color: `${COLORS.secondary}`,
                  textDecoration: "underline",
                },
              },
            }}
            onClick={() =>
              authType === EnumAuth.login
                ? navigate("/register")
                : navigate("/")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
