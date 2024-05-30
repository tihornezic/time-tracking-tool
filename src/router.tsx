import { User } from "firebase/auth";
import { EnumAuth } from "./types/types";
import AuthWrapper from "./views/auth/AuthWrapper";
import History from "./views/history/History";
import Layout from "./views/layout/Layout";
import ProtectedRoute from "./views/protected-route/ProtectedRoute";
import Trackers from "./views/trackers/Trackers";

const router = (user: User | null) => [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <p>not found</p>,
        // element: <NotFound />,
      },
      {
        index: true,
        element: <AuthWrapper authType={EnumAuth.login} />,
      },
      {
        path: "register",
        element: <AuthWrapper authType={EnumAuth.register} />,
      },
      {
        path: "trackers",
        element: (
          <ProtectedRoute condition={user === null} to="/">
            <Trackers />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        // element: <History />
        element: (
          <ProtectedRoute condition={user === null} to="/">
            <History />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default router;
