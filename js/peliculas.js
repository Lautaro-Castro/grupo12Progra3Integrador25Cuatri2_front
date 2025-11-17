let contenedorCartelera = document.getElementById("contenedor-cartelera");
let contenedorAEstrenar = document.getElementById("contenedor-a-estrenar");
//Se crea la url para consumir la api
let url = "http://localhost:3000";

//Funcion para poder consumir la api y traer las peliculas en cartelera y proximos estrenos
async function obtenerPeliculasCartelera() {
    try {
        let response = await fetch(`${url}/api/peliculas/cartelera`);
        console.log(response);
        console.log(`Solicitud fetch `)
    
        let data = await response.json();
        console.log(data);

        let peliculasCartelera = data.payload;
        console.log(peliculasCartelera);
    

        mostrarPeliculasCartelera(peliculasCartelera);
    
    } catch (error) {
        console.error("Error obteniendo peliculas: ", error);
    }
}

//Funcion para poder mostrar en pantalla las peliculas que trajimos de la BD
function mostrarPeliculasCartelera(array){
    let htmlEnCartelera = "";
    array.forEach(peli => {
        //Se crean los div con las peliculas a mostrar y el <a> con href a la pantalla de compra, pasando el id como parametro con el ?
        htmlEnCartelera += `
            <div class="card-pelicula">
                <a class="pelicula-img" href="comprar-entrada.html?id=${peli.id}&preventa=0">
                <img class="pelicula-img" src="${peli.poster_url}" alt="${peli.nombre}">
                <h2>${peli.nombre}</h2>
                </a>
            </div>
        `;
    });

    contenedorCartelera.innerHTML = htmlEnCartelera;
}

obtenerPeliculasCartelera();