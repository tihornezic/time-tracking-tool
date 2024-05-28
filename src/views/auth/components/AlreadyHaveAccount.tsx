import { Image } from "primereact/image";
import User from "../../../assets/user.svg";
import COLORS from "../../../constants/colors";
import { EnumAuth } from "../../../types/types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

type AlreadyHaveAccountProps = {
  authType: EnumAuth;
};

const AlreadyHaveAccount = ({ authType }: AlreadyHaveAccountProps) => {
  const navigate = useNavigate();

  return (
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
            authType === EnumAuth.login ? navigate("/register") : navigate("/")
          }
        />
      </div>
    </div>
  );
};

export default AlreadyHaveAccount;
