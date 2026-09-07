

CREATE DATABASE IF NOT EXISTS DB_ParLab 
USE DB_ParLab;


SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Auditoria_Stock;
DROP TABLE IF EXISTS Stock;
DROP TABLE IF EXISTS Producto;
DROP TABLE IF EXISTS Usuario;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================== TABLAS ==========================


CREATE TABLE Usuario (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(50) NOT NULL UNIQUE,           -- login
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    mail VARCHAR(50),
    habilitado TINYINT(1) NOT NULL DEFAULT 1,      -- 0 = inhabilitado
    motivo_baja VARCHAR(200) NULL,
    ID_usuario_baja INT NULL,
    fecha_baja DATE NULL
);
-- FK auto-referencial (quién inhabilitó al usuario)
ALTER TABLE Usuario
    ADD CONSTRAINT fk_user_baja FOREIGN KEY (ID_usuario_baja)
    REFERENCES Usuario(ID) ON DELETE SET NULL;

CREATE TABLE Producto (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100),
    habilitado TINYINT(1) NOT NULL DEFAULT 1,      
    motivo_baja VARCHAR(200) NULL,
    ID_usuario_baja INT NULL,
    fecha_baja DATE NULL,
    CONSTRAINT fk_prod_baja FOREIGN KEY (ID_usuario_baja)
        REFERENCES Usuario(ID) ON DELETE SET NULL
);

CREATE TABLE Stock (
    ID_stock INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ID_producto INT,
    cantidad INT NOT NULL,
    FOREIGN KEY (ID_producto) REFERENCES Producto (ID)
);

CREATE TABLE Auditoria_Stock (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ingreso INT,
    egreso INT,
    observacion VARCHAR(200),
    ID_stock INT,
    ID_usuario INT,
    fecha DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (ID_stock) REFERENCES Stock (ID_stock),
    FOREIGN KEY (ID_usuario) REFERENCES Usuario (ID)
);

-- ========================== STORED PROCEDURES ==========================
DELIMITER $$

-- ---------------------- PRODUCTO ----------------------
DROP PROCEDURE IF EXISTS SP_ListaProductosAll $$
CREATE PROCEDURE SP_ListaProductosAll()
BEGIN
    SELECT ID, nombre, descripcion, habilitado, motivo_baja, ID_usuario_baja, fecha_baja FROM Producto;
END$$

DROP PROCEDURE IF EXISTS SP_ListaProductosID $$
CREATE PROCEDURE SP_ListaProductosID(IN p_ID INT)
BEGIN
    SELECT ID, nombre, descripcion, habilitado, motivo_baja, ID_usuario_baja, fecha_baja
    FROM Producto WHERE ID = p_ID;
END$$

DROP PROCEDURE IF EXISTS SP_AgregarProducto $$
CREATE PROCEDURE SP_AgregarProducto(IN p_nombre VARCHAR(50), IN p_descripcion VARCHAR(100))
BEGIN
    INSERT INTO Producto (nombre, descripcion) VALUES (p_nombre, p_descripcion);
END$$

DROP PROCEDURE IF EXISTS SP_ActualizarProducto $$
CREATE PROCEDURE SP_ActualizarProducto(IN p_ID INT, IN p_nombre VARCHAR(50), IN p_descripcion VARCHAR(100))
BEGIN
    UPDATE Producto SET nombre = p_nombre, descripcion = p_descripcion WHERE ID = p_ID;
END$$

DROP PROCEDURE IF EXISTS SP_CambiarEstadoProducto $$
CREATE PROCEDURE SP_CambiarEstadoProducto(
    IN p_ID INT, IN p_habilitado TINYINT, IN p_motivo VARCHAR(200), IN p_ID_usuario INT
)
BEGIN
    IF p_habilitado = 0 THEN
        IF (SELECT COALESCE(SUM(cantidad),0) FROM Stock WHERE ID_producto = p_ID) > 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'No se puede inhabilitar: el articulo tiene stock. Debe estar en 0.';
        END IF;
        UPDATE Producto SET habilitado = 0, motivo_baja = p_motivo,
               ID_usuario_baja = p_ID_usuario, fecha_baja = CURRENT_DATE WHERE ID = p_ID;
    ELSE
        UPDATE Producto SET habilitado = 1, motivo_baja = NULL,
               ID_usuario_baja = NULL, fecha_baja = NULL WHERE ID = p_ID;
    END IF;
END$$

