CREATE PROCEDURE `registrar_punto_insectos_historial`(
	IN p_punto_id INT,
    IN p_visita_id INT,
    IN p_usuario_id INT,
    IN p_deterioro ENUM('PRESENTA', 'NO PRESENTA'),
    IN p_recambio BOOLEAN,
    IN p_lepidopteros INT,
    IN p_microlepidopteros INT,
    IN p_hemipteros INT,
    IN p_coleopteros INT,
    IN p_moscas INT,
    IN p_mosquitos INT,
    IN p_otros INT,
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
        UPDATE punto_historial_insectos
        SET activo = 0
        WHERE punto_id = p_punto_id AND DATE(fechahora) = HOY;
        
        -- PROCEDE A REGISTRAR EL CONSUMO
        INSERT INTO punto_historial_insectos(punto_id, fechahora, deterioro, recambio, 
        lepidopteros, microlepidopteros, hemipteros, coleopteros, moscas, mosquitos, otros, visita_id, observaciones, lat, `long`)
        VALUES(p_punto_id, CURRENT_TIMESTAMP(), p_deterioro, p_recambio,
        p_lepidopteros, p_microlepidopteros, p_hemipteros, p_coleopteros, p_moscas, p_mosquitos, p_otros, p_visita_id, p_observaciones, p_lat, p_long);
        
		SELECT 
			'1' AS 'resultado', 
            'HISTORIAL DE CONSUMO REGISTRADO CORRECTAMENTE' AS 'mensaje',
            codigo_unico as 'CODIGO_UNICO'
        FROM punto_historial_insectos
        WHERE id = LAST_INSERT_ID();
        
    COMMIT;
END