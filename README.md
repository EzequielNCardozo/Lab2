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

## Features pendientes
    8- Modificar un producto
    9- Habilitar o inhabilitar un producto
    10- Eliminar un producto
    11- Filtrar el historial por fecha y por usuario

## Mejoras (clase 4)
    - TanStack Query para traer los datos de la API
    - Zustand para guardar la sesión del usuario


## Base de datos
    - DB_ParLab_completo.sql: crea la base desde cero, con los datos iniciales.
    - DB_ParLab_con_datos.sql: la base con los datos del proyecto (productos, stock, movimientos y usuarios).
    Están en ProyABP_MiKiosco_V1/api-y-base. Para importar la que tiene datos, parados en esa carpeta:
        mysql -u root -p < DB_ParLab_con_datos.sql
    Ojo: reemplaza la base DB_ParLab que ya tengan.

## Cómo levantar el proyecto
    Los pasos completos (base, API y app) están en INSTALACION.md, en la raíz del repo.
    La contraseña de MySQL va en API_Express/.env (copiar .env.example). La IP no hace falta configurarla.
