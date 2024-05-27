import { EnumAuth } from "./types/types";
import Auth from "./views/Auth";
import History from "./views/History";
import Layout from "./views/Layout";
import Trackers from "./views/Trackers";

const router = () => [
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
        // path: 'login',
        element: <Auth authType={EnumAuth.login} />,
      },
      {
        path: "register",
        element: <Auth authType={EnumAuth.register} />,
      },
      {
        path: "trackers",
        element: <Trackers />,
      },
      {
        path: "history",
        element: <History />,
      },
      // {
      //   path: "play",
      //   element: (
      //     <ProtectedRoute condition={userName === ""} to="/">
      //       <PlayWrapper />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "high-scores",
      //   element: <HighScores />,
      // },
    ],
  },
];

export default router;
