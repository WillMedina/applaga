CREATE PROCEDURE `obtener_visita_productos`(
	IN p_visitaid INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		-- SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
        SELECT '0' as 'resultado', CONCAT(@sqlstate,' ', @text, ' - ', @errno) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
     IF (SELECT EXISTS(SELECT id FROM visita_producto WHERE visita_id = p_visitaid and activo = 1)) THEN
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
			vp.visita_id as 'VISITA_ID',
            vp.producto_id as 'PRODUCTO_ID',
            vp.cantidad as 'CANTIDAD',
            vp.observaciones as 'OBSERVACIONES',
            p.nombrecomercial as 'NOMBRECOMERCIAL',
            p.nombre as 'NOMBRE',
            p.fichatecnica as 'FICHATECNICA',
            p.ingredienteactivo as 'INGREDIENTEACTIVO',
            p.descripcion as 'DESCRIPCION'
            FROM visita_producto vp
            LEFT JOIN producto p ON (vp.producto_id = p.id)
            WHERE vp.visita_id = p_visitaid
            AND vp.activo = 1;
    ELSE
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRARON PRODUCTOS EN EL SERVICIO' AS 'mensaje';
    END IF;
    
END