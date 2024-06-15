CREATE DEFINER=`bunkernorte`@`localhost` PROCEDURE `stats_insectos_totales_almes`(
	IN p_local_id INT,
    IN p_year INT
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
    SELECT 
		'1' as 'resultado',
        'ok' as 'mensaje',
		MONTH(phi.fechahora) as 'MES',
        YEAR(phi.fechahora) as 'YEAR',
        DAY(phi.fechahora) as 'DIA',
        SUM(phi.lepidopteros) as 'PUNTOHISTORIAL_LEPIDOPTEROS',
		SUM(phi.microlepidopteros) as 'PUNTOHISTORIAL_MICROLEPIDOPTEROS',
		SUM(phi.hemipteros) as 'PUNTOHISTORIAL_HEMIPTEROS',
		SUM(phi.coleopteros) as 'PUNTOHISTORIAL_COLEOPTEROS',
		SUM(phi.moscas) as 'PUNTOHISTORIAL_MOSCAS',
		SUM(phi.mosquitos) as 'PUNTOHISTORIAL_MOSQUITOS',
		SUM(phi.otros) as 'PUNTOHISTORIAL_OTROS',
        (SUM(phi.lepidopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
		SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_LE',
		(SUM(phi.microlepidopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
		SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_MLE',
		(SUM(phi.hemipteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
		SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_HE',
		(SUM(phi.coleopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
		SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_CO',
		(SUM(phi.moscas)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
		SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_M',
		(SUM(phi.mosquitos)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
		SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_MO',
		(SUM(phi.otros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
		SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_O',
        SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
        SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros) AS 'TOTAL_INSECTOS'
    FROM punto_historial_insectos phi
    LEFT JOIN punto_insectos pi ON (pi.id = phi.punto_id)
    WHERE pi.local_id = p_local_id AND YEAR(phi.fechahora) = p_year
    AND phi.activo = 1
    GROUP BY MONTH(phi.fechahora);
END