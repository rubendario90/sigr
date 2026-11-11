-- Esquema relacional del SIGR para PostgreSQL 16
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  clave_hash VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('cliente', 'mesero', 'administrador'))
);
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
);
CREATE TABLE platos (
  id SERIAL PRIMARY KEY,
  categoria_id INT NOT NULL REFERENCES categorias(id),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL CHECK (precio > 0),
  disponible BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE mesas (
  id SERIAL PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  capacidad INT NOT NULL CHECK (capacidad > 0)
);
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES usuarios(id),
  mesa_id INT NOT NULL REFERENCES mesas(id),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  personas INT NOT NULL CHECK (personas > 0),
  estado VARCHAR(15) NOT NULL DEFAULT 'activa'
);
-- Una mesa no puede tener dos reservas activas a la misma fecha y hora
CREATE UNIQUE INDEX ux_reserva_mesa ON reservas (mesa_id, fecha, hora) WHERE estado = 'activa';
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  mesa_id INT NOT NULL REFERENCES mesas(id),
  mesero_id INT NOT NULL REFERENCES usuarios(id),
  estado VARCHAR(20) NOT NULL DEFAULT 'recibido',
  total NUMERIC(12,2) NOT NULL,
  pagado BOOLEAN NOT NULL DEFAULT FALSE,
  fecha TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE detalle_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL REFERENCES pedidos(id),
  plato_id INT NOT NULL REFERENCES platos(id),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10,2) NOT NULL
);
CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL UNIQUE REFERENCES pedidos(id),
  metodo VARCHAR(15) NOT NULL CHECK (metodo IN ('efectivo', 'tarjeta', 'transferencia')),
  valor NUMERIC(12,2) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE TABLE cierres_caja (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  total NUMERIC(12,2) NOT NULL,
  cerrado_por INT NOT NULL REFERENCES usuarios(id)
);
