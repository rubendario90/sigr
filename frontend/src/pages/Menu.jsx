import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Menu() {
  const [platos, setPlatos] = useState([]);
  useEffect(() => { api("/menu/platos").then(setPlatos); }, []);
  return (
    <section>
      <h2>Menú</h2>
      <ul>{platos.filter((p) => p.disponible).map((p) => <li key={p.id}>{p.nombre} — ${p.precio.toLocaleString("es-CO")}</li>)}</ul>
    </section>
  );
}
