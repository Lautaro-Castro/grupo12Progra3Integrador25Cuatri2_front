let contenedorPeliculas = document.getElementById("contenedor-peliculas");
let botonCartelera = document.getElementById("btn-cartelera");
let botonPreVenta = document.getElementById("btn-preventa");
let filtroNombreOId = document.getElementById("filtro-nombre-id");
let filtroId = document.getElementById("filtro-id");
let botonAgregarPelicula = document.getElementById("agregar-pelicula");
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
            <button class="btn-editar-pelicula" data-id="${peli.id}">Editar</button>
            <button class="btn-eliminar-pelicula" data-id="${peli.id}">Eliminar</button>
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
    //Escuchamos los botones editar por si los clickean
    document.querySelectorAll('.btn-editar-pelicula').forEach(boton => {
        boton.addEventListener('click', () => {
            // Obtenemos el id del atributo data-id
            const id = Number(boton.dataset.id);
            // Redirigimos
            window.location.href = `editar-pelicula.html?id=${id}`;
        });
    });

    //Escuchamos los botones eliminar por si los clickean
    document.querySelectorAll('.btn-eliminar-pelicula').forEach(boton => {
        boton.addEventListener('click', () => {
            // Obtenemos el id del atributo data-id
            const id = Number(boton.dataset.id); 
            eliminarPelicula(id);
        });
    });
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

async function eliminarPelicula(id) {
    if (!confirm("¿Seguro que querés eliminar esta pelicula?")) return;

    try {

        let response = await fetch(`${url}/api/peliculas/${id}`, {
            method: "DELETE"
        });

        let result = await response.json();

        if(response.ok) {
            alert(result.message);
            cargarPeliculas(esPreventa);
        } else {
            console.error("Error: ", result.message);
            alert("No se pudo eliminar la pelicula");
        }

    } catch (error) { // El catch este, solo atrapa errores de red
        console.error("Error en la solicitud DELETE: ", error);
        alert("Ocurrio un error al eliminar una pelicula");
    }
}

cargarPeliculas(esPreventa);