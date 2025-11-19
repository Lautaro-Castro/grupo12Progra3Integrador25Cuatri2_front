const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const preventa = params.get("preventa");

//Se crea la url para consumir la api
let url = "http://localhost:3000";


/*===============
    PELICULA
===============*/

//Funcion para poder consumir la api y traer la pelicula por id
async function obtenerPeliculaPorId(id) {
    try {
        let response = await fetch(`${url}/api/peliculas/${id}`);
        console.log(response);
        console.log(`Solicitud fetch pelicula por id`)
    
        let data = await response.json();
        console.log(data);

        let pelicula = data.payload;
        console.log(pelicula);

        mostrarDatosPelicula(pelicula);
    
    } catch (error) {
        console.error("Error obteniendo peliculas: ", error);
    }
    
}

async function mostrarDatosPelicula(pelicula) {

    const posterPelicula = document.getElementById("poster-pelicula");
    posterPelicula.innerHTML += `<img class="pelicula-img" src="${pelicula.poster_url}"     alt="hola">`;
    const barraTitulo = document.getElementById("contenedor-titulo");
    if(preventa === "0"){
        barraTitulo.innerHTML += `
        <a href="peliculas.html"> &lt; Volver</a>
        <h1>Comprando entradas para ${pelicula.nombre}</h1>`;
    }
    else{
        barraTitulo.innerHTML += `
        <a href="preventa.html"> &lt; Volver</a>
        <h1>Comprando entradas para ${pelicula.nombre} (Pre venta)</h1>`
    }
    

}

/*===============
    FORMATOS
===============*/
const selectorFormatos = document.getElementById("selector-formatos");

async function obtenerFormatos(req, res) {
    try {
        let response = await fetch(`${url}/api/formatos`);
        console.log(response);
        console.log(`Solicitud fetch formatos`)
    
        let data = await response.json();
        console.log(data);

        let formatos = data.payload;
        console.log(formatos);

        cargarFiltroFormatos(formatos);
    
    } catch (error) {
        console.error("Error obteniendo formatos: ", error);
    }
}

//Funcion para cargar los formatos en el filtro
function cargarFiltroFormatos(array){
    let htmlFormatos = "";
    array.forEach(formato => {
        htmlFormatos += `
            <option value="${formato.id}">${formato.nombre}</option>
        `;
    });

    selectorFormatos.innerHTML += htmlFormatos;
}


/*===============
    IDIOMAS
===============*/
const selectorIdiomas = document.getElementById("selector-idiomas");

async function obtenerIdiomas(req, res) {
    try {
        
        let response = await fetch(`${url}/api/idiomas`);
        console.log(response);
        console.log(`Solicituda fetch idiomas`);

        let data = await response.json();
        console.log(data);

        let idiomas = data.payload;
        console.log(idiomas);

        cargarFiltroIdiomas(idiomas);
        
    } catch (error) {
        console.error("Error obteniendo idiomas: ", error);
    }
}

//Funcion para cargar los idiomas en el filtro
function cargarFiltroIdiomas(array){
    let htmlIdiomas = "";
    array.forEach(idioma => {
        htmlIdiomas += `
            <option value="${idioma.id}">${idioma.nombre}</option>
        `;
    });

    selectorIdiomas.innerHTML += htmlIdiomas;
}


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

obtenerPeliculaPorId(id);
obtenerFormatos();
obtenerIdiomas();
listarFunciones(funciones);