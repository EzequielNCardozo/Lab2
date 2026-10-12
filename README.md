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

## Mejoras por clase
    Clase 1
        - Image: logo del kiosco en el login (assets/logo.png, con require)              - Completado
    Clase 4
        - TanStack Query para traer los datos de la API                                 - Completado
        - Zustand para guardar la sesión del usuario                                    - Completado
        - Íconos con @expo/vector-icons en los botones y en el buscador                 - Completado
        - SafeAreaView para que la barra del celular no tape los botones                - Completado
        - Paginación del historial con useInfiniteQuery (de a 5 movimientos)            - Completado

## Mejoras pendientes (correcciones del primer corte)
    Clase 2
        - ThemeProvider
    Clase 3
        - Tabs


## Base de datos
    - DB_ParLab_completo.sql: crea la base desde cero, con los datos iniciales.
    - DB_ParLab_con_datos.sql: la base con los datos del proyecto (productos, stock, movimientos y usuarios).
    Están en ProyABP_MiKiosco_V1/api-y-base. Para importar la que tiene datos, parados en esa carpeta:
        mysql -u root -p < DB_ParLab_con_datos.sql
    Ojo: reemplaza la base DB_ParLab que ya tengan.

####
 Recordar: Cambiar contraseña en API.js y poner la IP de su PC en config.ts
