DROP DATABASE TallerLaUnion

CREATE DATABASE TallerLaUnion
GO

 GO
use TallerLaUnion
/*
 ROLES Y USUARIOS*/

 CREATE TABLE TipoEstado(
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50)
);

CREATE TABLE Estado(
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    Estado VARCHAR(50),
    IdTipoEstado INT NOT NULL,
    FOREIGN KEY (IdTipoEstado) REFERENCES TipoEstado(Consecutivo)
);


CREATE TABLE Roles (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    NombreRol VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(200)
);


drop table Usuarios
CREATE TABLE Usuarios (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto VARCHAR(120) NOT NULL,
    Cedula VARCHAR(50),
    Correo VARCHAR(120) UNIQUE NOT NULL,
    UsuarioLogin VARCHAR(50) UNIQUE NOT NULL,
    Contrasenna VARCHAR(250) NOT NULL,
    Estado INT,
    FechaRegistro DATETIME DEFAULT GETDATE(),
   NombreRol INT NOT NULL,
    FOREIGN KEY (NombreRol) REFERENCES Roles(Consecutivo),
  FOREIGN KEY (Estado) REFERENCES Estado(Consecutivo)
);


 drop table Vehiculos
CREATE TABLE Vehiculos (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    Nombre_Cliente VARCHAR(100),
    Telefono INT,
    Cedula VARCHAR(100),
    Placa VARCHAR(20),
    Marca VARCHAR(50),
    Modelo VARCHAR(50),
    Anio INT,
    Problema VARCHAR(500),
    Revision VARCHAR(500),
    Estado INT,
    FOREIGN KEY (Estado) REFERENCES Estado(Consecutivo)
);
 ALTER TABLE VEHICULOS ADD FechaRegistro DATETIME DEFAULT GETDATE();
 ALTER TABLE VEHICULOS DROP UQ__Vehiculo__8310F99D9A445CCF
 ALTER TABLE Vehiculos
ADD Deuda DECIMAL(10,2) NULL,
    Monto DECIMAL(10,2) NULL,
    IngresoId INT NULL;
/*
= CITAS*/
drop table Citas
CREATE TABLE Citas (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    NombreCliente VARCHAR(100),
    Cedula VARCHAR(100),
    FechaCita DATE NOT NULL,
    HoraCita TIME NOT NULL,
    Telefono INT,
    Email VARCHAR(100),
    Servicio VARCHAR(200),
    Estado INT,
    CreadaPor INT NOT NULL,

    FOREIGN KEY (CreadaPor) REFERENCES Usuarios(Consecutivo),
   FOREIGN KEY (Estado) REFERENCES Estado(Consecutivo)
);
ALTER TABLE Citas
ADD ModificadoPor INT NULL,
    FechaModificacion DATETIME NULL;




/*INVENTARIO*/
drop table Proveedores
CREATE TABLE Proveedores (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Telefono VARCHAR(20),
    Correo VARCHAR(120),
    Direccion VARCHAR(200)
    
);
ALTER TABLE proveedores 
ADD Estado INT;

UPDATE PROVEEDORES SET ESTADO =1;

ALTER TABLE PROVEEDORES ADD CONSTRAINT FK_Proveedores_Estado FOREIGN KEY (Estado) REFERENCES Estado(Consecutivo)
 ALTER TABLE PROVEEDORES ADD FechaRegistro DATETIME DEFAULT GETDATE();

 
select * from Proveedores
CREATE TABLE Productos (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(120) NOT NULL,
    IdArticulo Varchar (50) NOT NULL,
    Descripcion VARCHAR(200),
    PrecioCompra DECIMAL(10,2) NOT NULL,
    PrecioVenta DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL,
    StockMinimo INT DEFAULT 5,
    Proveedor INT,
    FOREIGN KEY (Proveedor) REFERENCES Proveedores(Consecutivo)
);
 ALTER TABLE PRODUCTOS ADD FechaRegistro DATETIME DEFAULT GETDATE();




/* CONTABILIDAD*/
drop table Ingresos
CREATE TABLE Ingresos (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    Descripcion VARCHAR(200),
    Monto DECIMAL(10,2) NOT NULL,
    Saldo_Pendiente DECIMAL(10,2),
    Estado INT,
    Fecha DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (Estado) REFERENCES Estado(Consecutivo)
);


drop table Egresos
CREATE TABLE Egresos (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    Motivo VARCHAR(200),
    Monto DECIMAL(10,2) NOT NULL,
    Cantidad INT,
    Fecha DATETIME DEFAULT GETDATE(),
    RegistradoPor INT NOT NULL,
    MetodoPago VARCHAR(50),
    FOREIGN KEY (RegistradoPor) REFERENCES Usuarios(Consecutivo),
);

/*REPORTERÍA*/
drop table Reporteria
CREATE TABLE Reporteria (
    Consecutivo INT IDENTITY(1,1) PRIMARY KEY,
    TipoReporte VARCHAR(50) NOT NULL,
    FechaGeneracion DATETIME DEFAULT GETDATE(),
    IdUsuario INT NOT NULL,
    IdIngreso INT NULL,
    IdEgreso INT NULL,
    IdCita INT NULL,
    IdVehiculo INT NULL,
    --IdOrden INT NULL,
    IdProducto INT NULL,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(Consecutivo),
    FOREIGN KEY (IdIngreso) REFERENCES Ingresos(Consecutivo),
    FOREIGN KEY (IdEgreso) REFERENCES Egresos(Consecutivo),
    FOREIGN KEY (IdCita) REFERENCES Citas(Consecutivo),
    FOREIGN KEY (IdVehiculo) REFERENCES Vehiculos(Consecutivo),
    --FOREIGN KEY (IdOrden) REFERENCES OrdenesTrabajo(Consecutivo),
    FOREIGN KEY (IdProducto) REFERENCES Productos(Consecutivo)
);

