const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const barraTitulo = document.getElementById("contenedor-titulo");
barraTitulo.innerHTML += `<h1>Comprando entradas para ${id}</h1>`;

const selectorFormatos = document.getElementById("selector-formatos");
const arrayFormatos = [
    {"id":1, "nombre": "2D"},
    {"id":2, "nombre": "3D"},
    {"id":3, "nombre": "4D"}
];

//Funcion para cargar los formatos en el filtro
function listarFiltroFormatos(array){
    let htmlFormatos = "";
    array.forEach(formato => {
        htmlFormatos += `
            <option value="${formato.id}">${formato.nombre}</option>
        `;
    });

    selectorFormatos.innerHTML += htmlFormatos;
}


const selectorIdiomas = document.getElementById("selector-idiomas");
const arrayIdiomas = [
    {"id":1, "nombre": "Español"},
    {"id":2, "nombre": "Subtitulado"}
];

//Funcion para cargar los idiomas en el filtro
function listarFiltroIdiomas(array){
    let htmlIdiomas = "";
    array.forEach(idioma => {
        htmlIdiomas += `
            <option value="${idioma.id}">${idioma.nombre}</option>
        `;
    });

    selectorIdiomas.innerHTML += htmlIdiomas;
}

//Mostramos el poster de la pelicula seleccionada
const posterPelicula = document.getElementById("poster-pelicula");
let urlPeli = "https://sacnkprodarcms.blob.core.windows.net/content/posters/HO00011196.jpg";
posterPelicula.innerHTML += `<img class="pelicula-img" src="${urlPeli}" alt="hola">`;

const funciones = [
    {"id": 1, 
        "pelicula_id": "Pradator",
        "formato_id": "2D",
        "idioma_id": "Español",
        "fecha": "2025-12-11",
        "hora": "15:30",
        "butacas_disponibles": 5,
        "precio": 14000
    },
    {"id": 2, 
        "pelicula_id": "Pradator",
        "formato_id": "3D",
        "idioma_id": "Subtitulado",
        "fecha": "2025-12-11",
        "hora": "17:30",
        "butacas_disponibles": 3,
        "precio": 16000
    },
    {"id": 3, 
        "pelicula_id": "Pradator",
        "formato_id": "4D",
        "idioma_id": "Español",
        "fecha": "2025-12-11",
        "hora": "19:30",
        "butacas_disponibles": 2,
        "precio": 18000
    }
];

const contenedorFunciones = document.getElementById("contenedor-funciones");
//Funcion para cargar las funciones
function listarFunciones(array){
    let htmlFunciones = "";
    array.forEach(funcion => {
        htmlFunciones += `
            <div class="card-funcion">
                <p><strong>Formato: </strong> ${funcion.formato_id}</p>
                <p><strong>Idioma: </strong> ${funcion.idioma_id}</p>
                <p><strong>Precio: </strong> ${funcion.precio}</p>
                <p><strong>Butacas disponibles: </strong> ${funcion.butacas_disponibles}</p>
                <div class="fila-input">
                <label for="cantidad-funcion-${funcion.id}"><strong>Entradas:</strong></label>
                <input type="number" id="cantidad-funcion-${funcion.id}" min="0" max="${funcion.butacas_disponibles}" value="0">
                </div>
                <button id="agregar-funcion-${funcion.id}">Agregar</button>
            </div>
        `;
    });

    contenedorFunciones.innerHTML += htmlFunciones;
}


listarFiltroFormatos(arrayFormatos);
listarFiltroIdiomas(arrayIdiomas);
listarFunciones(funciones);