CREATE PROCEDURE `admin_reset_todo`()
BEGIN
	SET time_zone = '-5:00';
	-- TRUNCATE sesion;
    -- TRUNCATE visita;
    -- TRUNCATE visita_documento;
    -- TRUNCATE visita_documento_observacion;
    -- TRUNCATE visita_operarios;
    TRUNCATE punto;
    TRUNCATE punto_historial;
END