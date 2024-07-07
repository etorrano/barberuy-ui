import React, { useState } from "react";
import "./LoginRegister.scss";
import { Suspense } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";

function LoginRegister() {
  /*  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else { */

  const [action, setAction] = useState("");

  const registerLink = () => {
    setAction("active");
  };

  const loginLink = () => {
    setAction("");
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="container">
        <div className={`wrapper ${action}`}>
          <div className="form-box login">
            <form action="">
              <h1>Iniciar Sesión</h1>
              <div className="input-box">
                <input type="text" placeholder="Correo electrónico" required />
                <FaEnvelope className="icon" />
              </div>
              <div className="input-box">
                <input type="password" placeholder="Contraseña" required />
                <FaLock className="icon" />
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" />
                  Recordame
                </label>
                <a href="/">Olvidé mi contraseña</a>
                <button type="submit">Iniciar sesión</button>
                <div className="register-link">
                  <p>
                    ¿No tienes cuenta aún?
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={registerLink}>Registrate</a>
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div className="form-box register">
            <form action="">
              <h1>Registro</h1>
              <div className="input-box">
                <input type="text" placeholder="Correo electrónico" required />
                <FaEnvelope className="icon" />
              </div>
              <div className="input-box">
                <input type="password" placeholder="Contraseña" required />
                <FaLock className="icon" />
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" />
                  Acepto los términos y condiciones
                </label>
                <button type="submit">Iniciar sesión</button>
                <div className="register-link">
                  <p>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    ¿Ya tenés cuenta? <a onClick={loginLink}>Iniciar Sesión</a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
/* } */

export default LoginRegister;
