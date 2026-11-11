import { useState } from "react";
import { api } from "../services/api";

export default function Reservas({ token }) {
  const [form, setForm] = useState({ fecha: "", hora: "", personas: 2 });
  const [mensaje, setMensaje] = useState("");
  const reservar = async (e) => {
    e.preventDefault();
    try {
      const r = await api("/reservas", { metodo: "POST", datos: { ...form, personas: Number(form.personas) }, token });
      setMensaje(`Reserva confirmada: mesa ${r.mesa_id}, ${r.fecha} a las ${r.hora}`);
    } catch (err) { setMensaje(err.message); }
  };
  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  return (
    <form onSubmit={reservar}>
      <h2>Reservar mesa</h2>
      <input type="date" value={form.fecha} onChange={cambiar("fecha")} />
      <input type="time" value={form.hora} onChange={cambiar("hora")} />
      <input type="number" min="1" value={form.personas} onChange={cambiar("personas")} />
      <button>Reservar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
