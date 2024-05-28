import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { ChangeEvent, FormEvent, useState } from "react";
import COLORS from "../../../constants/colors";
import { EnumAuth } from "../../../types/types";
import { AuthFormData } from "../AuthWrapper";

type AuthFormProps = {
  authType: EnumAuth;
  onSubmit: (e: FormEvent, formData: AuthFormData) => Promise<void>;
  isLoading: boolean;
};

const AuthForm = ({ authType, onSubmit, isLoading }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form onSubmit={(e) => onSubmit(e, formData)}>
      {authType === EnumAuth.register && (
        <InputText
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
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
        required
        placeholder={"Username"}
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
        required
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
        loading={isLoading}
        label={authType === EnumAuth.login ? "Login" : "Register"}
        className="w-full mt-6"
        style={{
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.secondary,
        }}
      />
    </form>
  );
};

export default AuthForm;
