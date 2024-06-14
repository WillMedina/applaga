CREATE PROCEDURE `registrar_visita`(
	IN p_localid INT,
    IN p_responsable_local TEXT,
    IN p_cargo_responsable_local TEXT,
    IN p_n_constancia VARCHAR(45),
    IN p_inicio DATETIME,
    IN p_fin DATETIME,
    IN p_n_certificado VARCHAR(45),
    IN p_vencimiento_certificado DATE,
    IN p_observaciones_recomendaciones TEXT,
    IN p_observaciones_cliente TEXT,
    IN p_condiciones_internas ENUM('BUENA', 'REGULAR','MALA'),
    IN p_condiciones_externas ENUM('BUENA', 'REGULAR','MALA'),
    IN p_visto_bueno tinyint(4)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    START TRANSACTION;
		INSERT INTO visita(
			local_id, responsable_local, cargo_responsable_local, n_constancia, inicio, fin, n_certificado,
            vencimiento_certificado, observaciones_recomendaciones, observaciones_cliente, condiciones_internas,
            condiciones_externas, visto_bueno
		)
        
        VALUES(
			p_localid, p_responsable_local, p_cargo_responsable_local, p_n_constancia, p_inicio, p_fin, p_n_certificado,
            p_vencimiento_certificado, p_observaciones_recomendaciones, p_observaciones_cliente, p_condiciones_internas,
            p_condiciones_externas, p_visto_bueno
        );
        
        SELECT '1' AS 'resultado', 'ok' as 'mensaje',
        LAST_INSERT_ID() as 'VISITA_ID', 
        CURRENT_TIMESTAMP() AS 'REGISTRADO_EN',
        codigo_unico as 'CODIGO_UNICO'
        FROM visita
        WHERE id = LAST_INSERT_ID();
    COMMIT;
END