drop table HorarioTaller
CREATE TABLE HorarioTaller(
    Consecutivo INT PRIMARY KEY IDENTITY,
    Fecha DATE NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFin TIME NOT NULL,
    Estado INT NULL,
    FOREIGN KEY(Estado) REFERENCES Estado(Consecutivo)
)
/*  PROCEDIMIENTOS ALMACENADOS*/


/*USUARIOS*/

drop procedure sp_RegistroUsuario
CREATE PROCEDURE sp_RegistroUsuario
    @NombreCompleto VARCHAR(100),
    @Cedula VARCHAR(20),
    @Correo VARCHAR(100),
    @UsuarioLogin VARCHAR(50),
    @Contrasenna VARCHAR(200),
    @Estado INT,
    @NombreRol INT
AS
BEGIN

    -- VALIDAR CEDULA
    IF EXISTS (SELECT 1 FROM Usuarios WHERE Cedula = @Cedula)
    BEGIN
        SELECT -1 AS Resultado
        RETURN
    END

    -- VALIDAR USUARIO
    IF EXISTS (SELECT 1 FROM Usuarios WHERE UsuarioLogin = @UsuarioLogin)
    BEGIN
        SELECT -2 AS Resultado
        RETURN
    END

    -- INSERT
    INSERT INTO Usuarios
    (
        NombreCompleto,
        Cedula,
        Correo,
        UsuarioLogin,
        Contrasenna,
        Estado,
        NombreRol
    )
    VALUES
    (
        @NombreCompleto,
        @Cedula,
        @Correo,
        @UsuarioLogin,
        @Contrasenna,
        @Estado,
        @NombreRol
    )

    SELECT 1 AS Resultado

END

drop procedure [dbo].[sp_ConsultarUsuarios]
CREATE PROCEDURE sp_ConsultarUsuarios
AS
BEGIN
    SELECT 
        U.Consecutivo,
        U.NombreCompleto,
        U.Cedula,
        U.Correo,
        U.UsuarioLogin,
        U.FechaRegistro,
        R.NombreRol,
        E.Estado AS Estado
    FROM Usuarios U
    INNER JOIN Roles R ON U.NombreRol = R.Consecutivo
    INNER JOIN Estado E ON U.Estado = E.Consecutivo
 WHERE U.Consecutivo <> 4
END



drop procedure [dbo].[sp_ObtenerRoles]
CREATE PROCEDURE [dbo].[sp_ObtenerRoles]
AS
BEGIN

    SELECT 
    Consecutivo, 
      NombreRol,
        Descripcion
    FROM Roles

END
GO


DROP PROCEDURE [dbo].[sp_ObtenerEstado]
CREATE PROCEDURE sp_ObtenerEstado
@IdTipoEstado INT
AS
BEGIN
    SELECT 
        Consecutivo,
        Estado
    FROM Estado
    WHERE IdTipoEstado = @IdTipoEstado
     ORDER BY
        CASE
            WHEN @IdTipoEstado = 3 AND Consecutivo = 7 THEN 1  -- Ingresado
            WHEN @IdTipoEstado = 3 AND Consecutivo = 9 THEN 2  -- Reparando
            WHEN @IdTipoEstado = 3 AND Consecutivo = 8 THEN 3  -- Revisado
            ELSE Consecutivo
        END;
END
GO

CREATE PROCEDURE [dbo].[sp_ObtenerId]
    @Consecutivo INT
AS
BEGIN
    SELECT 
        U.Consecutivo,
        U.NombreCompleto,
        U.Cedula,
        U.Correo,
        U.UsuarioLogin,
        U.Contrasenna,
        U.Estado,
        U.NombreRol
    FROM Usuarios U
    WHERE U.Consecutivo = @Consecutivo
END

EXEC sp_ObtenerId 1
DROP PROCEDURE  [dbo].[sp_EditarUsuario]
CREATE PROCEDURE [dbo].[sp_EditarUsuario]
    @Consecutivo INT,
    @NombreCompleto VARCHAR(120),
    @Cedula VARCHAR(20),
    @Correo VARCHAR(120),
    @UsuarioLogin VARCHAR(50), 
   @NombreRol INT,
    @Contrasenna VARCHAR(100) = NULL
AS
BEGIN

UPDATE Usuarios
SET 
    NombreCompleto = @NombreCompleto,
    Cedula = @Cedula,
    Correo = @Correo,
    UsuarioLogin = @UsuarioLogin,
    NombreRol = @NombreRol,

    Contrasenna = CASE 
                    WHEN @Contrasenna IS NULL OR @Contrasenna = ''
                    THEN Contrasenna
                    ELSE @Contrasenna
                  END

WHERE Consecutivo = @Consecutivo

END


/*PROVEEDOR*/
drop procedure  sp_RegistroProveedor
CREATE PROCEDURE sp_RegistroProveedor
    @Nombre VARCHAR(100),
    @Telefono VARCHAR(20),
    @Correo VARCHAR(100),
    @Direccion VARCHAR(MAX),
    @Estado INT
AS
BEGIN
    SET NOCOUNT ON;

  
    IF EXISTS (
        SELECT 1
        FROM Proveedores
        WHERE UPPER(LTRIM(RTRIM(Nombre))) =
              UPPER(LTRIM(RTRIM(@Nombre)))
    )
    BEGIN
        SELECT -1 AS Resultado; 
        RETURN;
    END

    
    IF EXISTS (
        SELECT 1
        FROM Proveedores
        WHERE UPPER(LTRIM(RTRIM(Correo))) =
              UPPER(LTRIM(RTRIM(@Correo)))
    )
    BEGIN
        SELECT -2 AS Resultado; 
        RETURN;
    END

   
    IF EXISTS (
        SELECT 1
        FROM Proveedores
        WHERE Telefono = @Telefono
    )
    BEGIN
        SELECT -3 AS Resultado; 
        RETURN;
    END


    INSERT INTO Proveedores
    (
        Nombre,
        Telefono,
        Correo,
        Direccion,
        Estado
    )
    VALUES
    (
        @Nombre,
        @Telefono,
        @Correo,
        @Direccion,
        @Estado
    );

    SELECT 1 AS Resultado;
