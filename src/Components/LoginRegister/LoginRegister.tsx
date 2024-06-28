import "./LoginRegister.scss";
import { Suspense, useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import React from "react";

function LoginRegister() {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []);

  /*   if (!showing) {
    return null;
  }
  if (typeof window === "undefined") {
    return <></>;
  } else { */
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="wrapper">
        <div className="form-box login">
          <form action="">
            <h1>Iniciar Sesión</h1>
            <div className="input-box">
              <input type="text" placeholder="Correo electrónico" required />
              <FaUser className="icon" />
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
                  ¿No tienes cuenta aún? <a href="/">Registrate</a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Suspense>
  );
  /* } */
}

export default LoginRegister;
