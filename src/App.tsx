import { PrimeReactProvider } from "primereact/api";
import { useRoutes } from "react-router-dom";
import router from "./router";
import useAuthStateListener from "./api/auth/useAuthStateListener";

const App = () => {
  const { user } = useAuthStateListener();
  const routing = useRoutes(router(user));

  return <PrimeReactProvider>{routing}</PrimeReactProvider>;
};

export default App;
