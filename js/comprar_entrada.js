const params = new URLSearchParams(window.location.search);
const pelicula_id = params.get("pelicula_id");
console.log(`${pelicula_id}`);
const preventa = params.get("preventa");

// Para usar la pelicula en otras funciones
let peliculaSeleccionada = null;

//Se crea la url para consumir la api
let url = "http://localhost:3000";


/*===============
    PELICULA
===============*/

//Funcion para poder consumir la api y traer la pelicula por id
async function obtenerPeliculaPorId(pelicula_id) {
    try {
        let response = await fetch(`${url}/api/peliculas/${pelicula_id}`);
        console.log(response);
        console.log(`Solicitud fetch pelicula por id`)
    
        let data = await response.json();
        console.log(data);

        let pelicula = data.payload;
        console.log(pelicula);
        peliculaSeleccionada = pelicula;

        mostrarDatosPelicula(pelicula);
    
    } catch (error) {
        console.error("Error obteniendo peliculas: ", error);
    }
    
}

async function mostrarDatosPelicula(pelicula) {

    const posterPelicula = document.getElementById("poster-pelicula");
    posterPelicula.innerHTML += `<img class="pelicula-img" src="${pelicula.poster_url}"     alt="${pelicula.nombre}">
    <div class= "detalles-compra-peliculas">
        <p id="sinopsis" class="texto-colapsado">${pelicula.sinopsis}</p>
        <button id="verMasBtn">Ver más</button>
        <p><strong>Duracion: ${pelicula.duracion} min<strong></p>
        <h3>Clasificacion: ${pelicula.clasificacion}</h3>
        <p>Distribuidor: ${pelicula.distribuidor} </p>
    </div>`;

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
        activarBotonVerMas();

}

// Funcion de BOTON ver mas
function activarBotonVerMas(){
    const sinopsis = document.getElementById("sinopsis");
    const verMasBtn = document.getElementById("verMasBtn");

    //por si no existe:
    if(!sinopsis || !verMasBtn) return;

    //si la sinopsis no es larga lo oculto, veo los pixeles que tiene
    if(sinopsis.scrollHeight <= sinopsis.clientHeight + 1 ){
        sinopsis.classList.remove("texto-colapsado");
        verMasBtn.style.display = "none";
        return; //no agrego el addEventListener
    }

    //si la sinapsis es larga agrego el boton 
    verMasBtn.addEventListener("click", () => {
        sinopsis.classList.toggle("texto-expandido");

        if(sinopsis.classList.contains("texto-expandido")){
            verMasBtn.textContent = "Ver menos";
        }else{
            verMasBtn.textContent = "Ver mas";
        }
    });
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


/*===============
    FUNCIONES
===============*/
const contenedorFunciones = document.getElementById("contenedor-funciones");
const botonFiltrar = document.getElementById("btn-filtrar");
const botonLimpiarFiltros = document.getElementById("btn-limpiar-filtros");

async function obtenerFunciones(formato_id = null, idioma_id = null) {
    try {

        let urlFetch = `${url}/api/peliculas/${pelicula_id}/funciones?preventa=${preventa}`;
        if(formato_id) urlFetch += `&formato_id=${formato_id}`;
        if(idioma_id) urlFetch += `&idioma_id=${idioma_id}`;

        let response = await fetch(urlFetch);
        console.log(response);
        console.log(`Solicituda fetch funciones`);

        let data = await response.json();
        console.log(data);

        let funciones = data.payload;
        console.log(funciones);

        cargarFunciones(funciones);

    } catch (error) {
        console.error("Error obteniendo funciones: ", error);
    }
}

//Funcion para cargar las funciones de la pelicula
function cargarFunciones(array){
    let htmlFunciones = "";
    if(array.length === 0){
        htmlFunciones += `<div class="card-funcion">
                <h1><strong>No hay funciones disponibles</strong></h1>
                </div>`;
    }else{
        array.forEach(funcion => {
        //Le damos a la fecha y al horario el formato correcto para ser mostrados
        let fechaYHora = formatearFechaYHora(funcion.fecha, funcion.hora);
        htmlFunciones += `
            <div class="card-funcion">
                <p><strong>Formato: </strong> ${funcion.formato}</p>
                <p><strong>Idioma: </strong> ${funcion.idioma}</p>
                <p><strong>Precio: </strong> ${funcion.precio}</p>
                <p><strong>Fecha: </strong> ${fechaYHora.fecha}</p>
                <p><strong>Hora: </strong> ${fechaYHora.hora}</p>
                <p><strong>Sala: </strong> ${funcion.sala}</p>
                <p><strong>Butacas disponibles: </strong> ${funcion.butacas_disponibles}</p>
                <div class="fila-input">
                <label for="cantidad-funcion-${funcion.id}"><strong>Entradas:</strong></label>
                <input type="number" id="cantidad-funcion-${funcion.id}" min="0" max="${funcion.butacas_disponibles}" value="0">
                </div>
                <button id="agregar-funcion-${funcion.id}" class="agregar-funcion">Agregar</button>
            </div>
        `;
        });
    }

    contenedorFunciones.innerHTML = htmlFunciones;
    activarBotonesAgregar(array);
}

function formatearFechaYHora(fecha, hora){

    fecha = fecha.split("T")[0].split("-").reverse().join("/");
    hora = hora.split(":");
    hora.pop();
    hora = hora.join(":");

    return { fecha: fecha, hora: hora};
}

botonFiltrar.addEventListener("click", () => {
    let formatoSeleccionado = selectorFormatos.value || null;
    let idiomaSeleccionado = selectorIdiomas.value || null;
    obtenerFunciones(formatoSeleccionado, idiomaSeleccionado);
    console.log(`Formato: ${formatoSeleccionado}, Idioma: ${idiomaSeleccionado}`)
});

botonLimpiarFiltros.addEventListener("click", (e) => {
    selectorFormatos.value = "";
    selectorIdiomas.value = "";
    obtenerFunciones();
});

function activarBotonesAgregar(funciones){
    funciones.forEach(funcion => {
        const boton = document.getElementById(`agregar-funcion-${funcion.id}`);
        if (!boton) return;

        boton.addEventListener("click", () => {

            const inputCantidad = document.getElementById(`cantidad-funcion-${funcion.id}`);
            const cantidad = Number(inputCantidad.value);

            if (cantidad <= 0) {
                alert("Debe seleccionar al menos 1 entrada");
                return;
            }

            if (!peliculaSeleccionada) {
                alert("Error cargando la película");
                return;
            }

            const fechaYHora = formatearFechaYHora(funcion.fecha, funcion.hora);

            // Lo que va al carrito
            const producto = {
                id: funcion.id, 
                nombre: `${peliculaSeleccionada.nombre} (${funcion.formato} - ${funcion.idioma}) ${fechaYHora.fecha} ${fechaYHora.hora}`,
                precio: funcion.precio
            };

            agregarPeliculaAlCarrito(producto, cantidad);

            // Mostrar modal
            const modal = document.getElementById("modal-carrito");
            modal.classList.remove("modal-oculto");
            modal.classList.add("modal-visible");

            // Botón: seguir comprando
            document.getElementById("btn-seguir-comprando").onclick = () => {
                modal.classList.remove("modal-visible");
                modal.classList.add("modal-oculto");
            };

            // Botón: ir al carrito
            document.getElementById("btn-ir-carrito").onclick = () => {
                window.location.href = "candy.html";
            };
        });
    });
}


obtenerPeliculaPorId(pelicula_id);
obtenerFormatos();
obtenerIdiomas();
obtenerFunciones();