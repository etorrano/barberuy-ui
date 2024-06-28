/* import { useEffect, useState } from "react"; */
/* import { Link, Outlet, Route, Routes } from "react-router-dom"; */
import "./App.scss";
/* import LoginRegister from "./Components/LoginRegister/LoginRegister"; */

import React, { Suspense } from "react";
// @ts-ignore
import LoginRegister from "./Components/LoginRegister/LoginRegister.tsx";
// @ts-ignore
/* import Home from "./Components/Home/Home.tsx";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { router } from "./routes"; */
function App() {
  /*   const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []); */

  /*   if (!showing) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else { */
  return (
    <div></div>
    /* <Suspense fallback={<p>Loading...</p>}> */
    /* <div>
      <div id="outlet">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </div>
    </div> */

    /* </Suspense> */
  );
  /* } */
}

export default App;
