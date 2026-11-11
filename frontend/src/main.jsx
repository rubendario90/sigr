import { useState } from "react";
import { createRoot } from "react-dom/client";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Reservas from "./pages/Reservas";
import Reportes from "./pages/Reportes";

function App() {
  const [sesion, setSesion] = useState(null);
  return (
    <main>
      <h1>SIGR</h1>
      <Menu />
      {!sesion && <Login onLogin={setSesion} />}
      {sesion?.rol === "cliente" && <Reservas token={sesion.token} />}
      {sesion?.rol === "administrador" && <Reportes token={sesion.token} />}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
