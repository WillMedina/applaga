CREATE PROCEDURE `registrar_local`(
	IN pcliente_id INT,
    IN pnombreclave VARCHAR(200),
    IN pdireccion VARCHAR(200),
    IN pfrecuencia_servicio enum('SEMANAL','MENSUAL','QUINCENAL','TRIMESTRAL','SEMESTRAL'),
    IN ptelefono VARCHAR(10),
    IN pemail VARCHAR(250)
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
		INSERT INTO cliente_local(cliente_id, nombreclave, direccion, frecuencia_servicio, telefono, email) 
        VALUES(pcliente_id, pnombreclave, pdireccion, pfrecuencia_servicio, ptelefono, pemail);
        
        SELECT '1' AS 'resultado',
        CONCAT('EL LOCAL HA SIDO CORRECTAMENTE REGISTRADO CON ID ', LAST_INSERT_ID()) as 'mensaje';
    COMMIT;
END