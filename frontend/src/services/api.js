const URL = "http://localhost:3000/api";

export async function api(ruta, { metodo = "GET", datos, token } = {}) {
  const res = await fetch(`${URL}${ruta}`, {
    method: metodo,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: datos ? JSON.stringify(datos) : undefined,
  });
  const cuerpo = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(cuerpo?.error || "Error de comunicación con el servidor");
  return cuerpo;
}
