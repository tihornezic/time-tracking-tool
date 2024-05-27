import { PrimeReactProvider } from "primereact/api";
import { useRoutes } from "react-router-dom";
import router from "./router";

const App = () => {
  const routing = useRoutes(router());

  return <PrimeReactProvider>{routing}</PrimeReactProvider>;
};

export default App;
