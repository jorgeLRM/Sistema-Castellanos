const numParte = document.getElementById("numParte");
const descripcion = document.getElementById("descripcion");
const observacion = document.getElementById("observacion");
const precioVenta = document.getElementById("precioVenta");
const precioCompra = document.getElementById("precioCompra");
const existencias = document.getElementById("existencias");
const unidad = document.getElementById("unidad");
const clasificacion = document.getElementById("clasificacion");
const proveedores = document.getElementById("proveedores");

const form = document.getElementById("form");

const numParteText = document.getElementById("numParteText");
const descripcionText = document.getElementById("descripcionText");
const observacionText = document.getElementById("observacionText");
const precioVentaText = document.getElementById("precioVentaText");
const precioCompraText = document.getElementById("precioCompraText");
const existenciasText = document.getElementById("existenciasText");
const unidadText = document.getElementById("unidadText");
const clasificacionText = document.getElementById("clasificacionText");

form.addEventListener('submit', (e) => {

  if (numParte.value === '' || numParte.value == null) {
    numParteText.classList.remove("text_error");
    numParte.classList.add("is-invalid");
    e.preventDefault();
  } else {
    numParteText.classList.add("text_error");
    numParte.classList.remove("is-invalid");
    numParte.classList.add("is-valid");
  }

  if (descripcion.value === '' || descripcion.value == null) {
    descripcionText.classList.remove("text_error");
    descripcion.classList.add("is-invalid");
    e.preventDefault();
  } else {
    descripcionText.classList.add("text_error");
    descripcion.classList.remove("is-invalid");
    descripcion.classList.add("is-valid");
  }

  if (observacion.value === '' || observacion.value == null) {
    observacionText.classList.remove("text_error");
    observacion.classList.add("is-invalid");
    e.preventDefault();
  } else {
    observacionText.classList.add("text_error");
    observacion.classList.remove("is-invalid");
    observacion.classList.add("is-valid");
  }

  if (precioCompra.value === '' || precioCompra.value == null) {
    precioCompraText.innerHTML = "<small>Llena el campo por favor</small>";
    precioCompraText.classList.remove("text_error");
    precioCompra.classList.add("is-invalid");
    e.preventDefault();
  } else if (!isFinite(precioCompra.value)) {
    precioCompraText.innerHTML = "<small>Sólo números por favor</small>";
    precioCompraText.classList.remove("text_error");
    e.preventDefault();
  } else {
    precioCompraText.classList.add("text_error");
    precioCompra.classList.remove("is-invalid");
    precioCompra.classList.add("is-valid");
  }

  if (precioVenta.value === '' || precioVenta.value == null) {
    precioVentaText.innerHTML = "<small>Llena el campo por favor</small>";
    precioVentaText.classList.remove("text_error");
    precioVenta.classList.add("is-invalid");
    e.preventDefault();
  } else if (!isFinite(precioVenta.value)) {
    precioVentaText.innerHTML = "<small>Sólo números por favor</small>";
    precioVentaText.classList.remove("text_error");
    e.preventDefault();
  } else {
    precioVentaText.classList.add("text_error");
    precioVenta.classList.remove("is-invalid");
    precioVenta.classList.add("is-valid");
  }

  if (unidad.value == "Unidad") {
    unidadText.classList.remove("text_error");
    unidad.classList.add("is-invalid");
    e.preventDefault();
  } else {
    unidadText.classList.add("text_error");
    unidad.classList.remove("is-invalid");
    unidad.classList.add("is-valid");
  }
  
  if (clasificacion.value == "Clasificación") {
    clasificacionText.classList.remove("text_error");
    clasificacion.classList.add("is-invalid");
    e.preventDefault();
  } else {
    clasificacionText.classList.add("text_error");
    clasificacion.classList.remove("is-invalid");
    clasificacion.classList.add("is-valid");
  }

  if (window.location.pathname.split("/").pop() === "add-repair") {
    if (existencias.value === '' || existencias.value == null) {
      existenciasText.innerHTML = "<small>Llena el campo por favor</small>";
      existenciasText.classList.remove("text_error");
      existencias.classList.add("is-invalid");
      e.preventDefault();
    } else if (!Number.isInteger(Number(existencias.value))) {
      existenciasText.innerHTML = "<small>Sólo números enteros por favor</small>";
      existenciasText.classList.remove("text_error");
      e.preventDefault();
    } else {
      existenciasText.classList.add("text_error");
      existencias.classList.remove("is-invalid");
      existencias.classList.add("is-valid");
    }
  
    if (proveedores.value === '' || proveedores.value == null) {
      proveedoresText.classList.remove("text_error");
      proveedores.classList.add("is-invalid");
      e.preventDefault();
    } else {
      proveedoresText.classList.add("text_error");
      proveedores.classList.remove("is-invalid");
      proveedores.classList.add("is-valid");
    }
  }

});


document.querySelector(".custom-file-input").addEventListener("change", function () {
  let fileName = this.value.split("\\").pop();
  this.nextElementSibling.innerHTML = fileName;
});