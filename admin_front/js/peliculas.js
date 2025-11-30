let contenedorPeliculas = document.getElementById("contenedor-peliculas");
let botonCartelera = document.getElementById("btn-cartelera");
let botonPreVenta = document.getElementById("btn-preventa");
let filtroNombreOId = document.getElementById("filtro-nombre-id");
let filtroId = document.getElementById("filtro-id");
let url = "http://localhost:3000";
let peliculasCartelera = [];
let peliculasAEstrenar = [];
let opcionSeleccionada = "cartelera";

/*
    PELICULAS EN CARTELERA
*/

async function obtenerPeliculasCartelera() {
    try {
        let response = await fetch(`${url}/api/peliculas/cartelera`);
    
        let data = await response.json();

        let peliculasCartelera = data.payload;
    
        return peliculasCartelera;
    
    } catch (error) {
        console.error("Error obteniendo peliculas: ", error);
    }
}

function mostrarPeliculasCartelera(array){
    let htmlEnCartelera = `<h1 class="titulo-contenedor">Cartelera</h1>
    <section id="contenedor-cartelera"`;

    array.forEach(peli => {
    htmlEnCartelera += `
        <div class="card-pelicula">
            <img class="pelicula-img" src="${peli.poster_url}" alt="${peli.nombre}">
            <h2>${peli.nombre}</h2>
            <P id="id-pelicula"><strong>Id:</strong> ${peli.id}</P>
            <button id="btn-editar">Editar</button>
            <button id="btn-eliminar">Eliminar</button>
        </div>`;
    });
    
   
    htmlEnCartelera.innerHTML += `</section>`;
    contenedorPeliculas.innerHTML = htmlEnCartelera;
}


/*
    PELICULAS EN PRE VENTA
*/
async function obtenerPeliculasAEstrenar() {
    try {
        let response = await fetch(`${url}/api/peliculas/preventa`);
    
        let data = await response.json();

        let peliculasAEstrenar = data.payload;

        return peliculasAEstrenar;
    
    } catch (error) {
        console.error("Error obteniendo peliculas: ", error);
    }
}

//Funcion para poder mostrar en pantalla las peliculas que trajimos de la BD
function mostrarPeliculasAEstrenar(array){
    let htmlAEstrenar = `
    <h1 class="titulo-contenedor">Preventa</h1>
    <section id="contenedor-preventa"`;

    array.forEach(peli => {
    htmlAEstrenar += `
            <div class="card-pelicula">
                <img class="pelicula-img" src="${peli.poster_url}" alt="${peli.nombre}">
                <h2>${peli.nombre}</h2>
                <P id="id-pelicula"><strong>Id:</strong> ${peli.id}</P>
                <button id="btn-editar">Editar</button>
                <button id="btn-agregar-a-cartelerea">Agregar a cartelera</button>
                <button id="btn-eliminar">Eliminar</button>
            </div>`;
    });
    
    htmlAEstrenar.innerHTML += `</section>`;
    contenedorPeliculas.innerHTML = htmlAEstrenar;
}

//Creamos async function para esperar la carga de las peliculas en el fetch
async function cargarPeliculas(opcionSeleccionada){

    if(opcionSeleccionada === "cartelera"){
        peliculasCartelera = await obtenerPeliculasCartelera();
        validarListaPeliculas(peliculasCartelera);
    }else{
        peliculasAEstrenar = await obtenerPeliculasAEstrenar();
        validarListaPeliculas(peliculasAEstrenar);
    }
    
}

//Capturamos cambios en el ltro y actualizamos la listfia de peliculas
filtroNombreOId.addEventListener("keyup", () => {
    const textoFiltro = filtroNombreOId.value.toLowerCase();

    if(opcionSeleccionada === "cartelera"){
        const peliculasFiltradas = peliculasCartelera.filter(p => p.nombre.toLowerCase().includes(textoFiltro) || p.id.toString().includes(textoFiltro));
        validarListaPeliculas(peliculasFiltradas);
    } 
    else{
        const peliculasFiltradas = peliculasAEstrenar.filter(p => p.nombre.toLowerCase().includes(textoFiltro) ||  p.id.toString().includes(textoFiltro));
        validarListaPeliculas(peliculasFiltradas);
    }
    
});

//Validamos si la lista esta vacia o tiene peliculas y mostramos en pantalla lo que corresponda
function validarListaPeliculas(listaPeliculas){

        if(listaPeliculas.length === 0){
            contenedorPeliculas.innerHTML = `
                        <div class="card-peliculas-no-encontradas">
                            <h1>No se encontraron peliculas</h1>
                        </div>`;
        
        }else if(opcionSeleccionada === "cartelera"){
            mostrarPeliculasCartelera(listaPeliculas);
        }else{
            mostrarPeliculasAEstrenar(listaPeliculas);
        }
}

botonCartelera.addEventListener("click", () => {
    opcionSeleccionada = "cartelera";
    cargarPeliculas(opcionSeleccionada);
});

botonPreVenta.addEventListener("click", () => {
    opcionSeleccionada = "preventa";
    cargarPeliculas(opcionSeleccionada);
});

cargarPeliculas(opcionSeleccionada);

