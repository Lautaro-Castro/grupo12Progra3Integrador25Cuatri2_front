const params = new URLSearchParams(window.location.search);
const id = params.get("id");
let updateFormContainer = document.getElementById("updateFormContainer");

// Para usar la pelicula en otras funciones
let funcionSeleccionada = null;

//Se crea la url para consumir la api
let url = "http://localhost:3000";

/*===============
    FUNCION
===============*/

//Funcion para poder consumir la api y traer la funcion por id
async function obtenerFuncionPorId(id) {
    try {
        let response = await fetch(`${url}/api/funciones/${id}`);
    
        let data = await response.json();

        funcionSeleccionada = data.payload;
        
        if(funcionSeleccionada){
            crearFormulario(funcionSeleccionada);
        }
    
    } catch (error) {
        console.error("Error obteniendo pelicula por id: ", error);
    }
}

async function crearFormulario(funcion) {

    const fechaFuncion = funcion.fecha ? funcion.fecha.split('T')[0] : '';
    const horaFuncion = funcion.hora ? funcion.hora.slice(0, 5) : '';
    let updateFormHTML = `
    <!-- Formulario para editar funciones -->
    <form id="editar-funcion-container" class="form-alta">
            <label for="pelicula_id">Pelicula</label>
            <input type="number" name="pelicula_id" id="pelicula_id" value="${funcion.pelicula_id}" required>

            <label for="formato-id">Formato</label>
            <input type="number" name="formato_id" id="formato-id" value="${funcion.formato_id}" required>
    
            <label for="idioma-id">Idioma</label>
            <input type="number" name="idioma_id" id="idioma-id" value="${funcion.idioma_id}" required>
    
            <label for="sala-func">Sala</label>
            <input type="number" name="sala" id="sala-func" value="${funcion.sala}" required>
    
            <label for="fecha-func">Fecha </label>
            <input type="date" name="fecha" id="fecha-func" value="${fechaFuncion}" required>

            <label for="hora-func">Hora</label>
            <input type="time" name="hora" id="hora-func" value="${horaFuncion}" required>

            <label for="butacas-func">Butacas diponibles</label>
            <input type="number" name="butacas_disponibles" id="butacas-func" value="${funcion.butacas_disponibles}" required>

            <label for="activa-funcion">Activa</label>
            <input type="number" name="activa" id="activa-funcion" value="${funcion.activa}" required>
            
            <input type="submit" value="Editar funcion">
        </form>
        <button id="btn-cancelar-edicion-funcion">Cancelar</button>
    `;

    updateFormContainer.innerHTML = updateFormHTML;
    let botonCancelarEdicion = document.getElementById("btn-cancelar-edicion-funcion");

    botonCancelarEdicion.addEventListener("click", () => {
    if(confirm("¿Estas seguro que queres cancelar la edicion?")) {
        window.location.href = "funciones.html";
    }
    })

    updateFormContainer.addEventListener("submit", event => {
        actualizarFuncion(event);
    });
}


async function actualizarFuncion(event) {
    event.preventDefault();
    event.stopPropagation();

    let formData = new FormData(event.target); // Le pasamos el formulario dinamico de antes al objeto FormData para obtener los datos del nuevo formulario de actualizacion

    let data = Object.fromEntries(formData.entries());

    try {
        let response = await fetch(`${url}/api/funciones/${id}`, {
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
        alert("Error actualizando funcion");
    }

    window.location.href = "funciones.html";
}

obtenerFuncionPorId(id);