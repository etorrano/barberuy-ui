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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const registerLink = () => {
    setAction("active");
  };

  const loginLink = () => {
    setAction("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };
      let response = await fetch(
        "https://api-dev.barber.uy/auth/login",
        options
      );
      console.log(response);

      if (response.redirected) {
        console.log(response.headers);
        const newUrl = response.headers.get("Location");
        if (newUrl) {
          // Retry the request with the new URL
          response = await fetch(newUrl, options);
        }
      }
      const r = await response.json();
      // Handle successful login
      console.log("Login successful:", r.access_token);
      if (r.access_token) {
        window.alert("Sesión iniciada");
      } else {
        setError("Correo o contraseña incorrecto");
      }
    } catch (err) {
      setError("Invalid credentials or server error.");
      console.error("Login failed:", err);
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="container">
        <div className={`wrapper ${action}`}>
          <div className="form-box login">
            <form onSubmit={handleSubmit}>
              <h1>Iniciar Sesión</h1>
              <div className="input-box">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  required
                />
                <FaEnvelope className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
                <FaLock className="icon" />
              </div>

              <div className="remember-forgot">
                <div className="flex-row">
                  <label>
                    <input type="checkbox" />
                    Recordame
                  </label>
                  <a href="/">Olvidé mi contraseña</a>
                </div>

                {error && <p className="error">{error}</p>}
                <button type="submit">Iniciar sesión</button>
                <div className="register-link">
                  <p>
                    ¿Aún no tenés cuenta?
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
                <input type="email" placeholder="Correo electrónico" required />
                <FaEnvelope className="icon" />
              </div>
              <div className="input-box">
                <input type="password" placeholder="Contraseña" required />
                <FaLock className="icon" />
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" required />
                  Acepto los términos y condiciones
                </label>
                <button type="submit">Registrar</button>
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
