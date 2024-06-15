CREATE PROCEDURE `admin_cerrar_sesiones`()
BEGIN
	SET time_zone = '-5:00';
	UPDATE sesion SET f_fin = CURRENT_TIMESTAMP(), activo = 0
    WHERE activo = 1;
    
    SELECT '1' AS 'resultado', CONCAT(ROW_COUNT(), ' conexiones fueron cerrardas correctamente') as 'mensaje';
END