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

    11- Filtrar el historial por fecha y por usuario
    12- Alta, baja y modificación de clientes
    13- Alta, baja y modificación de proveedores
    14- Registrar el pedido de un cliente (nota de pedido)
    15- Facturar un pedido (descuenta el stock)
    16- Anular un comprobante si se cae la venta (devuelve el stock)
    17- Consultar la cuenta corriente de un cliente y registrar sus pagos
    18- Consultar los clientes deudores (saldo y antigüedad de la deuda)
    19- Registrar una orden de compra a un proveedor
    20- Recibir la mercadería de una compra (suma el stock automáticamente)

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

## Base de datos
    - DB_ParLab_completo.sql: crea la base desde cero, con los datos iniciales.
    - DB_ParLab_con_datos.sql: la base con los datos del proyecto (productos, stock, movimientos y usuarios).
    Están en ProyABP_MiKiosco_V1/api-y-base. Para importar la que tiene datos, parados en esa carpeta:
        mysql -u root -p < DB_ParLab_con_datos.sql
    Ojo: reemplaza la base DB_ParLab que ya tengan.

####
 Recordar: Cambiar contraseña en API.js y poner la IP de su PC en config.ts
