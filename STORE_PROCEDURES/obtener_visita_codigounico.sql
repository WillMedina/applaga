CREATE PROCEDURE `obtener_visita_codigounico`(
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
    
    IF(SELECT EXISTS(SELECT id FROM visita WHERE codigo_unico = p_codigo_unico and activo = 1)) THEN
		SELECT '1' as 'resultado',
			'ok' as 'mensaje',
			id as 'VISITA_ID'
            FROM visita
            WHERE codigo_unico = p_codigo_unico;
    ELSE
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRO VISITA REFERIDA' AS 'mensaje', p_codigo_unico as 'CODIGO_UNICO';
    END IF;
END