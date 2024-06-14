CREATE PROCEDURE `registrar_punto_historial`(
	IN p_punto_id INT,
    IN p_hubo_consumo BOOLEAN,
    IN p_medida_inicial FLOAT,
    IN p_medida FLOAT,
    IN p_visita_id INT,
    IN p_usuario_id INT,
    IN p_recambio BOOLEAN,
    IN p_observaciones TEXT,
    IN p_lat TEXT,
    IN p_long TEXT
)
BEGIN
	DECLARE HOY DATE DEFAULT CURDATE();
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
	END;
    
    SET time_zone = '-5:00';
    START TRANSACTION;
		
        -- PRIMERO INVALIDA CUALQUIER MEDIDA DADA EN EL MISMO DIA
        UPDATE punto_historial
        SET activo = 0
        WHERE punto_id = p_punto_id AND DATE(fechahora) = HOY;
        
        -- PROCEDE A REGISTRAR EL CONSUMO
        INSERT INTO punto_historial(punto_id, hubo_consumo, medida_inicial, medida, fechahora, visita_id, usuario_id, recambio,
        observaciones, lat, `long`)
        VALUES(p_punto_id, p_hubo_consumo, p_medida_inicial, p_medida, CURRENT_TIMESTAMP(), 
        p_visita_id, p_usuario_id, p_recambio, p_observaciones, p_lat, p_long);
        
		SELECT 
			'1' AS 'resultado', 
            'HISTORIAL DE CONSUMO REGISTRADO CORRECTAMENTE' AS 'mensaje',
            codigo_unico as 'CODIGO_UNICO'
        FROM punto_historial 
        WHERE id = LAST_INSERT_ID();
        
    COMMIT;
END