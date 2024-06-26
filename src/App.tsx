import { useEffect, useState } from "react";
import "./App.scss";
import logo from "./logo.png";

function App() {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Sitio en construcción</p> <br />
          <p>Por consultas escribinos a contacto@barber.uy</p>
        </header>
      </div>
    );
  }
}

export default App;
