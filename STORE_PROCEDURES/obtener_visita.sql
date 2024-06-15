CREATE PROCEDURE `obtener_visita`(
	IN p_id INT
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
    
    IF(SELECT EXISTS(SELECT id FROM visita WHERE id = p_id)) THEN
		-- analizar mas a fondo los casos inactivos de cada tabla
		SELECT '1' as 'resultado',
			'ok' as 'mensaje',
			v.id as 'VISITA_ID',
            v.codigo_unico as 'CODIGO_UNICO',
            v.local_id as 'LOCAL_ID',
            v.responsable_local as 'RESPONSABLE_EN_VISITA',
            v.cargo_responsable_local as 'CARGO_DE_RESPONSABLE_EN_VISITA',
            v.n_constancia as 'NUMERO_CONSTANCIA',
            v.n_certificado as 'NUMERO_CERTIFICADO',
            v.vencimiento_certificado as 'VENCIMIENTO_CERTIFICADO',
            v.observaciones_recomendaciones as 'OBSERVACIONES_Y_RECOMENDACIONES',
            v.observaciones_cliente as 'OBSERVACIONES_CLIENTE',
            v.condiciones_internas as 'CONDICIONES_INTERNAS',
            v.condiciones_externas as 'CONDICIONES_EXTERNAS',
            v.visto_bueno as 'VISTOBUENO_CLIENTE',
            l.nombreclave as 'LOCAL_NOMBRECLAVE',
            l.direccion as 'DIRECCION',
            c.nombreclave as 'CLIENTE_NOMBRECLAVE',
            c.razonsocial as 'CLIENTE_RAZONSOCIAL',
            c.ruc as 'CLIENTE_RUC',
            v.inicio as 'INICIO',
            v.fin as 'FIN'
            FROM visita v
            LEFT JOIN cliente_local l ON (v.local_id = l.id)
            LEFT JOIN cliente c ON (l.cliente_id = c.id)
            WHERE v.id = p_id;
    ELSE
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRO VISITA REFERIDA' AS 'mensaje';
    END IF;
 END