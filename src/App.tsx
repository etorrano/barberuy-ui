import "./App.scss";
import LoginRegister from "./Components/LoginRegister/LoginRegister";

const logo = require("./logo.png");

function App() {
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

export default App;
