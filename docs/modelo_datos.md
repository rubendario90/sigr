# Modelo de datos del SIGR

| Tabla | Descripción | Relaciones |
|---|---|---|
| usuarios | Clientes, meseros y administradores | — |
| categorias | Agrupan los platos del menú | — |
| platos | Platos del menú digital | categoria_id → categorias |
| mesas | Mesas del restaurante y su capacidad | — |
| reservas | Reservas por fecha y hora | cliente_id → usuarios, mesa_id → mesas |
| pedidos | Pedidos por mesa y su estado | mesa_id → mesas, mesero_id → usuarios |
| detalle_pedido | Platos de cada pedido | pedido_id → pedidos, plato_id → platos |
| pagos | Pago de cada pedido | pedido_id → pedidos (único) |
| cierres_caja | Un cierre de caja por día | cerrado_por → usuarios |

El script completo está en `database/schema.sql`.
