# Cómo instalar y probar MiKiosco

Guía para levantar el proyecto desde cero en otra computadora y probarlo en el
celular. Todo lo necesario está en este repositorio:

| Parte | Carpeta |
|---|---|
| Base de datos (MySQL) | `ProyABP_MiKiosco_V1/api-y-base/*.sql` |
| API (Node + Express) | `ProyABP_MiKiosco_V1/api-y-base/API_Express` |
| App móvil (Expo) | `ProyABP_MiKiosco_V1/proyecto-kiosco` |

La app no habla directo con la base: le pide los datos a la API, y la API
consulta MySQL. Por eso hay que levantar las tres cosas.

## Qué hay que tener instalado

- **Node.js** 22 o superior — https://nodejs.org
- **MySQL 8** (Server + Workbench) — https://dev.mysql.com/downloads/installer/
- **Expo Go** en el celular, desde Play Store o App Store. Que sea la versión
  actual: el proyecto usa Expo SDK 57 y las versiones viejas lo rechazan.

El celular y la computadora tienen que estar en la **misma red WiFi**.

## Paso 1 — La base de datos

Desde MySQL Workbench, abrir y ejecutar entero (el rayo) el archivo
`ProyABP_MiKiosco_V1/api-y-base/DB_ParLab_con_datos.sql`.

O desde una terminal, parados en `ProyABP_MiKiosco_V1/api-y-base`:

```bash
mysql -u root -p < DB_ParLab_con_datos.sql
```

Crea la base `DB_ParLab` con las tablas, los stored procedures y los datos del
proyecto (productos, stock, movimientos y usuarios). Ojo: si ya existe una base
`DB_ParLab`, la reemplaza.

## Paso 2 — La API

1. En la carpeta `ProyABP_MiKiosco_V1/api-y-base/API_Express`, copiar el archivo
   `.env.example` con el nombre `.env`.
2. Abrir `.env` y completar `DB_PASSWORD` con la contraseña del MySQL propio
   (la que se eligió al instalarlo). Si el usuario no es `root`, cambiar también
   `DB_USER`.
3. En una terminal, parados en esa carpeta:

```bash
npm install
npm start
```

Tiene que decir `Servidor corriendo en http://localhost:3001`.

Para comprobarlo, abrir en el navegador de la computadora
http://localhost:3001/api/productos. Tiene que aparecer una lista de productos
en formato JSON.

**Esta terminal queda abierta.** Si se cierra, la API se apaga.

## Paso 3 — La app

En otra terminal, parados en `ProyABP_MiKiosco_V1/proyecto-kiosco`:

```bash
npm install
npx expo start
```

Aparece un código QR. En **Android** se escanea desde adentro de Expo Go; en
**iPhone o iPad**, con la app Cámara.

No hace falta configurar ninguna IP: la app usa sola la IP de la computadora que
corre `npx expo start`.

## Paso 4 — Qué verificar

Para entrar se puede usar cualquier usuario de la base, por ejemplo
**usuario** `EzequielC`, **contraseña** `Eze123.`

1. **Iniciar sesión.** Con los datos de arriba entra al listado. Con una
   contraseña equivocada tiene que avisar el error.
2. **Listado con stock.** Aparecen los productos con su cantidad.
3. **Buscar por nombre.** Escribir "alfa" en el campo de arriba: la lista se
   filtra mientras se tipea.
4. **Detalle.** Tocar un producto: muestra nombre, descripción, stock y estado.
5. **Agregar un producto.** "+ Agregar producto", poner un nombre y guardar.
   Vuelve al listado y el producto nuevo aparece sin stock.
6. **Registrar un movimiento.** En el detalle, "Registrar movimiento de stock":
   un ingreso suma, y un egreso mayor al stock que hay tiene que rechazarse.
7. **Modificar un producto.** Desde el detalle, cambiar el nombre o la
   descripción.
8. **Inhabilitar y habilitar.** Inhabilitar pide un motivo, y solo se puede si
   el producto no tiene stock. Un producto inhabilitado no acepta movimientos.
9. **Eliminar un producto.** Desde el detalle.
10. **Historial.** Los movimientos, del más nuevo al más viejo, con el producto,
    quién lo registró y la fecha.
11. **Cerrar sesión.** Vuelve a la pantalla de login.

## Si algo falla

- **La app dice "Network request failed" o "fetch failed".** La API no está
  corriendo (paso 2), o el celular no llega a la computadora. Probar desde el
  navegador del celular `http://IP-DE-LA-PC:3001/api/productos` (la IP se ve con
  `ipconfig` en Windows). Si no carga, es un tema de red o del firewall.
- **Windows pregunta por el firewall al arrancar la API o Expo.** Marcar las dos
  casillas, redes privadas y públicas. Si solo se marca privadas, el celular no
  llega.
- **La API tira un error de acceso a MySQL** (`Access denied`). Está mal la
  contraseña o el usuario del `.env`.
- **La API dice que no existe la base o un procedimiento.** No se ejecutó el
  paso 1 completo.
- **Expo Go dice que el SDK es incompatible.** Actualizar Expo Go desde la
  tienda.
- **Se usa `npx expo start --tunnel`** o la API corre en otra computadora. En
  esos casos la IP automática no sirve: arrancar la app indicando la dirección de
  la API, por ejemplo en Windows (CMD):

  ```bash
  set EXPO_PUBLIC_API_URL=http://192.168.0.10:3001/api
  npx expo start
  ```

- **El puerto 3001 está ocupado.** En el `.env` agregar `PORT=4000` y arrancar la
  app con `EXPO_PUBLIC_API_URL` apuntando a ese puerto, como en el punto
  anterior.
