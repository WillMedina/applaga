CREATE PROCEDURE `crear_sesion`(
	IN p_login_id INT,
    IN p_ip TEXT,
    IN p_browser_agent TEXT,
    IN p_cookie TEXT
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
		 INSERT INTO sesion(login_id, ip, browser_agent, cookie)
		 VALUES (p_login_id, p_ip, p_browser_agent, p_cookie);
         
         SELECT 1 as 'resultado', LAST_INSERT_ID() AS 'codigo_sesion',
         'OK' AS 'resultado';
    COMMIT;
END