END


DROP PROCEDURE sp_ConsultarProveedor

CREATE PROCEDURE sp_ConsultarProveedor
AS
BEGIN
    SELECT
        P.Consecutivo,
        P.Nombre,
        P.Telefono,
        P.Correo,
        P.Direccion,
        E.Estado AS Estado
    FROM Proveedores P
    INNER JOIN Estado E ON P.Estado = E.Consecutivo
END




drop procedure  sp_EditarProveedor
CREATE PROCEDURE sp_EditarProveedor
    @Consecutivo INT,
    @Nombre VARCHAR(100),
    @Telefono VARCHAR(20),
    @Correo VARCHAR(100),
    @Direccion VARCHAR(MAX)
    
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM Proveedores
        WHERE UPPER(LTRIM(RTRIM(Nombre))) =
              UPPER(LTRIM(RTRIM(@Nombre)))
        AND Consecutivo <> @Consecutivo
    )
    BEGIN
        SELECT -1 AS Resultado;
        RETURN;
    END


    IF EXISTS (
        SELECT 1
        FROM Proveedores
        WHERE UPPER(LTRIM(RTRIM(Correo))) =
              UPPER(LTRIM(RTRIM(@Correo)))
        AND Consecutivo <> @Consecutivo
    )
    BEGIN
        SELECT -2 AS Resultado;
        RETURN;
    END

 
    IF EXISTS (
        SELECT 1
        FROM Proveedores
        WHERE Telefono = @Telefono
        AND Consecutivo <> @Consecutivo
    )
    BEGIN
        SELECT -3 AS Resultado;
        RETURN;
    END

  
      UPDATE Proveedores
    SET
        Nombre = @Nombre,
        Telefono = @Telefono,
        Correo = @Correo,
        Direccion = @Direccion
   
    WHERE Consecutivo = @Consecutivo;

    SELECT 1 AS Resultado;
END

drop procedure sp_ObtenerProveedores

/*INVENTARIO*/
DROP PROCEDURE sp_RegistroInventario
CREATE PROCEDURE sp_RegistroInventario
@Nombre VARCHAR(120),
@Descripcion VARCHAR(200),
@PrecioCompra DECIMAL(10,2),
@PrecioVenta DECIMAL(10,2),
@Stock INT,
@StockMinimo INT,
@Proveedor INT
AS
BEGIN
 SET NOCOUNT ON;

  IF EXISTS
    (
        SELECT 1
        FROM Productos
        WHERE UPPER(LTRIM(RTRIM(Nombre))) =
              UPPER(LTRIM(RTRIM(@Nombre)))
    )
    BEGIN
        SELECT -1 AS Resultado;
        RETURN;
    END;

 DECLARE @NuevoCodigo VARCHAR(50);

    SELECT @NuevoCodigo =
        'ART' + RIGHT('000' + CAST(
            ISNULL(MAX(CAST(REPLACE(IdArticulo, 'ART', '') AS INT)), 0) + 1
        AS VARCHAR), 3)
    FROM Productos;

INSERT INTO Productos
(
Nombre,
IdArticulo,
Descripcion,
PrecioCompra,
PrecioVenta,
Stock,
StockMinimo,
Proveedor
)
VALUES
(
@Nombre,
@NuevoCodigo,
@Descripcion,
@PrecioCompra,
@PrecioVenta,
@Stock,
@StockMinimo,
@Proveedor
);
SELECT 1 AS RESULTADO;
END
GO


SELECT * FROM Productos

DELETE FROM Productos WHERE CONSECUTIVO = 2008

DROP PROCEDURE sp_ConsultaInventario
CREATE PROCEDURE sp_ConsultaInventario
AS
BEGIN

SELECT
p.Consecutivo,
p.Nombre,
p.IdArticulo,
p.Descripcion,
p.PrecioCompra,
p.PrecioVenta,
p.Stock,
p.StockMinimo,
pr.Nombre AS Proveedor
FROM Productos p
INNER JOIN Proveedores pr
ON p.Proveedor = pr.Consecutivo

END





CREATE PROCEDURE sp_ObtenerProveedorId
@Consecutivo INT
AS
BEGIN

SELECT 
        P.Consecutivo,
        P.Nombre,
        P.Telefono,
        P.Correo,
        P.Direccion
    FROM Proveedores P
    WHERE P.Consecutivo = @Consecutivo
END

CREATE PROCEDURE sp_EditarInventario
    @Consecutivo INT,
    @Nombre VARCHAR(120),
    @IdArticulo VARCHAR(20),
    @Descripcion VARCHAR(50),
    @PrecioCompra INT,
    @PrecioVenta INT, 
    @Stock INT,
    @StockMinimo INT, 
    @Proveedor INT
AS
BEGIN

UPDATE Productos
SET 
    Nombre = @Nombre,
    IdArticulo = @IdArticulo,
    Descripcion = @Descripcion,
    PrecioCompra = @PrecioCompra,
    PrecioVenta  = @PrecioVenta ,
    Stock  = @Stock,
    StockMinimo = @StockMinimo,
    Proveedor = @Proveedor

WHERE Consecutivo = @Consecutivo

END

CREATE PROCEDURE sp_ObtenerInventarioId
@Consecutivo INT
AS
BEGIN

SELECT
Consecutivo,
Nombre,
IdArticulo,
Descripcion,
PrecioCompra,
PrecioVenta,
Stock,
StockMinimo,
Proveedor
FROM Productos
WHERE Consecutivo = @Consecutivo

END

CREATE PROCEDURE sp_ObtenerSiguienteCodigoArticulo
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        'ART' +
        RIGHT(
            '000' + CAST(
                ISNULL(MAX(CAST(REPLACE(IdArticulo,'ART','') AS INT)),0) + 1
            AS VARCHAR),
        3) AS Codigo
    FROM Productos;
