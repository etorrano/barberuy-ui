import React from "react";
import "./Home.scss";
import logo from "../../assets/img/logo.png";
import Image from "../Image/Image";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <Image
          src={logo}
          alt="BarberUY - Busca tu barbería en Uruguay"
          className="App-logo"
        />
        <div id="content"></div>
        <p>Sitio en construcción</p> <br />
        <p>Agenda web para barberías en Uruguay</p>
        <p>
          Si tenés una barbería comunicate para obtener tu agenda digital y
          mejorar el servicio que brindas a tus clientes
        </p>
        <br />
        <p>Por consultas escribinos a contacto@barber.uy</p>
      </header>
    </div>
  );
}
export default Home;
