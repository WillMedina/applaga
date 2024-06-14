CREATE PROCEDURE `buscar_documento`(
	IN p_nconstancia varchar(45),
    IN p_codigounico varchar(36)
)
BEGIN
	DECLARE P_VISITA_ID INT;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		-- SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
        SELECT '0' as 'resultado', CONCAT(@sqlstate,' ', @text, ' - ', @errno) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    /*SET P_VISITA_ID = (SELECT id 
				FROM visita 
                WHERE (n_constancia = p_nconstancia OR codigo_unico = p_codigounico));*/
	/** --- consulta que devuelve mas de una fila ---- 
    SET P_VISITA_ID = (SELECT id 
				FROM visita 
                WHERE (MATCH(n_constancia) AGAINST(CONCAT('*',p_nconstancia,'*') IN BOOLEAN MODE) OR codigo_unico = p_codigounico)); */
    SET P_VISITA_ID = (SELECT id 
				FROM visita 
                WHERE (MATCH(n_constancia) AGAINST(p_nconstancia IN BOOLEAN MODE) OR codigo_unico = p_codigounico));
    
    IF P_VISITA_ID IS NOT NULL THEN
		IF (SELECT EXISTS(SELECT id FROM visita_documento WHERE visita_id = P_VISITA_ID)) THEN
			SELECT '1' AS 'resultado', 'ok' as 'mensaje',
			id as 'VISITA_DOCUMENTO_ID',
			codigo_unico as 'CODIGO_UNICO_DOCUMENTO',
			visita_id as 'VISITA_ID',
			reemplaza_a as 'REEMPLAZA_A',
			extension as 'EXTENSION',
			creado as 'FECHA_CREACION',
			nombre as 'NOMBRE',
			autor as 'AUTOR',
			descripcion as 'DESCRIPCION',
			publicado as 'PUBLICADO_CLIENTE',
			ruta as 'RUTA',
			recibido as 'RECIBIDO_CLIENTE'
			FROM visita_documento
			WHERE visita_id = P_VISITA_ID and activo = 1;
        ELSE 
			SELECT '0' as 'resultado', 
			'EL SERVICIO NO TIENE NINGÚN DOCUMENTO ANEXADO O PARA PUBLICACIÓN AL CLIENTE'
			as 'mensaje', p_nconstancia as 'NUMERO_CONSTANCIA', p_codigounico as 'CODIGO_UNICO';
        END IF;
    ELSE
		SELECT '0' as 'resultado', 
        'NO SE ENCONTRÓ NINGÚN SERVICIO CON EL NÚMERO DE CONSTANCIA O CÓDIGO ÚNICOS INGRESADO'
        as 'mensaje', p_nconstancia as 'NUMERO_CONSTANCIA', p_codigounico as 'CODIGO_UNICO';
    END IF;
    
END