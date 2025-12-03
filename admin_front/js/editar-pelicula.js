const params = new URLSearchParams(window.location.search);
const id = params.get("id");
let updateFormContainer = document.getElementById("updateFormContainer");

// Para usar la pelicula en otras funciones
let peliculaSeleccionada = null;

//Se crea la url para consumir la api
let url = "http://localhost:3000";

/*===============
    PELICULA
===============*/

//Funcion para poder consumir la api y traer la pelicula por id
async function obtenerPeliculaPorId(id) {
    try {
        let response = await fetch(`${url}/api/peliculas/${id}`);
    
        let data = await response.json();

        peliculaSeleccionada = data.payload;
        
        if(peliculaSeleccionada){
            crearFormulario(peliculaSeleccionada);
        }
    
    } catch (error) {
        console.error("Error obteniendo pelicula por id: ", error);
    }
}

async function crearFormulario(pelicula) {

    const fechaEstreno = pelicula.fecha_estreno ? pelicula.fecha_estreno.split('T')[0] : '';
    const fechaFinCartelera = pelicula.fecha_fin_cartelera ? pelicula.fecha_fin_cartelera.split('T')[0] : '';

    let updateFormHTML = `
    <form id="editar-pelicula-container" class="form-alta">

            <input type="hidden" name="id" id="idPeli" value="${pelicula.id}">

            <label for="nombre-peli">Nombre</label>
            <input type="text" name="nombre" id="nombre-peli" value="${pelicula.nombre}" required>

            <label for="sinopsis-peli">Sinopsis</label>
            <textarea name="sinopsis" id="sinopsis-peli" rows="4" style="width: 100%; padding: 10px; margin-bottom: 20px;" required>${pelicula.sinopsis}</textarea>
    
            <label for="duracion-peli">Duracion</label>
            <input type="number" name="duracion" id="duracion-peli" value="${pelicula.duracion}" required>
    
            <label for="clasificacion-peli">Clasificacion</label>
            <input type="text" name="clasificacion" id="clasificacion-peli" value="${pelicula.clasificacion}" required>
    
            <label for="fecha-estreno-peli">Fecha de estreno</label>
            <input type="date" name="fecha_estreno" id="fecha-estreno-peli" value="${fechaEstreno}" required>

            <label for="fecha-fin-cartelera-peli">Fecha de fin de cartelera</label>
            <input type="date" name="fecha_fin_cartelera" id="fecha-fin-cartelera-peli" value=${fechaFinCartelera} required>

            <label for="poster-img-peli">Imagen</label>
            <input type="text" name="poster_url" id="poster-img-peli" value="${pelicula.poster_url}" required>

            <label for="Distribuidor-peli">Distribuidor</label>
            <input type="text" name="distribuidor" id="Distribuidor-peli" value="${pelicula.distribuidor}" required >

            <label for="director-peli">Director</label>
            <input type="text" name="director" id="director-peli" value="${pelicula.director}" >

            <label for="actores-peli">Actores</label>
            <textarea name="actores" id="actores-peli" rows="3" style="resize: vertical;">${pelicula.actores}</textarea>

            <label for="activa-peli">Activa</label>
            <select type="number" name="activa" id="activa-peli" value="${pelicula.activa}" required>
                <option value="1">Si</option>
                <option value="0">No</option>
            </select>
            <input type="submit" value="Actualizar pelicula">
        </form>
        <button id="btn-cancelar-edicion-pelicula">Cancelar</button>
    `;

    updateFormContainer.innerHTML = updateFormHTML;
    let botonCancelarEdicion = document.getElementById("btn-cancelar-edicion-pelicula");

    botonCancelarEdicion.addEventListener("click", () => {
    if(confirm("¿Estas seguro que queres cancelar la edicion?")) {
        window.location.href = "index.html";
    }
    })

    updateFormContainer.addEventListener("submit", event => {
        actualizarPelicula(event);
    });
}


async function actualizarPelicula(event) {
    event.preventDefault();
    event.stopPropagation();

    let formData = new FormData(event.target); // Le pasamos el formulario dinamico de antes al objeto FormData para obtener los datos del nuevo formulario de actualizacion

    let data = Object.fromEntries(formData.entries());

    try {
        console.log("entro al try")
        let response = await fetch(`${url}/api/peliculas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if(response.ok) {
            console.log(result.message);
            alert(result.message);
        } else {
            console.log(result.message);
            alert(result.message);
        }

    } catch (error) {
        alert("Error actualizando pelicula");
    }

    window.location.href = "index.html";
}

obtenerPeliculaPorId(id);