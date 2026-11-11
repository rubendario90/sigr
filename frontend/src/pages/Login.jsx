import { useState } from "react";
import { api } from "../services/api";

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const enviar = async (e) => {
    e.preventDefault();
    try { onLogin(await api("/auth/login", { metodo: "POST", datos: { correo, clave } })); }
    catch (err) { setError(err.message); }
  };
  return (
    <form onSubmit={enviar}>
      <h2>Iniciar sesión</h2>
      <input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <input type="password" placeholder="Clave" value={clave} onChange={(e) => setClave(e.target.value)} />
      <button>Ingresar</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