DROP PROCEDURE IF EXISTS SP_EliminarProducto $$
CREATE PROCEDURE SP_EliminarProducto(IN p_ID INT)
BEGIN
    IF EXISTS (
        SELECT 1 FROM Auditoria_Stock a JOIN Stock s ON a.ID_stock = s.ID_stock
        WHERE s.ID_producto = p_ID
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede eliminar: el articulo tiene correcciones de stock registradas.';
    ELSEIF (SELECT COALESCE(SUM(cantidad),0) FROM Stock WHERE ID_producto = p_ID) > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede eliminar: el articulo tiene stock. Debe estar en 0.';
    ELSE
        DELETE FROM Stock WHERE ID_producto = p_ID;
        DELETE FROM Producto WHERE ID = p_ID;
    END IF;
END$$

-- ---------------------- USUARIO ----------------------
DROP PROCEDURE IF EXISTS SP_ListaUsuariosAll $$
CREATE PROCEDURE SP_ListaUsuariosAll()
BEGIN
    SELECT ID, usuario, nombre, apellido, mail, habilitado, motivo_baja, ID_usuario_baja, fecha_baja FROM Usuario;
END$$

DROP PROCEDURE IF EXISTS SP_ListaUsuariosID $$
CREATE PROCEDURE SP_ListaUsuariosID(IN p_ID INT)
BEGIN
    SELECT ID, usuario, nombre, apellido, contrasena, mail, habilitado, motivo_baja, ID_usuario_baja, fecha_baja
    FROM Usuario WHERE ID = p_ID;
END$$

DROP PROCEDURE IF EXISTS SP_AgregarUsuario $$
CREATE PROCEDURE SP_AgregarUsuario(
    IN p_usuario VARCHAR(50), IN p_nombre VARCHAR(50), IN p_apellido VARCHAR(50),
    IN p_contrasena VARCHAR(100), IN p_mail VARCHAR(50)
)
BEGIN
    INSERT INTO Usuario (usuario, nombre, apellido, contrasena, mail, habilitado)
    VALUES (p_usuario, p_nombre, p_apellido, p_contrasena, p_mail, 1);
END$$

DROP PROCEDURE IF EXISTS SP_ActualizarUsuario $$
CREATE PROCEDURE SP_ActualizarUsuario(
    IN p_ID INT, IN p_usuario VARCHAR(50), IN p_nombre VARCHAR(50), IN p_apellido VARCHAR(50),
    IN p_contrasena VARCHAR(100), IN p_mail VARCHAR(50)
)
BEGIN
    UPDATE Usuario SET usuario = p_usuario, nombre = p_nombre, apellido = p_apellido,
           contrasena = p_contrasena, mail = p_mail WHERE ID = p_ID;
END$$

DROP PROCEDURE IF EXISTS SP_CambiarEstadoUsuario $$
CREATE PROCEDURE SP_CambiarEstadoUsuario(
    IN p_ID INT, IN p_habilitado TINYINT, IN p_motivo VARCHAR(200), IN p_ID_usuario INT
)
BEGIN
    IF p_habilitado = 0 THEN
        UPDATE Usuario SET habilitado = 0, motivo_baja = p_motivo,
               ID_usuario_baja = p_ID_usuario, fecha_baja = CURRENT_DATE WHERE ID = p_ID;
    ELSE
        UPDATE Usuario SET habilitado = 1, motivo_baja = NULL,
               ID_usuario_baja = NULL, fecha_baja = NULL WHERE ID = p_ID;
    END IF;
END$$

DROP PROCEDURE IF EXISTS SP_EliminarUsuario $$
CREATE PROCEDURE SP_EliminarUsuario(IN p_ID INT)
BEGIN
    IF EXISTS (SELECT 1 FROM Auditoria_Stock WHERE ID_usuario = p_ID) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede eliminar: el usuario tiene correcciones de stock. Inhabilitelo en su lugar.';
    ELSE
        DELETE FROM Usuario WHERE ID = p_ID;
    END IF;
END$$

-- Login: contraseña sensible a mayúsculas/minúsculas (comparación binaria) + habilitado
DROP PROCEDURE IF EXISTS SP_LoginUsuario $$
CREATE PROCEDURE SP_LoginUsuario(IN p_usuario VARCHAR(50), IN p_contrasena VARCHAR(100))
BEGIN
    SELECT ID, usuario, nombre, apellido, mail, habilitado
    FROM Usuario
    WHERE usuario = p_usuario
      AND CAST(contrasena AS BINARY) = CAST(p_contrasena AS BINARY)
      AND habilitado = 1;
END$$

-- ---------------------- STOCK ----------------------
DROP PROCEDURE IF EXISTS SP_ListaStockAll $$
CREATE PROCEDURE SP_ListaStockAll()
BEGIN
    SELECT S.ID_stock, S.ID_producto, P.nombre, S.cantidad
    FROM Stock AS S JOIN Producto AS P ON S.ID_producto = P.ID;
END$$

DROP PROCEDURE IF EXISTS SP_ListaStockID $$
CREATE PROCEDURE SP_ListaStockID(IN p_ID_stock INT)
BEGIN
    SELECT S.ID_stock, S.ID_producto, P.nombre, S.cantidad
    FROM Stock AS S JOIN Producto AS P ON S.ID_producto = P.ID
    WHERE S.ID_stock = p_ID_stock;
END$$

DROP PROCEDURE IF EXISTS SP_AgregarStock $$
CREATE PROCEDURE SP_AgregarStock(IN p_ID_producto INT, IN p_cantidad INT)
BEGIN
    INSERT INTO Stock (ID_producto, cantidad) VALUES (p_ID_producto, p_cantidad);
END$$

-- Movimiento de stock: 'I' ingreso (suma) / 'E' egreso (resta), atómico con auditoría
DROP PROCEDURE IF EXISTS SP_MovimientoStock $$
CREATE PROCEDURE SP_MovimientoStock(
    IN p_ID_producto INT, IN p_tipo CHAR(1), IN p_cantidad INT,
    IN p_observacion VARCHAR(200), IN p_ID_usuario INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    IF p_tipo = 'I' THEN
        UPDATE Stock SET cantidad = cantidad + p_cantidad WHERE ID_producto = p_ID_producto;
        INSERT INTO Auditoria_Stock (ID_stock, ingreso, egreso, observacion, ID_usuario, fecha)
        SELECT s.ID_stock, p_cantidad, 0,
               CONCAT('Ingreso manual, razon: ', p_observacion), p_ID_usuario, CURRENT_DATE
        FROM Stock AS s WHERE s.ID_producto = p_ID_producto;
    ELSE
        UPDATE Stock SET cantidad = cantidad - p_cantidad WHERE ID_producto = p_ID_producto;
        INSERT INTO Auditoria_Stock (ID_stock, ingreso, egreso, observacion, ID_usuario, fecha)
        SELECT s.ID_stock, 0, p_cantidad,
               CONCAT('Egreso manual, razon: ', p_observacion), p_ID_usuario, CURRENT_DATE
        FROM Stock AS s WHERE s.ID_producto = p_ID_producto;
    END IF;
    COMMIT;
END$$

-- Borrar registro de stock: solo si la cantidad es 0 y no tiene auditoría
DROP PROCEDURE IF EXISTS SP_BorrarStock $$
CREATE PROCEDURE SP_BorrarStock(IN p_ID_stock INT)
BEGIN
    IF (SELECT COALESCE(cantidad,0) FROM Stock WHERE ID_stock = p_ID_stock) > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede eliminar el registro: el stock debe estar en 0.';
    ELSEIF EXISTS (SELECT 1 FROM Auditoria_Stock WHERE ID_stock = p_ID_stock) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede eliminar el registro: tiene movimientos de auditoria.';
    ELSE
        DELETE FROM Stock WHERE ID_stock = p_ID_stock;
    END IF;
END$$

-- ---------------------- AUDITORIA ----------------------
DROP PROCEDURE IF EXISTS SP_ListaAuditoriaAll $$
CREATE PROCEDURE SP_ListaAuditoriaAll()
BEGIN
    SELECT * FROM Auditoria_Stock AS A;
END$$

DROP PROCEDURE IF EXISTS SP_ListaAuditoriaID $$
CREATE PROCEDURE SP_ListaAuditoriaID(IN p_ID INT)
BEGIN
    SELECT * FROM Auditoria_Stock AS A WHERE A.ID = p_ID;
END$$

DROP PROCEDURE IF EXISTS SP_AgregarAuditoria $$
CREATE PROCEDURE SP_AgregarAuditoria(
    IN p_ingreso INT, IN p_egreso INT, IN p_observacion VARCHAR(200),
    IN p_ID_stock INT, IN p_ID_usuario INT, IN p_fecha DATE
)
BEGIN
    INSERT INTO Auditoria_Stock (ingreso, egreso, observacion, ID_stock, ID_usuario, fecha)
    VALUES (p_ingreso, p_egreso, p_observacion, p_ID_stock, p_ID_usuario, p_fecha);
END$$

DELIMITER ;

-- ========================== DATOS INICIALES ==========================
-- Usuarios
INSERT INTO Usuario (usuario, nombre, apellido, contrasena, mail, habilitado) VALUES
('Lisandro', 'Lisandro Fabian', 'Tarcaya', 'Lpda13.89', 'lisandro@kiosco.test', 1),
('Ezequiel', 'Ezequiel', 'Gomez', 'Qadsa123*', NULL, 1);

-- Artículos de ejemplo
INSERT INTO Producto (nombre, descripcion) VALUES
('Coca Cola 500ml', 'Gaseosa cola'),
('Sprite 500ml', 'Gaseosa lima limon'),
('Agua Mineral 500ml', 'Sin gas'),
('Alfajor Guaymallen', 'Chocolate'),
('Galletitas Oreo', 'Original'),
('Papas Lays', 'Clasicas 145g'),
('Chocolate Milka', 'Leche 100g'),
('Cafe La Virginia', 'Molido 250g');

-- Stock inicial de ejemplo para los dos primeros artículos
INSERT INTO Stock (ID_producto, cantidad) VALUES
(1, 50),
(2, 30);

SELECT * FROM Producto