END
GO


EXEC sp_ObtenerSiguienteCodigoArticulo

/*CITA*/
drop procedure sp_RegistroCita
CREATE PROCEDURE sp_RegistroCita
@NombreCliente VARCHAR(100),
@Cedula VARCHAR(100),
@FechaCita DATE,
@HoraCita TIME,
@Telefono INT,
@Email VARCHAR(100),
@Servicio VARCHAR(200),
@Estado INT,
@CreadaPor INT
AS
BEGIN

INSERT INTO Citas
(
NombreCliente,
Cedula,
FechaCita,
HoraCita,
Telefono,
Email,
Servicio,
Estado,
CreadaPor
)

VALUES
(
@NombreCliente,
@Cedula,
@FechaCita,
@HoraCita,
@Telefono,
@Email,
@Servicio,
@Estado,
@CreadaPor
)

END
drop procedure sp_ConsultaCita

CREATE PROCEDURE sp_ConsultaCita
AS
BEGIN
    SELECT
        c.Consecutivo,
        c.NombreCliente,
        c.Cedula,
        c.FechaCita,
        c.HoraCita,
        c.Telefono,
        c.Email,
        c.Servicio,
        e.Estado,
        u.NombreCompleto AS CreadaPor,
        um.NombreCompleto AS ModificadoPor,
        c.FechaModificacion
    FROM Citas c
    INNER JOIN Usuarios u ON c.CreadaPor = u.Consecutivo
    LEFT JOIN Usuarios um ON c.ModificadoPor = um.Consecutivo
    INNER JOIN Estado e ON c.Estado = e.Consecutivo
    WHERE c.Estado NOT IN (5, 6)
END
GO

drop procedure sp_ObtenerCitaId
CREATE PROCEDURE sp_ObtenerCitaId
@Consecutivo INT
AS
BEGIN

SELECT
Consecutivo,
NombreCliente AS NombreCliente,
Cedula,
FechaCita,
HoraCita,
Telefono,
Email,
Servicio,
Estado,
CreadaPor

FROM Citas
WHERE Consecutivo = @Consecutivo

END
use TallerLaUnion
drop procedure sp_EditarCita

CREATE PROCEDURE sp_EditarCita
    @Consecutivo INT,
    @NombreCliente VARCHAR(100),
    @Cedula VARCHAR(100),
    @FechaCita DATE,
    @HoraCita TIME,
    @Telefono INT,
    @Email VARCHAR(100),
    @Servicio VARCHAR(200),
    @Estado INT,
    @CreadaPor INT,
    @ModificadoPor INT
AS
BEGIN
    UPDATE Citas
    SET
        NombreCliente = @NombreCliente,
        Cedula = @Cedula,
        FechaCita = @FechaCita,
        HoraCita = @HoraCita,
        Telefono = @Telefono,
        Email = @Email,
        Servicio = @Servicio,
        Estado = @Estado,
        CreadaPor = @CreadaPor,
        ModificadoPor = @ModificadoPor,
        FechaModificacion = GETDATE()
    WHERE Consecutivo = @Consecutivo
END
GO




CREATE PROCEDURE sp_ObtenerUsuarios
AS
BEGIN

SELECT
Consecutivo,
NombreCompleto

FROM Usuarios

END
CREATE PROCEDURE sp_CancelarCita
    @Consecutivo INT,
    @Estado INT
AS
BEGIN
    UPDATE Citas
    SET Estado = @Estado
    WHERE Consecutivo = @Consecutivo
END
GO

-- TIPOS
INSERT INTO TipoEstado (Nombre) VALUES 
('Usuario'),
('Cita'),
('Vehiculo'),
('Financiero');

-- ESTADOS

delete from estado 
INSERT INTO Estado (Estado, IdTipoEstado) VALUES
('Activo',1),('Inactivo',1),
('Pendiente',2),('Confirmada',2),('Cancelada',2),('Finalizada',2),
('Ingresado',3),('Revisado',3),('Reparando',3),
('Pendiente',4),('Pagado',4);

SELECT Consecutivo, Estado
FROM Estado
WHERE IdTipoEstado = 3
ORDER BY
    CASE Consecutivo
        WHEN 7 THEN 1
        WHEN 9 THEN 2
        WHEN 8 THEN 3
    END;

use tallerLaUnion;
select * from Estado

INSERT INTO Roles(NombreRol, Descripcion) VALUES
('Encargado', 'Usuario responsable de supervisar operaciones'),
('Administrador', 'Usuario con control total del sistema'),
('Mecanico', 'Usuario encargado de realizar reparaciones y mantenimiento');


select * from Proveedores

select * from Roles
select * from Estado
select * from Usuarios
select * from Citas


  /*Reportes*/
  drop PROCEDURE sp_ReporteUsuarios
CREATE PROCEDURE sp_ReporteUsuarios
    @FechaDesde DATE = NULL,
    @FechaHasta DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        U.Consecutivo,
        U.NombreCompleto,
        U.Cedula,
        U.Correo,
        U.UsuarioLogin,
        R.NombreRol,
        E.Estado,
        U.FechaRegistro
    FROM Usuarios U
    INNER JOIN Roles R ON U.NombreRol = R.Consecutivo
    INNER JOIN Estado E ON U.Estado = E.Consecutivo
    WHERE
        (@FechaDesde IS NULL OR CAST(U.FechaRegistro AS DATE) >= @FechaDesde)
        AND (@FechaHasta IS NULL OR CAST(U.FechaRegistro AS DATE) <= @FechaHasta)
    ORDER BY U.FechaRegistro DESC;
END
GO

DROP PROCEDURE IF EXISTS sp_ReporteCitas
GO

