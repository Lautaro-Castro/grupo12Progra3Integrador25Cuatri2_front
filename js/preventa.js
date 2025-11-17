let contenedorAEstrenar = document.getElementById("contenedor-a-estrenar");
//Se crea la url para consumir la api
let url = "http://localhost:3000";

async function obtenerPeliculasAEstrenar() {
    try {
        let response = await fetch(`${url}/api/peliculas/preventa`);
        console.log(response);
        console.log(`Solicitud fetch `)
    
        let data = await response.json();
        console.log(data);

        let peliculasAEstrenar = data.payload;
        console.log(peliculasAEstrenar);
    

        mostrarPeliculasAEstrenar(peliculasAEstrenar);
    
    } catch (error) {
        console.error("Error obteniendo peliculas: ", error);
    }
}

//Funcion para poder mostrar en pantalla las peliculas que trajimos de la BD
function mostrarPeliculasAEstrenar(array){
    let htmlAEstrenar = "";
    array.forEach(peli => {
        htmlAEstrenar += `
                <div class="card-pelicula">
                    <a class="pelicula-img" href="comprar-entrada.html?id=${peli.id}&preventa=1">
                    <img class="pelicula-img" src="${peli.poster_url}" alt="${peli.nombre}">
                    <h2>${peli.nombre}</h2>
                    </a>
                </div>
        `;
    });

    contenedorAEstrenar.innerHTML = htmlAEstrenar;
}
obtenerPeliculasAEstrenar();