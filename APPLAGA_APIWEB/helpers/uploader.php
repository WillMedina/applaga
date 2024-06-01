<?php

class uploader
{

    private static $carpeta_subida = modelo::FOLDER_DOCS;

    static function comprimir_imagen($rutaOriginal, $rutaDestino, $calidadDeseada = 60)
    {
        try {
            // Obtener la extensión del archivo original
            $extensionOriginal = strtolower(pathinfo($rutaOriginal, PATHINFO_EXTENSION));

            // Crear una imagen según el tipo de archivo
            if ($extensionOriginal == 'jpg' || $extensionOriginal == 'jpeg') {
                $imagenOriginal = imagecreatefromjpeg($rutaOriginal);
            } elseif ($extensionOriginal == 'png') {
                $imagenOriginal = imagecreatefrompng($rutaOriginal);
            } else {
                //echo 'Formato de archivo no compatible.';
                logger::log("Formato de archivo no compatible", "helpers/uploader:comprimir_imagen");
                return false;
            }

            // Guardar la nueva imagen con la calidad especificada
            $nuevaRutaDestino = pathinfo($rutaDestino, PATHINFO_DIRNAME) . '/' . pathinfo($rutaDestino, PATHINFO_FILENAME) . '.' . $extensionOriginal;
            imagejpeg($imagenOriginal, $nuevaRutaDestino, $calidadDeseada);

            // Liberar memoria
            imagedestroy($imagenOriginal);

            return $nuevaRutaDestino;
        } catch (Throwable $exc) {
            logger::log("Error al comprimir una imagen > " + $exc->getMessage(), "helpers/uploader:comprimir_imagen");
            return false;
        }
    }

    static function redimensionar_imagen($rutaOriginal, $rutaDestino, $alturaMaxima = 720)
    {
        try {
            // Obtener la extensión del archivo original
            $extensionOriginal = strtolower(pathinfo($rutaOriginal, PATHINFO_EXTENSION));

            // Crear una imagen según el tipo de archivo
            if ($extensionOriginal == 'jpg' || $extensionOriginal == 'jpeg') {
                $imagenOriginal = imagecreatefromjpeg($rutaOriginal);
            } elseif ($extensionOriginal == 'png') {
                $imagenOriginal = imagecreatefrompng($rutaOriginal);
            } else {
                logger::log("Formato de archivo no compatible", "helpers/uploader:comprimir_imagen");
                return;
            }

            // Obtener las dimensiones de la imagen
            list($ancho, $alto) = getimagesize($rutaOriginal);

            // Validar si la redimensión es necesaria
            if ($alto > $alturaMaxima) {
                // Calcular el nuevo ancho manteniendo la relación de aspecto
                $nuevoAncho = ($alturaMaxima / $alto) * $ancho;

                // Redimensionar la imagen
                $nuevaImagen = imagecreatetruecolor($nuevoAncho, $alturaMaxima);
                imagecopyresampled($nuevaImagen, $imagenOriginal, 0, 0, 0, 0, $nuevoAncho, $alturaMaxima, $ancho, $alto);

                // Guardar la nueva imagen
                $nuevaRutaDestino = pathinfo($rutaDestino, PATHINFO_DIRNAME) . '/' . pathinfo($rutaDestino, PATHINFO_FILENAME) . '.' . $extensionOriginal;
                imagejpeg($nuevaImagen, $nuevaRutaDestino);

                // Liberar memoria
                imagedestroy($nuevaImagen);

                return $nuevaRutaDestino;
            } else {
                // No es necesario redimensionar, simplemente copiar la imagen original
                copy($rutaOriginal, $rutaDestino);
                return $rutaDestino;
            }
        } catch (Throwable $exc) {
            logger::log("Error al redimensionar una imagen > " + $exc->getMessage(), "helpers/uploader:redimensionar");
            return false;
        }
    }

    static function subir_archivo($archivo)
    {
        $respuesta = [];
        try {
            //verificamos que existe el archivo subido en el superglobal 
            if (!isset($_FILES[$archivo])) {
                $respuesta["resultado"] = 0;
                $respuesta["mensaje"] = "No existe el archivo con el nombre $archivo. No se ha recibido.";
                return $respuesta;
            }

            $token = md5(utils::get_pseudotoken3()); //token unico y aleatorio
            $file = $_FILES[$archivo];

            //verificamos que la subida haya estado ok
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $respuesta["resultado"] = 0;
                $respuesta["mensaje"] = "Ocurrio un error durante la carga.";
                $respuesta["error"] = $file["error"];
                return $respuesta;
            }

            //sacamos la extension
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

            //seteamos nuevos nombres a partir de tokenizar
            $fileName = $token . '.' . $extension;
            $filePath = self::$carpeta_subida . '/' . $fileName;

            $tipo_imagenes = ['jpg', 'JPG', 'JPEG', 'jpeg', 'png', 'PNG'];
            $img_attempt = false;

            //movemos y reportamos
            if (move_uploaded_file($file['tmp_name'], $filePath)) {

                if (in_array($extension, $tipo_imagenes)) {
                    self::redimensionar_imagen($filePath, $filePath);
                    self::comprimir_imagen($filePath, $filePath);
                    $img_attempt = true;
                }

                $respuesta["resultado"] = 1;
                $respuesta["mensaje"] = "Archivo subido correctamente.";
                $respuesta["nombre"] = $fileName;
                $respuesta["nombre_original"] = $archivo; //esto solo se ve aqui, no se guardara
                $respuesta["img_attempt"] = ($img_attempt ? 1 : 0);
                $respuesta["size"] = filesize($filePath);
                return $respuesta;
            } else {
                $respuesta["resultado"] = 0;
                $respuesta["mensaje"] = "Ocurrio un error al guardar el archivo.";
                $respuesta["img_attempt"] = ($img_attempt ? 1 : 0);
                return $respuesta;
            }
        } catch (Throwable $exc) {
            //logger::log("Error en la subida de archivo " + $exc->getMessage(), "helpers/uploader:subir_archivo");
            $respuesta['resultado'] = 0;
            $respuesta['mensaje'] = "Ha ocurrido una excepcion interna.";
            $respuesta['excepcion'] = $exc;
            return $respuesta;
        }
    }
}