CREATE PROCEDURE sp_ReporteCitas
    @FechaDesde DATE = NULL,
    @FechaHasta DATE = NULL,
    @Estado VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        C.Consecutivo,
        C.NombreCliente,
        C.Cedula,
        C.FechaCita,
        C.HoraCita,
        C.Servicio,
        E.Estado,
        U.NombreCompleto AS CreadaPor
    FROM Citas C
    INNER JOIN Usuarios U ON C.CreadaPor = U.Consecutivo
    INNER JOIN Estado E ON C.Estado = E.Consecutivo
    WHERE
        (@FechaDesde IS NULL OR C.FechaCita >= @FechaDesde)
        AND (@FechaHasta IS NULL OR C.FechaCita <= @FechaHasta)
        AND (
            @Estado IS NULL
            OR @Estado = ''
            OR E.Estado = @Estado
        )
    ORDER BY C.FechaCita DESC, C.HoraCita DESC;
END
GO

EXEC sp_ReporteCitas NULL, NULL, NULL
EXEC sp_ResumenCitas NULL, NULL

DROP PROCEDURE sp_ReporteIngresoVehiculos
GO
CREATE PROCEDURE sp_ReporteIngresoVehiculos
    @FechaDesde DATE = NULL,
    @FechaHasta DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        V.Consecutivo,
        V.Nombre_Cliente,
        V.Cedula,
        V.Placa,
        V.Marca,
        V.Modelo,
        V.Anio,
        V.Problema,
        V.Revision,
         V.FechaRegistro,
        E.Estado
     
    FROM Vehiculos V
    INNER JOIN Estado E 
        ON V.Estado = E.Consecutivo
    WHERE
        (@FechaDesde IS NULL OR V.FechaRegistro >= @FechaDesde)
        AND
        (@FechaHasta IS NULL OR V.FechaRegistro < DATEADD(DAY,1,@FechaHasta))
    ORDER BY V.Consecutivo DESC;

END
GO
EXEC sp_ReporteIngresoVehiculos;

CREATE PROCEDURE sp_ReporteIngresos
    @FechaDesde DATE = NULL,
    @FechaHasta DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        I.Consecutivo,
        I.Descripcion,
        I.Monto,
        I.Saldo_Pendiente,
        E.Estado,
        I.Fecha
    FROM Ingresos I
    INNER JOIN Estado E ON I.Estado = E.Consecutivo
    WHERE
        (@FechaDesde IS NULL OR CAST(I.Fecha AS DATE) >= @FechaDesde)
        AND (@FechaHasta IS NULL OR CAST(I.Fecha AS DATE) <= @FechaHasta)
    ORDER BY I.Fecha DESC;
END
GO

DROP PROCEDURE IF EXISTS sp_ReporteEgresos
GO

CREATE PROCEDURE sp_ReporteEgresos
    @FechaDesde DATE = NULL,
    @FechaHasta DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Egr.Consecutivo,
        Egr.Motivo,
        Egr.Monto,
        Egr.Cantidad,
        Egr.MetodoPago,
        U.NombreCompleto AS RegistradoPor,
        Egr.Fecha
    FROM Egresos Egr
    INNER JOIN Usuarios U ON Egr.RegistradoPor = U.Consecutivo
    WHERE
        (@FechaDesde IS NULL OR CAST(Egr.Fecha AS DATE) >= @FechaDesde)
        AND (@FechaHasta IS NULL OR CAST(Egr.Fecha AS DATE) <= @FechaHasta)
    ORDER BY Egr.Fecha DESC;
END
GO


DROP PROCEDURE  sp_ReporteInventario
GO 
CREATE PROCEDURE sp_ReporteInventario
 @FechaDesde DATE = NULL,
    @FechaHasta DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        P.Consecutivo,
        P.Nombre,
        P.IdArticulo,
        P.Descripcion,
        P.PrecioCompra,
        P.PrecioVenta,
        P.Stock,
        P.StockMinimo,
        P.FechaRegistro,
        PR.Nombre AS Proveedor
    FROM Productos P
    INNER JOIN Proveedores PR ON P.Proveedor = PR.Consecutivo
    WHERE
        (@FechaDesde IS NULL OR P.FechaRegistro >= @FechaDesde)
        AND
        (@FechaHasta IS NULL OR P.FechaRegistro < DATEADD(DAY,1,@FechaHasta))

   ORDER BY P.Nombre;
END
GO


DROP PROCEDURE IF EXISTS sp_ResumenCitas
GO

CREATE PROCEDURE sp_ResumenCitas
    @FechaDesde DATE = NULL,
    @FechaHasta DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        SUM(CASE WHEN E.Estado = 'Confirmada' THEN 1 ELSE 0 END) AS Confirmadas,
        SUM(CASE WHEN E.Estado = 'Finalizada' THEN 1 ELSE 0 END) AS Finalizadas,
        SUM(CASE WHEN E.Estado = 'Pendiente' THEN 1 ELSE 0 END) AS Pendientes,
        SUM(CASE WHEN E.Estado = 'Cancelada' THEN 1 ELSE 0 END) AS Canceladas
    FROM Citas C
    INNER JOIN Estado E ON C.Estado = E.Consecutivo
    WHERE
        (@FechaDesde IS NULL OR C.FechaCita >= @FechaDesde)
        AND (@FechaHasta IS NULL OR C.FechaCita <= @FechaHasta);
END
GO

IF OBJECT_ID('sp_ReporteProveedores', 'P') IS NOT NULL
    DROP PROCEDURE sp_ReporteProveedores;
GO

CREATE PROCEDURE sp_ReporteProveedores
@FechaDesde DATE = NULL,
    @FechaHasta DATE = NULL

AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Consecutivo,
        Nombre,
        Telefono,
        Correo,
        Direccion,
          FechaRegistro,
        CASE 
            WHEN Estado = 1 THEN 'Activo'
            ELSE 'Inactivo'
        END AS Estado
    FROM Proveedores
    WHERE
(@FechaDesde IS NULL
    OR FechaRegistro >= @FechaDesde)
AND
(@FechaHasta IS NULL
    OR FechaRegistro < DATEADD(DAY,1,@FechaHasta))
    ORDER BY Nombre;
END
GO





