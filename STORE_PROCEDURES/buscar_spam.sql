CREATE PROCEDURE `buscar_spam`(
	IN pip TEXT
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
    
    IF(SELECT EXISTS(SELECT id FROM blacklistspam WHERE ip = pip))THEN
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
        id as 'BL_ID',
		ip as 'IP',
        agent as 'BROWSER_AGENT',
        fechahora as 'EXACT_TIME',
        request as 'REQUESTED',
        access as 'ACCESS'
        FROM blacklistspam
        WHERE ip = pip;
    ELSE
		SELECT '0' AS 'resultado', 'NO SE ENCONTRARON IP\'S' AS 'mensaje';
    END IF;

END