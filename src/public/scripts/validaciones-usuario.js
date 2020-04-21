const idUsuario = document.getElementById("idUsuario");
const nombre = document.getElementById("nombre");
const apellidoPaterno = document.getElementById("apellidoPaterno");
const apellidoMaterno = document.getElementById("apellidoMaterno");
const nombreUsuario = document.getElementById("nombreUsuario");
const contrasena = document.getElementById("contrasena");
const tipoUsuario = document.getElementById("tipoUsuario");
const estado = document.getElementById("estado");

const form = document.getElementById("form");

const idUsuarioText = document.getElementById("idUsuarioText");
const nombreText = document.getElementById("nombreText");
const apellidoPaternoText = document.getElementById("apellidoPaternoText");
const apellidoMaternoText = document.getElementById("apellidoMaternoText");
const nombreUsuarioText = document.getElementById("nombreUsuarioText");
const contrasenaText = document.getElementById("contrasenaText");
const tipoUsuarioText = document.getElementById("tipoUsuarioText");
const estadoText = document.getElementById("estadoText");

form.addEventListener('submit', (e) => {

    if (idUsuario.value === '' || idUsuario.value == null) {
        idUsuarioText.classList.remove("text_error");
        idUsuario.classList.add("is-invalid");
        e.preventDefault();
    } else {
        idUsuarioText.classList.add("text_error");
        idUsuario.classList.remove("is-invalid");
        idUsuario.classList.add("is-valid");
    }

    if (nombre.value === '' || nombre.value == null) {
        nombreText.classList.remove("text_error");
        nombre.classList.add("is-invalid");
        e.preventDefault();
    } else {
        nombreText.classList.add("text_error");
        nombre.classList.remove("is-invalid");
        nombre.classList.add("is-valid");
    }

    if (apellidoPaterno.value === '' || apellidoPaterno.value == null) {
        apellidoMaternoText.innerHTML = "<small>Llena el campo por favor</small>";
        apellidoPaternoText.classList.remove("text_error");
        apellidoPaterno.classList.add("is-invalid");
        e.preventDefault();
    } else if (apellidoPaterno.value.match("\\d")){
        apellidoPaterno.classList.add("is-invalid");
        apellidoPaternoText.innerHTML = "<small>Sólo letras por favor</small>";
        apellidoPaternoText.classList.remove("text_error");
        e.preventDefault();
    } else {
        apellidoPaternoText.classList.add("text_error");
        apellidoPaterno.classList.remove("is-invalid");
        apellidoPaterno.classList.add("is-valid");
    }

    if (apellidoMaterno.value === '' || apellidoMaterno.value == null) {
        apellidoMaternoText.innerHTML = "<small>Llena el campo por favor</small>";
        apellidoMaternoText.classList.remove("text_error");
        apellidoMaterno.classList.add("is-invalid");
        e.preventDefault();
    } else if (apellidoMaterno.value.match("\\d")){
        apellidoMaterno.classList.add("is-invalid");
        apellidoMaternoText.innerHTML = "<small>Sólo letras por favor</small>";
        apellidoMaternoText.classList.remove("text_error");
        e.preventDefault();
    } else {
        apellidoMaternoText.classList.add("text_error");
        apellidoMaterno.classList.remove("is-invalid");
        apellidoMaterno.classList.add("is-valid");
    }

    if (nombreUsuario.value === '' || nombreUsuario.value == null) {
        nombreUsuarioText.classList.remove("text_error");
        nombreUsuario.classList.add("is-invalid");
        e.preventDefault();
    } else {
        nombreUsuarioText.classList.add("text_error");
        nombreUsuario.classList.remove("is-invalid");
        nombreUsuario.classList.add("is-valid");
    }

    if (contrasena.value === '' || contrasena.value == null) {
        contrasenaText.classList.remove("text_error");
        contrasena.classList.add("is-invalid");
        e.preventDefault();
    } else {
        contrasenaText.classList.add("text_error");
        contrasena.classList.remove("is-invalid");
        contrasena.classList.add("is-valid");
    }

    if (tipoUsuario.value == "Tipo de usuario") {
        tipoUsuarioText.classList.remove("text_error");
        tipoUsuario.classList.add("is-invalid");
        e.preventDefault();
    } else {
        tipoUsuarioText.classList.add("text_error");
        tipoUsuario.classList.remove("is-invalid");
        tipoUsuario.classList.add("is-valid");
    }

    if (estado.value == "Estado") {
        estadoText.classList.remove("text_error");
        estado.classList.add("is-invalid");
        e.preventDefault();
    } else {
        estadoText.classList.add("text_error");
        estado.classList.remove("is-invalid");
        estado.classList.add("is-valid");
    }

});