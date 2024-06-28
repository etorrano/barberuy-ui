// @ts-ignore
import App from "./App"; // @ts-ignore
import Home from "./Components/Home/Home.tsx"; // @ts-ignore
import LoginRegister from "./Components/LoginRegister/LoginRegister.tsx";
import React from "react";

export const routes = [
  {
    path: "/",
    element: <Home />,
    /* children: [
      {
        path: "",
        element: <div></div>,
      },
      {
        path: "login",
        element: <div></div>,
      },
    ], */
  },
  {
    path: "/login",
    element: <LoginRegister />,
    /* children: [
      {
        path: "",
        element: <div></div>,
      },
      {
        path: "login",
        element: <div></div>,
      },
    ], */
  },
];
