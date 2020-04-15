CREATE DATABASE castellanos;

USE castellanos;

-- TABLES --

CREATE DATABASE castellanos;

USE castellanos;

CREATE TABLE codigo_postal(
	cp VARCHAR(6) PRIMARY KEY,
    pais VARCHAR(60),
    estado VARCHAR(60),
    localidad VARCHAR(60)
);

CREATE TABLE proveedor(
	rfc VARCHAR(13) PRIMARY KEY,
    razon_social VARCHAR(70),
    cp VARCHAR(6),
    telefono VARCHAR(15),
    email VARCHAR(50)
);

CREATE TABLE clasificacion_refaccion(
	id_clasificacion INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60)
);

CREATE TABLE unidad_refaccion(
	id_unidad INTEGER AUTO_INCREMENT PRIMARY KEY,
    unidad VARCHAR(60)
);

CREATE TABLE refaccion(
	numParte VARCHAR(20) PRIMARY KEY,
    id_unidad INTEGER,
    descripcion TEXT,
    observacion TEXT,
    precio_venta NUMERIC(9,2),
    precio_compra NUMERIC(9,2),
    imagen LONGBLOB,
    existencias INTEGER,
    id_clasificacion INTEGER
);

CREATE TABLE proveedor_distribuye_refaccion(
	rfc VARCHAR(13),
    numParte VARCHAR(20),
    PRIMARY KEY (rfc, numParte)
);

CREATE TABLE automovil(
	id_automovil INTEGER AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(60),
    modelo VARCHAR(60),
    placa VARCHAR(20),
    kilometraje INTEGER,
    cant_combustible NUMERIC(6,2),
    falla TEXT,
    accesorios TEXT
);

CREATE TABLE usuario(
	id_usuario INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellidoMat VARCHAR(50),
    apellidoPat VARCHAR(50),
    username VARCHAR(60),
    pass VARCHAR(40),
    tipo_usuario VARCHAR(50),
    estado VARCHAR(25)
);

CREATE TABLE servicio(
	folio_servicio INTEGER AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(50) DEFAULT "revision",
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio_total NUMERIC(9,2),
    adelanto INTEGER DEFAULT (precio_total*0.30),
    id_automovil INTEGER,
    id_usuario INTEGER
);

CREATE TABLE servicio_utiliza_refaccion(
	numParte VARCHAR(20),
    folio_servicio INTEGER,
    cantidad INTEGER,
    PRIMARY KEY (numParte, folio_servicio)
);

CREATE TABLE usuario_asiste_servicio(
	folio_servicio INTEGER PRIMARY KEY,
    id_usuario INTEGER
);

CREATE TABLE venta(
	folio_venta INTEGER AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT
);

CREATE TABLE venta_agrega_refaccion(
	folio_venta INTEGER,
    numParte VARCHAR(20),
    cantidad INTEGER,
    PRIMARY KEY (folio_venta, numParte)
);

CREATE TABLE devolucion(
	folio_devolucion INTEGER AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER,
    folio_venta INTEGER
);

CREATE TABLE devolucion_requiere_refaccion(
	folio_devolucion INTEGER,
    numParte VARCHAR(20),
    cantidad INTEGER,
    motivo TEXT,
    tipo VARCHAR(10),
    PRIMARY KEY (folio_devolucion, numParte)
);

-- RELATIONS --

USE castellanos;

-- RELACIÓN proveedor - codigo_postal
ALTER TABLE proveedor
ADD FOREIGN KEY (cp)
REFERENCES codigo_postal (cp) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN proveedor_distribuye_refaccion - proveedor
ALTER TABLE proveedor_distribuye_refaccion
ADD FOREIGN KEY (rfc)
REFERENCES proveedor (rfc) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN proveedor_distribuye_refaccion - refaccion
ALTER TABLE proveedor_distribuye_refaccion
ADD FOREIGN KEY (numParte)
REFERENCES refaccion (numParte) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN refaccion - clasificacion_refaccion
ALTER TABLE refaccion
ADD FOREIGN KEY (id_clasificacion)
REFERENCES clasificacion_refaccion (id_clasificacion) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN refaccion - unidad_refaccion
ALTER TABLE refaccion
ADD FOREIGN KEY (id_unidad)
REFERENCES unidad_refaccion (id_unidad) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN servicio_utiliza_refaccion - refaccion
ALTER TABLE servicio_utiliza_refaccion
ADD FOREIGN KEY (numParte)
REFERENCES refaccion (numParte) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN servicio_utiliza_refacción - servicio
ALTER TABLE servicio_utiliza_refaccion
ADD FOREIGN KEY (folio_servicio)
REFERENCES servicio (folio_servicio) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN servicio - automovil
ALTER TABLE servicio
ADD FOREIGN KEY (id_automovil)
REFERENCES automovil (id_automovil) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN servicio - usuario
ALTER TABLE servicio
ADD FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN usuario_asiste_servicio - servicio
ALTER TABLE usuario_asiste_servicio
ADD FOREIGN KEY (folio_servicio)
REFERENCES servicio (folio_servicio) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN usuario_asiste_servicio - usuario
ALTER TABLE usuario_asiste_servicio
ADD FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN venta_agrega_refaccion - refaccion
ALTER TABLE venta_agrega_refaccion
ADD FOREIGN KEY (numParte)
REFERENCES refaccion (numParte) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN venta_agrega_refaccion - venta
ALTER TABLE venta_agrega_refaccion
ADD FOREIGN KEY (folio_venta)
REFERENCES venta(folio_venta) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN venta - usuario
ALTER TABLE venta
ADD FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN devolución - venta
ALTER TABLE devolucion
ADD FOREIGN KEY (folio_venta)
REFERENCES venta (folio_venta) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN devolucion - usuario
ALTER TABLE devolucion
ADD FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN devolucion_requiere_refaccion - refaccion
ALTER TABLE devolucion_requiere_refaccion
ADD FOREIGN KEY (numParte)
REFERENCES refaccion (numParte) ON DELETE CASCADE ON UPDATE CASCADE;

