window.onload = function () {
    let boton_login = document.getElementById('btnLogin');
    boton_login.addEventListener('click', login);

    /*Agarramos el enter*/
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // evita la acción por defecto del Enter
            // llama a la función que valida el formulario
            login();
        }
    });

}

function to(url) {
    window.location.href = url;
}

async function login() {
    let u = document.getElementById('txtUsuario').value;
    let p = document.getElementById('txtPass').value;

    if (u.length === 0 || p.length === 0) {
        alert("Debe llenar los campos para poder autenticarse");
        document.getElementById('txtUsuario').focus();
    } else {
        const datos = {usuario: u, pass: p};
        const respuesta = await fetch(http + '/login/c_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();
        
        if (resultado.resultado == "1") {
            to(http + "/panel");
            return;
        }
        
        alert(resultado.mensaje);
    }
}