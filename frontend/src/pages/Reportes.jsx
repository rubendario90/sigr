import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Reportes({ token }) {
  const [rep, setRep] = useState(null);
  useEffect(() => { api("/caja/reportes/diario", { token }).then(setRep); }, [token]);
  if (!rep) return <p>Cargando…</p>;
  return (
    <section>
      <h2>Ventas del {rep.fecha}</h2>
      <p>Total: ${rep.total.toLocaleString("es-CO")} en {rep.pedidos_pagados} pedidos</p>
      <ul>{Object.entries(rep.por_metodo).map(([m, v]) => <li key={m}>{m}: ${v.toLocaleString("es-CO")}</li>)}</ul>
    </section>
  );
}