-- RELACIÓN devolucion_requiere_refaccion devolucion
ALTER TABLE devolucion_requiere_refaccion
ADD FOREIGN KEY (folio_devolucion)
REFERENCES devolucion (folio_devolucion) ON DELETE CASCADE ON UPDATE CASCADE;

-- TRIGGERS --
USE castellanos;

DELIMITER %%
CREATE TRIGGER venta_agrega_refaccion_AI
AFTER INSERT ON venta_agrega_refaccion
FOR EACH ROW
BEGIN
	UPDATE refaccion AS  r
    SET r.existencias = r.existencias - NEW.cantidad
    WHERE r.numParte = NEW.numParte;
END %%

DELIMITER %%
CREATE TRIGGER servicio_utiliza_refaccion_AI
AFTER INSERT ON servicio_utiliza_refaccion
FOR EACH ROW
BEGIN
	DECLARE precio FLOAT;

    SELECT (NEW.cantidad * r.precio_venta) INTO precio
    FROM refaccion AS r
    WHERE r.numParte = NEW.numParte;

    UPDATE servicio AS s
    SET s.precio_total = s.precio_total + precio
    WHERE s.folio_servicio = NEW.folio_servicio;

    UPDATE refaccion AS  r
    SET r.existencias = r.existencias - NEW.cantidad
    WHERE r.numParte = NEW.numParte;
END %%

DELIMITER %%
CREATE TRIGGER devolucion_requiere_refaccion_AI
AFTER INSERT ON devolucion_requiere_refaccion
FOR EACH ROW
BEGIN
	DECLARE fd INTEGER;

    IF NEW.tipo = 'especie' THEN

		UPDATE refaccion AS r
		SET r.existencias = r.existencias - NEW.cantidad
        WHERE r.numParte = NEW.numParte;

	ELSE

		SELECT d.folio_venta INTO fd
		FROM devolucion AS d
		WHERE d.folio_devolucion = NEW.folio_devolucion;

		UPDATE venta_agrega_refaccion AS var
		SET var.cantidad = var.cantidad - NEW.cantidad
		WHERE var.numParte = NEW.numParte AND var.folio_venta = fd;

    END IF;

END %%

DELIMITER %%
CREATE TRIGGER usuario_asiste_servicio_AI
AFTER INSERT ON usuario_asiste_servicio
FOR EACH ROW
BEGIN
	UPDATE servicio AS s
    SET s.estado = "proceso"
    WHERE s.folio_servicio = NEW.folio_servicio;
END %%

-- VIEWS --
CREATE VIEW ingresoVentas AS
 SELECT v.folio_venta AS folio, v.fecha AS fecha,
	(SELECT SUM(var.cantidad * r.precio_venta)
	FROM venta_agrega_refaccion AS var
	INNER JOIN refaccion AS r
	ON r.numParte = var.numParte
	GROUP BY var.folio_venta
	HAVING var.folio_venta = v.folio_venta) AS precio_total
 FROM venta AS v;

 CREATE VIEW ingresoServicios AS
 SELECT s.folio_servicio AS folio, s.fecha AS fecha,
		s.precio_total AS precio_total
 FROM servicio AS s
 WHERE S.estado = 'terminado';

 CREATE VIEW egresosDevoluciones AS
 SELECT d.folio_devolucion AS folio, d.fecha AS fecha,
	(SELECT SUM(drr.cantidad * r.precio_venta)
    FROM devolucion_requiere_refaccion AS drr
    INNER JOIN refaccion AS r
    ON r.numParte = drr.numParte
    GROUP BY drr.folio_devolucion
    HAVING drr.folio_devolucion = d.folio_devolucion) AS perdida
FROM devolucion AS d;

-- FUNCTIONS --

SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER %%
CREATE FUNCTION obtenerSiguienteNumero(nombreTabla VARCHAR(40)) RETURNS INTEGER
BEGIN
	DECLARE sigNumero INTEGER;

	SELECT `AUTO_INCREMENT` INTO sigNumero
	FROM  INFORMATION_SCHEMA.TABLES
	WHERE TABLE_SCHEMA = 'castellanos'
	AND   TABLE_NAME   = nombreTabla;

    RETURN sigNumero;
END %%
