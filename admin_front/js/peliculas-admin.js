let contenedorPeliculas = document.getElementById("contenedor-peliculas");
let botonCartelera = document.getElementById("btn-cartelera");
let botonPreVenta = document.getElementById("btn-preventa");
let filtroNombreOId = document.getElementById("filtro-nombre-id");
let filtroId = document.getElementById("filtro-id");
let botonAgregarPelicula = document.getElementById("agregar-pelicula")
let url = "http://localhost:3000";
let esPreventa = false;

/*
    OBTENEMOS LAS PELICULAS
*/

async function obtenerPeliculas(esPreventa) {
    try {

        const request = esPreventa ? `${url}/api/peliculas/preventa` : `${url}/api/peliculas/cartelera`;
        let response = await fetch(request);
        let data = await response.json();
        let peliculas = data.payload;
        return peliculas;
    
    } catch (error) {
        console.error("Error obteniendo peliculas: ", error);
    }
}

function mostrarPeliculas(array, esPreventa){
    let htmlPeliculas = ``;
    if(esPreventa){
        htmlPeliculas += `<h1 class="titulo-contenedor">Preventa</h1>
        <section id="contenedor-peliculas"`;
    }else{
        htmlPeliculas += `<h1 class="titulo-contenedor">Cartelera</h1>
        <section id="contenedor-peliculas"`;
    }

    array.forEach(peli => {
    htmlPeliculas += `
        <div class="card-pelicula">
            <img class="pelicula-img" src="${peli.poster_url}" alt="${peli.nombre}">
            <h2>${peli.nombre}</h2>
            <P id="id-pelicula"><strong>Id:</strong> ${peli.id}</P>
            <button id="btn-editar">Editar</button>
            <button id="btn-eliminar">Eliminar</button>
        </div>`;
    });
    
    htmlPeliculas += `</section>`;
    contenedorPeliculas.innerHTML = htmlPeliculas;
}

//Creamos async function para esperar la carga de las peliculas en el fetch
async function cargarPeliculas(esPreventa){
    peliculas = await obtenerPeliculas(esPreventa);
    if(validarListaPeliculas(peliculas)){
        mostrarPeliculas(peliculas, esPreventa);
    }
        
}

//Validamos si la lista esta vacia o tiene peliculas. Si esta vacia lo informamos en pantalla. Se retorna true o false segun lo que corresponda a la validacion.
function validarListaPeliculas(listaPeliculas){
    if(listaPeliculas.length === 0){
        contenedorPeliculas.innerHTML = `
        <div class="card-peliculas-no-encontradas">
        <h1>No se encontraron peliculas</h1>
        </div>`;
        return false;
    }
    return true;
}

//Capturamos cambios en el filtro y actualizamos la lista de peliculas
filtroNombreOId.addEventListener("keyup", () => {
    const textoFiltro = filtroNombreOId.value.toLowerCase().trim();
    const peliculasFiltradas = peliculas.filter(p => p.nombre.toLowerCase().includes(textoFiltro) || p.id.toString().includes(textoFiltro));
    if(textoFiltro.trim() === "") {
        mostrarPeliculas(peliculas, esPreventa);
    }else if(validarListaPeliculas(peliculasFiltradas)){
        mostrarPeliculas(peliculasFiltradas, esPreventa);
    }
});

botonCartelera.addEventListener("click", () => {
    esPreventa = false;
    cargarPeliculas(esPreventa);
});

botonPreVenta.addEventListener("click", () => {
    esPreventa = true;
    cargarPeliculas(esPreventa);
});



botonAgregarPelicula.addEventListener("click", () => {
    window.location.href = "crear-pelicula.html"
})


cargarPeliculas(esPreventa);