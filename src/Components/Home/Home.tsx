import React from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.png";

function Home() {
  return (
    /* <Suspense fallback={<p>Loading...</p>}> */
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Sitio en construcción</p> <br />
        <p>Por consultas escribinos a contacto@barber.uy</p>
      </header>
    </div>
    /* </Suspense> */
  );
}
export default Home;
