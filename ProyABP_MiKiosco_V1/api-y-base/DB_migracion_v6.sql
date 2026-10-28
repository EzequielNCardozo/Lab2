USE DB_ParLab;

-- ============================================================
-- Producto suma el codigo de barras y el stock minimo.
-- Los pide la app movil de Laboratorio II: con el codigo se busca un producto
-- escaneando el paquete, y con el minimo se arma el pedido de reposicion.
-- Las dos columnas son opcionales porque los productos que ya existen no las tienen.
-- El codigo es UNIQUE: dos productos no pueden tener el mismo. NULL se puede repetir.
-- ============================================================
ALTER TABLE Producto
    ADD COLUMN codigo_barras VARCHAR(13) NULL UNIQUE,
    ADD COLUMN stock_minimo INT NULL;

DELIMITER $$

DROP PROCEDURE IF EXISTS SP_ListaProductosAll $$
CREATE PROCEDURE SP_ListaProductosAll()
BEGIN
    SELECT ID, nombre, descripcion, habilitado, motivo_baja, ID_usuario_baja, fecha_baja,
           codigo_barras, stock_minimo
    FROM Producto;
END$$

DROP PROCEDURE IF EXISTS SP_ListaProductosID $$
CREATE PROCEDURE SP_ListaProductosID(IN p_ID INT)
BEGIN
    SELECT ID, nombre, descripcion, habilitado, motivo_baja, ID_usuario_baja, fecha_baja,
           codigo_barras, stock_minimo
    FROM Producto WHERE ID = p_ID;
END$$

-- Un codigo vacio se guarda como NULL: si no, '' contaria como codigo repetido
DROP PROCEDURE IF EXISTS SP_AgregarProducto $$
CREATE PROCEDURE SP_AgregarProducto(
    IN p_nombre VARCHAR(50),
    IN p_descripcion VARCHAR(100),
    IN p_codigo_barras VARCHAR(13),
    IN p_stock_minimo INT
)
BEGIN
    SET p_codigo_barras = NULLIF(TRIM(p_codigo_barras), '');

    IF p_codigo_barras IS NOT NULL
       AND EXISTS (SELECT 1 FROM Producto WHERE codigo_barras = p_codigo_barras) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ya existe un producto con ese codigo de barras.';
    END IF;

    IF p_stock_minimo < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El stock minimo no puede ser negativo.';
    END IF;

    INSERT INTO Producto (nombre, descripcion, codigo_barras, stock_minimo)
    VALUES (p_nombre, p_descripcion, p_codigo_barras, p_stock_minimo);
END$$

-- p_con_codigo_y_minimo = 0 deja el codigo y el minimo como estaban.
-- Lo usa el frontend web, que no maneja estos campos: si no, los borraria al editar.
DROP PROCEDURE IF EXISTS SP_ActualizarProducto $$
CREATE PROCEDURE SP_ActualizarProducto(
    IN p_ID INT,
    IN p_nombre VARCHAR(50),
    IN p_descripcion VARCHAR(100),
    IN p_con_codigo_y_minimo TINYINT,
    IN p_codigo_barras VARCHAR(13),
    IN p_stock_minimo INT
)
BEGIN
    IF p_con_codigo_y_minimo = 0 THEN
        UPDATE Producto SET nombre = p_nombre, descripcion = p_descripcion WHERE ID = p_ID;
    ELSE
        SET p_codigo_barras = NULLIF(TRIM(p_codigo_barras), '');

        IF p_codigo_barras IS NOT NULL
           AND EXISTS (SELECT 1 FROM Producto
                       WHERE codigo_barras = p_codigo_barras AND ID <> p_ID) THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Ya existe un producto con ese codigo de barras.';
        END IF;

        IF p_stock_minimo < 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'El stock minimo no puede ser negativo.';
        END IF;

        UPDATE Producto
        SET nombre = p_nombre, descripcion = p_descripcion,
            codigo_barras = p_codigo_barras, stock_minimo = p_stock_minimo
        WHERE ID = p_ID;
    END IF;
END$$

DELIMITER ;
