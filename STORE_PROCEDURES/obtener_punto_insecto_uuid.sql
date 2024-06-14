CREATE PROCEDURE `obtener_punto_insecto_uuid`(
	IN p_codigo_unico VARCHAR(36)
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
    
    IF (SELECT EXISTS(SELECT id FROM punto_insectos WHERE codigo_unico = p_codigo_unico and activo = 1)) THEN
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
			p.id as 'PUNTOCONTROL_ID',
            p.codigo_unico as 'CODIGO_UNICO'
		FROM punto_insectos p 
        WHERE p.codigo_unico = p_codigo_unico
        AND p.activo = 1;
    ELSE
		SELECT '0' AS 'resultado', 'NO SE ENCONTRARON PUNTOS CON ESE CODIGO UNICO' AS 'mensaje', p_codigo_unico as 'CODIGO_UNICO';
    END IF;
END