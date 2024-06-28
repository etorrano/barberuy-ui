import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Components/Home/Home";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import React from "react";

export const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <LoginRegister />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