/*vehiculos*/

--registro vehiculo:
DROP PROCEDURE  sp_RegistroVehiculo
CREATE PROCEDURE sp_RegistroVehiculo
    @Nombre_Cliente VARCHAR(100),
    @Telefono INT,
    @Cedula VARCHAR(100),
    @Placa VARCHAR(20),
    @Marca VARCHAR(50),
    @Modelo VARCHAR(50),
    @Anio INT,
    @Problema VARCHAR(500),
    @Revision VARCHAR(500),
    @Estado INT,
    @Deuda DECIMAL(10,2),
    @Monto DECIMAL(10,2)
AS
BEGIN
    -- VALIDAR PLACA
    IF EXISTS (SELECT 1 FROM Vehiculos WHERE Placa = @Placa
    AND Estado IN (7,9)
    )
    BEGIN
        SELECT -1 AS Resultado
        RETURN
    END
    -- INSERTAR VEHICULO
    INSERT INTO Vehiculos
    (
        Nombre_Cliente,
        Telefono,
        Cedula,
        Placa,
        Marca,
        Modelo,
        Anio,
        Problema,
        Revision,
        Estado,
        Deuda,
        Monto
    )
    VALUES
    (
        @Nombre_Cliente,
        @Telefono,
        @Cedula,
        @Placa,
        @Marca,
        @Modelo,
        @Anio,
        @Problema,
        @Revision,
        @Estado,
         @Deuda,
        @Monto
    )
    SELECT 1 AS Resultado 

END


CREATE PROCEDURE sp_RegistroIngresoVehiculo
(
    @Descripcion VARCHAR(200),
    @Monto DECIMAL(10,2),
    @Saldo_Pendiente DECIMAL(10,2)
)
AS
BEGIN

    DECLARE @Estado INT;

    IF @Monto >= @Saldo_Pendiente
        SET @Estado = 11; -- Pagado
    ELSE
        SET @Estado = 10; -- Pendiente


    INSERT INTO Ingresos
    (
        Descripcion,
        Monto,
        Saldo_Pendiente,
        Fecha,
        Estado
    )
    VALUES
    (
        @Descripcion,
        @Monto,
        @Saldo_Pendiente,
        GETDATE(),
        @Estado
    );

END
GO

drop procedure sp_ConsultarVehiculos
-- obtener datos del vehiculo
CREATE  PROCEDURE sp_ConsultarVehiculos
AS
BEGIN
    SELECT 
        V.Consecutivo,
        V.Nombre_Cliente,
        V.Telefono,
        V.Cedula,
        V.Placa,
        V.Marca,
        V.Modelo,
        V.Anio,
        V.Problema,
        V.Revision,
        V.Monto,
        V.Deuda,
        E.Estado AS Estado
    FROM dbo.Vehiculos V
    INNER JOIN dbo.Estado E ON V.Estado = E.Consecutivo
    WHERE V.Estado <> 8;
END

select * from estado 
-- actualizar datos del vehiculo
drop PROCEDURE sp_EditarVehiculo

CREATE PROCEDURE sp_EditarVehiculo
 @Consecutivo INT,
    @Nombre_Cliente VARCHAR(100),
    @Telefono INT,
    @Cedula VARCHAR(100),
    @Placa VARCHAR(20),
    @Marca VARCHAR(50),
    @Modelo VARCHAR(50),
    @Anio INT,
    @Problema VARCHAR(500),
    @Revision VARCHAR(500),
    @Estado INT,
    @Deuda DECIMAL(10,2),
    @Monto DECIMAL(10,2)
AS
BEGIN

    DECLARE @EstadoIngreso INT;

    -- Determinar estado del ingreso
    IF @Monto >= @Deuda
        SET @EstadoIngreso = 11; -- Pagado
    ELSE
        SET @EstadoIngreso = 10; -- Pendiente


    -- Actualizar vehículo
    UPDATE Vehiculos
    SET 
        Nombre_Cliente = @Nombre_Cliente,
        Telefono = @Telefono,
        Cedula = @Cedula,
        Placa = @Placa,
        Marca = @Marca,
        Modelo = @Modelo,
        Anio = @Anio,
        Problema = @Problema,
        Revision = @Revision,
        Estado = @Estado,
        Deuda = @Deuda,
        Monto = @Monto
    WHERE Consecutivo = @Consecutivo;


    -- Actualizar ingreso relacionado por placa
    UPDATE Ingresos
    SET
        Monto = @Monto,
        Saldo_Pendiente = @Deuda,
        Estado = @EstadoIngreso
    WHERE Descripcion LIKE '%' + @Placa + '%';


    SELECT 1 AS Resultado;

END
GO

select * from estado

CREATE PROCEDURE [dbo].[sp_ObtenerVehiculoId]
    @Consecutivo INT
AS
BEGIN
    SELECT 
        V.Consecutivo,
        V.Nombre_Cliente,
        V.Telefono,
        V.Cedula,
        V.Placa,
        V.Marca,
        V.Modelo,
        V.Anio,
        V.Problema,
        V.Revision,
        V.Estado,
        E.Estado AS NombreEstado
    FROM Vehiculos V
    INNER JOIN Estado E ON V.Estado = E.Consecutivo
    WHERE V.Consecutivo = @Consecutivo
END

-- Registrar un ingreso
CREATE PROCEDURE sp_RegistroIngreso
    @Descripcion VARCHAR(200),
    @Monto DECIMAL(10,2),
    @Saldo_Pendiente DECIMAL(10,2),
    @Estado INT
AS
BEGIN
    -- INSERT
    INSERT INTO Ingresos
    (
        Descripcion,
        Monto,
        Saldo_Pendiente,
        Estado
    )
    VALUES
    (
        @Descripcion,
        @Monto,
        @Saldo_Pendiente,
        @Estado
    )
END

