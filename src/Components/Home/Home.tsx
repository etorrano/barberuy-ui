import React from "react";
import "./Home.scss";
import logo from "../../assets/img/logo.png";
import Image from "../Image/Image";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <Image src={logo} alt="BarberUY - logo" className="App-logo" />
        <p>Sitio en construcción</p> <br />
        <p>Por consultas escribinos a contacto@barber.uy</p>
      </header>
    </div>
  );
}
export default Home;
