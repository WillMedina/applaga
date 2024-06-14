CREATE PROCEDURE `obtener_punto_historial`(
	IN p_punto_id int
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
    
    IF(SELECT EXISTS (SELECT id FROM punto WHERE id = p_punto_id AND activo = 1)) THEN
		IF (SELECT EXISTS(SELECT id FROM punto_historial WHERE punto_id = p_punto_id AND activo = 1)) THEN
			SELECT '1' AS 'resultado', 'ok' as 'mensaje',
				id as 'PUNTOHISTORIAL_ID',
                punto_id as 'PUNTOCONTROL_ID',
                medida_inicial as 'MEDIDA_INICIAL',
                medida as 'MEDIDA',
                fechahora as 'FECHAHORA',
                visita_id as 'VISITA_ID',
                usuario_id as 'USUARIO_ID'
			FROM punto_historial
            WHERE punto_id = p_punto_id
            AND activo = 1;
        ELSE
			SELECT '0' AS 'resultado','NO SE ENCONTRO NINGÚN CONSUMO PARA ESTE PUNTO DE CONTROL' AS 'mensaje', 
            p_punto_id as 'PUNTOCONTROL_ID';
        END IF;
    ELSE
		SELECT '0' AS 'resultado','NO SE ENCONTRO PUNTO DE CONTROL' AS 'mensaje', p_punto_id as 'PUNTOCONTROL_ID';
    END IF;
END