--Consultar Ingresos
DROP PROCEDURE sp_ConsultarIngreso
CREATE PROCEDURE sp_ConsultarIngreso
AS
BEGIN
    SELECT 
        I.Consecutivo,
        I.Descripcion,
        I.Monto,
        I.Saldo_Pendiente,
        I.Fecha,
        E.Estado AS Estado
    FROM Ingresos I
    INNER JOIN Estado E 
        ON I.Estado = E.Consecutivo
    WHERE NOT (
        I.Estado = 11
        AND
        (
            YEAR(I.Fecha) < YEAR(GETDATE())
            OR
            (
                YEAR(I.Fecha) = YEAR(GETDATE())
                AND MONTH(I.Fecha) < MONTH(GETDATE())
            )
        )
    );
END
GO

-- editar los ingresos
drop PROCEDURE sp_EditarIngreso
CREATE PROCEDURE sp_EditarIngreso
    @Consecutivo INT,
    @Descripcion VARCHAR(200),
    @Monto DECIMAL(10,2),
    @Saldo_Pendiente DECIMAL(10,2),
    @Estado INT
AS
BEGIN

    DECLARE @Placa VARCHAR(20);


    -- Extraer placa de la descripción
    SET @Placa = REPLACE(@Descripcion, 'Reparación vehículo ', '');


    -- Actualizar Ingreso
    UPDATE Ingresos
    SET 
        Descripcion = @Descripcion,
        Monto = @Monto,
        Saldo_Pendiente = @Saldo_Pendiente,
        Estado = @Estado
    WHERE Consecutivo = @Consecutivo;


    -- Actualizar Vehículo
    UPDATE Vehiculos
    SET
        Monto = @Monto,
        Deuda = @Saldo_Pendiente
    WHERE Placa = @Placa;


    SELECT 1 AS Resultado;

END
GO

CREATE PROCEDURE [dbo].[sp_ObtenerIngresoId]
    @Consecutivo INT
AS
BEGIN
    SELECT 
        I.Consecutivo,
        I.Descripcion,
        I.Monto,
        I.Saldo_Pendiente,
        I.Fecha,
        I.Estado,
        E.Estado AS NombreEstado
    FROM Ingresos I
    INNER JOIN Estado E ON I.Estado = E.Consecutivo
    WHERE I.Consecutivo = @Consecutivo
END

--- Registrar un nuevo Egreso
CREATE PROCEDURE sp_RegistroEgreso
    @Motivo VARCHAR(200),
    @Monto DECIMAL(10,2),
    @Cantidad INT,
    @RegistradoPor INT,
    @MetodoPago VARCHAR(50)
AS
BEGIN
    INSERT INTO Egresos
    (
        Motivo,
        Monto,
        Cantidad,
        RegistradoPor,
        MetodoPago
    )
    VALUES
    (
        @Motivo,
        @Monto,
        @Cantidad,
        @RegistradoPor,
        @MetodoPago
    )
    SELECT 1 AS Resultado
END

-- Consultar Egresos

drop PROCEDURE sp_ConsultarEgreso
CREATE PROCEDURE sp_ConsultarEgreso
AS
BEGIN
    SELECT 
        E.Consecutivo,
        E.Motivo,
        E.Monto,
        E.Cantidad,
        E.Fecha,
        E.MetodoPago,
        U.NombreCompleto AS RegistradoPor
    FROM Egresos E
    INNER JOIN Usuarios U 
        ON E.RegistradoPor = U.Consecutivo
    WHERE 
        MONTH(E.Fecha) = MONTH(GETDATE())
        AND YEAR(E.Fecha) = YEAR(GETDATE());

END
GO


-- Editar Egreso
CREATE PROCEDURE sp_EditarEgreso
    @Consecutivo INT,
    @Motivo VARCHAR(200),
    @Monto DECIMAL(10,2),
    @Cantidad INT,
    @RegistradoPor INT,
    @MetodoPago VARCHAR(50)
AS
BEGIN
    UPDATE Egresos
    SET 
        Motivo = @Motivo,
        Monto = @Monto,
        Cantidad = @Cantidad,
        RegistradoPor = @RegistradoPor,
        MetodoPago = @MetodoPago
    WHERE Consecutivo = @Consecutivo

    SELECT 1 AS Resultado

END

-- Id del egreso
CREATE PROCEDURE [dbo].[sp_ObtenerEgresoId]
    @Consecutivo INT
AS
BEGIN
    SELECT 
        E.Consecutivo,
        E.Motivo,
        E.Monto,
        E.Cantidad,
        E.Fecha,
        E.MetodoPago,
        E.RegistradoPor,
        U.NombreCompleto AS NombreUsuario
    FROM Egresos E
    INNER JOIN Usuarios U ON E.RegistradoPor = U.Consecutivo
    WHERE E.Consecutivo = @Consecutivo
END
drop procedure sp_ObtenerUsuarioConta
CREATE PROCEDURE sp_ObtenerUsuarioConta
AS
BEGIN

SELECT

Consecutivo,
NombreCompleto
FROM
Usuarios
END
use TallerLaUnion
/*INICIO SESION*/
drop procedure sp_IniciarSesion
CREATE PROCEDURE sp_IniciarSesion
  @CorreoElectronico VARCHAR(100),
    @Contrasenna VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.Consecutivo,
        u.NombreCompleto,
        u.Cedula,
        u.Correo,
        u.UsuarioLogin,
        u.Contrasenna,
        r.NombreRol,
        e.Estado,
        u.FechaRegistro
    FROM Usuarios u
    INNER JOIN Roles r ON u.NombreRol = r.Consecutivo
    INNER JOIN Estado e ON u.Estado = e.Consecutivo
    WHERE u.Correo = @CorreoElectronico
      AND u.Contrasenna = @Contrasenna
      AND e.Estado = 'Activo'
   
END
GO
/*Recuperar Acceso*/


