// Variables & Selectores
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');
const spinner = document.querySelector('.spinner');

let paginaActual = 1;
let totalPaginas;
let iteradorSiguiente;

// Eventos
window.onload = () => {
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarFormulario);
    paginacionDiv.addEventListener('click', direccionPaginacion);
};

// Funciones
function validarFormulario(event) {
    event.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Todos los campos son Obligatorios');
        return;
    }

    buscarImagenes();
};

function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if (!alerta) {
        const alerta = document.createElement('p');

        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center");

        alerta.innerHTML = mensaje;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
};

// Busca las imagenes en la API
async function buscarImagenes() {
    const terminoBusqueda = document.querySelector('#termino').value;

    const key = '1732750-d45b5378879d1e877cd1d35a6';
    const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=30&page=${paginaActual}`;

    showLoading();
    limpiarPaginacion();
    limpiarResultado();

    iteradorSiguiente = null;

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        hideLoading();

        if (resultado.totalHits <= 0) {
            mostrarAlerta('No hay Resultados');
            return;
        }

        totalPaginas = calcularPaginas(resultado.totalHits);
        mostrarImagenes(resultado.hits);

    } catch (error) {
        // SweetAlert
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Hubo un Error',
            showConfirmButton: false,
            timer: 1500
        })
    }
};

function mostrarImagenes(imagenes) {

    limpiarResultado();

    imagenes.forEach((imagen) => {

        const { likes, views, previewURL, largeImageURL, user } = imagen;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-2">
                <div class="bg-white ">
                    <img data-aos="fade-up" class="ratio ratio-1x1" src=${previewURL} alt="image from ${user}" />
                    <div class="p-2">
                        <p class="card-text fw-bold">${likes} <span class="text-primary">❤️</span></p>
                        <p class="card-text fw-bold">${views} <span class="text-primary">Vistas</span></p>
        
                        <a href=${largeImageURL} rel="noopener noreferrer" target="_blank" class="text-decoration-none bg-blue-800 w-full p-1 block rounded text-center font-bold  hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
            `;

    })
    
    if (!iteradorSiguiente) {
        mostrarPaginacion();
    }
};

function showLoading() {
    spinner.style.display = 'block';
};

function hideLoading() {
    spinner.style.display = 'none';
};

function mostrarPaginacion() {
    // recorrer el Iterador
    iteradorSiguiente = crearPaginacion(totalPaginas);
    while (true) {
        const { value, done } = iteradorSiguiente.next();
        if (done) return;

        // Crear botón de siguiente
        const botonSiguiente = document.createElement('a');
        botonSiguiente.href = "#";
        botonSiguiente.dataset.pagina = value;
        botonSiguiente.textContent = (value <= 9) ? ('0' + value) : value;
        botonSiguiente.classList.add('siguiente', 'text-decoration-none', 'btn', 'btn-primary', 'btn-sm', 'p-1', 'font-bold', 'rounded');
        paginacionDiv.appendChild(botonSiguiente);
    }
};

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / 30));
};


// Crear el generador Paginas
function* crearPaginacion(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
};

function direccionPaginacion(event) {
    event.preventDefault();
    if (event.target.classList.contains('siguiente')) {

        paginaActual = Number(event.target.dataset.pagina);
        buscarImagenes();
        formulario.scrollIntoView();
    }
};

function limpiarResultado() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
};

function limpiarPaginacion() {
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
};

