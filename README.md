# ProyectoABP - Laboratorio 2 - AguirreL, CardozoE, LobatoA, TarcayaL
## Nombre del proyecto: MiKiosco
## Descripción: 
App móvil para gestionar el catálogo y el stock de un kiosco
## Integrantes
    - Lourdes Aguirre
    - Ezequiel Cardozo
    - Araceli Lobato
    - Lisandro Tarcaya
## Features
    1- Consultar el listado de productos con su stock        - Completado
    2- Buscar un producto por nombre                         - Completado
    3- Consultar el detalle de un producto                   - Completado
    4- Agregar un producto al catálogo                       - Completado
    5- Registrar un movimiento de stock (ingreso o egreso)   - Completado
    6- Consultar el historial de movimientos                 - Completado
    7- Iniciar y cerrar sesión                               - Completado
    8- Modificar un producto                                 - Completado
    9- Habilitar o inhabilitar un producto                   - Completado
    10- Eliminar un producto                                 - Completado

## Features pendientes

    11- Registrar un movimiento de stock escaneando el código de barras del producto
        Base de datos
            - DB_migracion_v6.sql: columna codigo_barras (única, opcional) en Producto
            - SP de alta y modificación reciben el código y avisan si ya lo tiene otro producto
            - SP de listado devuelven el código
        API
            - POST y PUT de /api/productos reciben el código
        App
            - Instalar expo-camera
            - Campo "Código de barras" con botón para escanear en el alta y la modificación
            - Pantalla app/escanear.tsx: lee el código con la cámara
            - Botón "Escanear" en el catálogo: si el producto existe abre el registro de
              movimiento; si no existe, ofrece darlo de alta con ese código
        Datos
            - Cargar el código de los productos que ya existen
    12- Compartir por WhatsApp el pedido de reposición de los productos con poco stock
        Base de datos
            - DB_migracion_v6.sql: columna stock_minimo (opcional) en Producto
            - SP de alta, modificación y listado manejan el stock mínimo
        API
            - POST y PUT de /api/productos reciben el stock mínimo
        App
            - Instalar expo-sharing y react-native-view-shot
            - Campo "Stock mínimo" en el alta y la modificación
            - Pantalla app/reposicion.tsx: productos con stock igual o menor al mínimo
            - Botón "Compartir": arma una imagen del pedido y abre el menú de compartir
              del celular para mandarlo por WhatsApp
            - Botón "Reponer" en el catálogo
        Datos
            - Cargar el stock mínimo de los productos que ya existen
    13- Filtrar el historial por fecha y por usuario
    14- Alta, baja y modificación de clientes
    15- Alta, baja y modificación de proveedores
    16- Registrar el pedido de un cliente (nota de pedido)
    17- Facturar un pedido (descuenta el stock)
    18- Anular un comprobante si se cae la venta (devuelve el stock)
    19- Consultar la cuenta corriente de un cliente y registrar sus pagos
    20- Consultar los clientes deudores (saldo y antigüedad de la deuda)
    21- Registrar una orden de compra a un proveedor
    22- Recibir la mercadería de una compra (suma el stock automáticamente)

## Mejoras por clase
    Clase 1
        - Image: logo del kiosco en el login (assets/logo.png, con require)              - Completado
    Clase 2
        - ThemeProvider: modo claro y oscuro según la configuración del celular         - Completado
    Clase 3
        - Tabs en el catálogo: Todos, Habilitados e Inhabilitados                       - Completado
    Clase 4
        - TanStack Query para traer los datos de la API                                 - Completado
        - Zustand para guardar la sesión del usuario                                    - Completado
        - Íconos con @expo/vector-icons en los botones y en el buscador                 - Completado
        - SafeAreaView para que la barra del celular no tape los botones                - Completado
        - Paginación del historial con useInfiniteQuery (de a 5 movimientos)            - Completado
    Clase 6
        - expo-camera: escaneo del código de barras (feature 11)                         - Pendiente
        - expo-sharing + react-native-view-shot: pedido de reposición (feature 12)       - Pendiente

## Base de datos
    - DB_ParLab_completo.sql: crea la base desde cero, con los datos iniciales.
    - DB_ParLab_con_datos.sql: la base con los datos del proyecto (productos, stock, movimientos y usuarios).
    Están en ProyABP_MiKiosco_V1/api-y-base. Para importar la que tiene datos, parados en esa carpeta:
        mysql -u root -p < DB_ParLab_con_datos.sql
    Ojo: reemplaza la base DB_ParLab que ya tengan.

####
 Recordar: Cambiar contraseña en API.js y poner la IP de su PC en config.ts
