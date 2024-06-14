CREATE PROCEDURE `registrar_nospam`(
	IN pip TEXT,
	IN pagent TEXT,
    IN prequest TEXT
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
    
    START TRANSACTION;
		INSERT INTO blacklistspam(ip, agent, request, access)
        VALUES(pip, pagent, prequest, 'ACCESS');
        
        SELECT '1' AS 'resultado',
        'SPAMMER REGISTADO' AS 'mensaje';
    COMMIT;
END