CREATE PROCEDURE `buscar_visita_constancia`(
	IN numero_constancia VARCHAR(45)
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
    
    IF (SELECT EXISTS(SELECT id FROM visita 
    -- WHERE MATCH(n_constancia) AGAINST (CONCAT('*', numero_constancia, '*') IN BOOLEAN MODE))) THEN
    WHERE n_constancia LIKE CONCAT('%', numero_constancia, '%'))) THEN
		SELECT '1' as 'resultado', 'ok' as 'mensaje',
				v.id as 'VISITA_ID',
                v.codigo_unico as 'CODIGO_UNICO',
				v.local_id as 'LOCAL_ID',
                l.cliente_id as 'CLIENTE_ID',
                l.nombreclave as 'LOCAL_NOMBRECLAVE',
                l.direccion as 'DIRECCION',
                l.frecuencia_servicio as 'FRECUENCIA_SERVICIO',
                l.telefono as 'TELEFONO',
                l.email as 'EMAIL',
                c.nombreclave as 'CLIENTE_NOMBRECLAVE',
                c.razonsocial as 'CLIENTE_RAZONSOCIAL',
                c.ruc as 'CLIENTE_RUC',
                v.responsable_local as 'RESPONSABLE_LOCAL',
                v.cargo_responsable_local as 'CARGO_RESPONSABLE_LOCAL',
                v.n_constancia as 'N_CONSTANCIA',
                v.inicio as 'INICIO',
                v.fin as 'FIN',
                v.n_certificado as 'N_CERTIFICADO',
                v.vencimiento_certificado as 'V_CERTIFICADO',
                v.observaciones_recomendaciones as 'OBSERVACIONES_Y_RECOMENDACIONES',
                v.observaciones_cliente as 'OBSERVACIONES_CLIENTE',
                v.condiciones_internas as 'CONDICIONES_INTERNAS',
                v.condiciones_externas as 'CONDICIONES_EXTERNAS',
                v.visto_bueno as 'VISTO_BUENO'
		FROM visita v
		LEFT JOIN cliente_local l ON (v.local_id = l.id)
		LEFT JOIN cliente c ON (c.id = l.cliente_id)
        WHERE 
			-- MATCH(n_constancia) AGAINST (CONCAT('*', numero_constancia, '*') IN BOOLEAN MODE)
            v.n_constancia LIKE CONCAT('%', numero_constancia, '%')
            AND v.activo = 1
        ORDER BY n_constancia ASC;
    ELSE
		SELECT '0' AS 'resultado', 
        'NO SE ENCONTRO NINGUNA VISITA CON UN NUMERO DE CONSTANCIA PARECIDO O COINCIDENTE' AS 'mensaje', 
        numero_constancia as 'QUERY_N_CONSTANCIA';
    END IF;
END