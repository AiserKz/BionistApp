import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { Home } from "./pages/Home";
import { useTitle } from "./hooks/useTitle";
import { APP_TITLE } from "./service/appSerivce";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

function App() {
  useTitle(APP_TITLE);
  return <RouterProvider router={router} />;
}

export default App;