USE tallerLaUnion
drop PROCEDURE sp_RecuperarContrasenna
CREATE PROCEDURE sp_RecuperarContrasenna
    @Correo VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        U.Consecutivo,
        U.NombreCompleto,
        U.Correo,
        U.UsuarioLogin,
        E.Estado
    FROM Usuarios U
    INNER JOIN Estado E ON U.Estado = E.Consecutivo
    WHERE U.Correo = @Correo;
END
GO
drop procedure sp_ActualizarContrasenna

CREATE PROCEDURE sp_ActualizarContrasenna
    @Consecutivo INT,
    @Contrasenna VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Usuarios
    SET Contrasenna = @Contrasenna
    WHERE Consecutivo = @Consecutivo
      AND Estado = 1;

    SELECT @@ROWCOUNT AS FilasActualizadas;
END
GO
drop procedure  sp_RegistroHorario

CREATE PROCEDURE sp_RegistroHorario
(
    @FechaInicio DATE,
    @FechaFin DATE,
    @Horas VARCHAR(MAX),
    @Estado INT
)
AS
BEGIN

    DECLARE @FechaActual DATE = @FechaInicio;

    WHILE @FechaActual <= @FechaFin
    BEGIN

       
        DELETE FROM HorarioTaller
        WHERE Fecha = @FechaActual;

        -- Abierto
        IF @Estado = 12
        BEGIN

            INSERT INTO HorarioTaller
            (
                Fecha,
                HoraInicio,
                HoraFin,
                Estado
            )
            SELECT
                @FechaActual,
                CAST(value AS TIME),
                CAST(DATEADD(HOUR, 1, CAST(value AS DATETIME)) AS TIME),
                @Estado
            FROM STRING_SPLIT(@Horas, ',');

        END
        ELSE
BEGIN
    INSERT INTO HorarioTaller
    (
        Fecha,
        HoraInicio,
        HoraFin,
        Estado
    )
    VALUES
    (
        @FechaActual,
        '00:00',
        '23:59:59',
        @Estado
    );
END

        SET @FechaActual = DATEADD(DAY, 1, @FechaActual);

    END

    SELECT 1 AS Resultado;

END

drop procedure sp_ObtenerEstadosHorario
CREATE PROCEDURE  sp_ObtenerEstadosHorario
AS
BEGIN
    SELECT 
        Consecutivo,
        Estado
    FROM EstadoHorario
END
drop procedure sp_ConsultaHorario
CREATE PROCEDURE sp_ConsultaHorario
AS
BEGIN
   SELECT
        H.Consecutivo,
        H.Fecha,
        H.HoraInicio,
        H.HoraFin,
        E.Estado
   FROM HorarioTaller H
   INNER JOIN Estado E
        ON H.Estado = E.Consecutivo
END
DROP PROCEDURE  sp_ConsultarVehiculoPorPlaca
CREATE PROCEDURE sp_ConsultarVehiculoPorPlaca
    @Placa VARCHAR(20)
AS
BEGIN
    SELECT 
        v.Placa,
        v.Marca,
        v.Modelo,
        v.Anio,
        e.Estado AS Estado,
        v.Problema
    FROM Vehiculos v
    INNER JOIN Estado e ON v.Estado = e.Consecutivo
    WHERE v.Placa = @Placa
END

DROP PROCEDURE sp_ConsultarHorarioPorFecha
CREATE PROCEDURE sp_ConsultarHorarioPorFecha
(
    @Fecha DATE
)
AS
BEGIN

    SELECT
        H.Consecutivo,
        H.Fecha,
        H.HoraInicio,
        H.HoraFin,
        E.Estado
    FROM HorarioTaller H
    INNER JOIN Estado E
        ON H.Estado = E.Consecutivo
    WHERE H.Fecha = @Fecha

END

use TallerLaUnion
select * from roles
select * from TipoEstado
select * from estado;
select * from usuarios;
select * from Citas
select * from Estado
select * from Vehiculos;
select * from   Egresos
select * from   Ingresos
select * from Proveedores
select * from ingresos
select * from HorarioTaller SELECT * FROM HorarioTaller
WHERE Fecha = '2026-06-01'

DELETE FROM Estado
 where Consecutivo = 1005
DBCC CHECKIDENT ('HorarioTaller', RESEED, 1);


insert into TipoEstado (Nombre)
VALUES ('Horario')

insert into Estado (Estado, IdTipoEstado)
values
('Abierto', 5),
('Cerrado', 5),
('Vacaciones', 5);


update roles set NombreRol = 'Mécanico' where Consecutivo = 3; 
drop procedure sp_CambiarEstadoUsuario
CREATE PROCEDURE sp_CambiarEstadoUsuario
    @Consecutivo INT
AS
BEGIN

    UPDATE Usuarios
    SET Estado =
        CASE
            WHEN Estado = 1 THEN 2
            WHEN Estado = 2 THEN 1
        END
    WHERE Consecutivo = @Consecutivo

END
GO
drop procedure  sp_CambiarEstadoProveedor

CREATE PROCEDURE sp_CambiarEstadoProveedor
    @Consecutivo INT
AS
BEGIN
    UPDATE Proveedores
    SET Estado =
        CASE
            WHEN Estado = 1 THEN 2
            WHEN Estado = 2 THEN 1
        END
    WHERE Consecutivo = @Consecutivo
END


update Usuarios set estado = 1 where Consecutivo = 2;

exec sp_ConsultarProveedor

delete from HorarioTaller

sp_help HorarioTaller
SELECT * FROM Productos
DELETE FROM Productos WHERE CONSECUTIVO =1004

EXEC sp_ReporteIngresoVehiculos
select * from Productos


UPDATE Productos
SET FechaRegistro = '2026-06-05'
WHERE Consecutivo = 1;

UPDATE Productos
SET FechaRegistro = '2026-06-15'
WHERE Consecutivo = 2;

update Usuarios set Estado =1 where Consecutivo = 1;
select * from Usuarios

 select * from Vehiculos
 select * from Ingresos
 delete from ingresos where consecutivo = 10
 DBCC CHECKIDENT ('ingresos', RESEED, 3);

 select * from Roles