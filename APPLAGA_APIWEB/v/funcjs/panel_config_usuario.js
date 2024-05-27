function guardar_pass() {
    try {
        if (document.getElementById('cambiar_pass')) {
            let p1 = document.getElementById('p1');
            let p2 = document.getElementById('p2');

            despintar_pass();

            if (p1.value !== p2.value) {
                pintar_pass();
                return;
            }

            if (p1.value.trim().length == 0) {
                pintar_pass();
                return;
            }
        }
    } catch (e) {
        console.log('panel_config_usuario', e);
    }
}

function pintar_pass() {
    try {
        if (document.getElementById('cambiar_pass')) {
            let p1 = document.getElementById('p1');
            let p2 = document.getElementById('p2');

            p1.classList.add('input-alerta');
            p2.classList.add('input-alerta');
        }
    } catch (e) {
        console.log('panel_config_usuario', e);
    }
}

function despintar_pass() {
    try {
        if (document.getElementById('cambiar_pass')) {
            let p1 = document.getElementById('p1');
            let p2 = document.getElementById('p2');

            p1.classList.remove('input-alerta');
            p2.classList.remove('input-alerta');
        }
    } catch (e) {
        console.log('panel_config_usuario', e);
    }
}


function potencia(contrasena) {
    let longitud = contrasena.length;
    let puntuacion = 0;
    let repeticiones = {}; // Objeto para contar repeticiones de letras

    // Puntuación base por longitud
    puntuacion += (longitud > 6 ? longitud : 0);

    // Puntuación adicional por uso de mayúsculas
    let mayusculas = contrasena.match(/[A-Z]/g);
    puntuacion += (mayusculas ? parseInt((mayusculas.length / 2) + 1) : 0) * 2;

    // Puntuación adicional por uso de minúsculas
    let minusculas = contrasena.match(/[a-z]/g);
    puntuacion += (minusculas ? parseInt((minusculas.length / 2) + 1) : 0) * 2;

    // Puntuación adicional por uso de números
    let numeros = contrasena.match(/[0-9]/g);
    puntuacion += (numeros ? parseInt((numeros.length / 2) + 1) : 0) * 4;

    // Puntuación adicional por uso de caracteres especiales
    let especiales = contrasena.match(/[^a-zA-Z0-9]/g);
    puntuacion += (especiales ? especiales.length : 0) * 6;

    // Contar repeticiones de letras y aplicar la regla de resta
    for (let char of contrasena) {
        if (repeticiones[char]) {
            repeticiones[char]++;
            if (repeticiones[char] >= 4) {
                puntuacion -= 1; // Resta 1 punto por cada repetición a partir de la cuarta
            }
        } else {
            repeticiones[char] = 1;
        }
    }

    // Puntuación adicional por uso de repeticiones
    for (let char in repeticiones) {
        if (repeticiones[char] > 1 && repeticiones[char] < 4) {
            puntuacion -= repeticiones[char]; // Resta puntos por repeticiones (excepto a partir de la cuarta)
        }
    }

    // Puntuación adicional por uso de secuencias
    /*let secuencias = ["123", "abc", "qwerty", "admin"];
     for (let secuencia of secuencias) {
     if (contrasena.includes(secuencia)) {
     puntuacion -= 10;
     }
     }*/

    return Math.max(0, Math.min(100, puntuacion));
}

function potencia_pass() {
    try {
        if (document.getElementById('cambiar_pass')) {
            let p1 = document.getElementById('p1');
            let p2 = document.getElementById('p2');
            let aviso = document.getElementById('aviso_pass');
            despintar_pass();
            aviso.innerHTML = '';

            if (p1.value != p2.value) {
                pintar_pass();
                aviso.innerHTML = '<span class="texto-alerta-fuerte">Las contrase&ntilde;as no coinciden</span>';
                return;
            }

            if (p1.value.trim().length == 0) {
                despintar_pass();
                aviso.innerHTML = '';
                return;
            }

            let potencia_v = potencia(p1.value);
            if (potencia_v >= 0 && potencia_v <= 33) {
                aviso.innerHTML = '<span class="texto-alerta-fuerte">La contrase&ntilde;a tiene una potencia de seguridad de ' + potencia_v + '/100</span>';
                return;
            }

            if (potencia_v >= 34 && potencia_v <= 66) {
                aviso.innerHTML = '<span class="texto-advertencia-fuerte">La contrase&ntilde;a tiene una potencia de seguridad de ' + potencia_v + '/100</span>';
                return;
            }

            if (potencia_v >= 67 && potencia_v <= 100) {
                aviso.innerHTML = '<span class="texto-exito-fuerte">La contrase&ntilde;a tiene una potencia de seguridad de ' + potencia_v + '/100</span>';
                return;
            }
        }
    } catch (e) {
        console.log('panel_config_usuario', e);
    }
}

if (document.getElementById('cambiar_pass')) {
    document.getElementById('p1').addEventListener('input', (event) => {
        console.log(event);
        potencia_pass();
    });

    document.getElementById('p2').addEventListener('input', (event) => {
        console.log(event);
        potencia_pass();
    });
}