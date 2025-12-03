const params = new URLSearchParams(window.location.search);
const id = params.get("id");
let updateFormContainer = document.getElementById("updateFormContainer");

// Para usar la candy en otras funciones
let candySeleccionado = null;
let tipos = null;

//Se crea la url para consumir la api
let url = "http://localhost:3000";

/*===============
    CANDY
===============*/

//Funcion para poder consumir la api y traer la candy por id
async function obtenerCandyPorId(id) {
    try {
        let response = await fetch(`${url}/api/candy/${id}`);
    
        let data = await response.json();

        candySeleccionado = data.payload;
        
        if(candySeleccionado){
            crearFormulario(candySeleccionado);
        }
    
    } catch (error) {
        console.error("Error obteniendo candy por id: ", error);
    }
}

async function crearFormulario(candy) {

    let updateFormHTML = `
    <form id="editar-candy-container" class="form-alta">

            <input type="hidden" name="id" id="idCandy" value="${candy.id}">

            <label for="nombre-candy">Nombre</label>
            <input type="text" name="nombre" id="nombre-candy" value="${candy.nombre}" required>
    
            <label for="descripcion-candy">Descripcion</label>
            <input type="text" name="descripcion" id="descripcion-candy" value="${candy.descripcion}" required>
            
            <label for="precio-candy">Precio</label>
            <input name="precio" id="precio-candy" value="${candy.precio}">

            <label for="img-candy">Imagen</label>
            <input type="text" name="imagen_url" id="img-candy" value="${candy.imagen_url}" required>

            <label for="activo-candy">Activo</label>
            <select type="number" name="activo" id="activo-candy" value="${candy.activo}" required>
                <option value="1">Si</option>
                <option value="0">No</option>
            </select>

            <select type="text" name="tipo" id="activo-candy" value="${candy.tipo}" required>
                <option value="producto">Producto</option>
                <option value="combo">Combo</option>
            </select>

            <input type="submit" value="Actualizar candy">
        </form>
        <button id="btn-cancelar-edicion-candy">Cancelar</button>
    `;

    updateFormContainer.innerHTML = updateFormHTML;
    let botonCancelarEdicion = document.getElementById("btn-cancelar-edicion-candy");

    botonCancelarEdicion.addEventListener("click", () => {
    if(confirm("¿Estas seguro que queres cancelar la edicion?")) {
        window.location.href = "candy.html";
    }
    })

    updateFormContainer.addEventListener("submit", event => {
        actualizarCandy(event);
    });
}


async function actualizarCandy(event) {
    event.preventDefault();
    event.stopPropagation();

    let formData = new FormData(event.target); // Le pasamos el formulario dinamico de antes al objeto FormData para obtener los datos del nuevo formulario de actualizacion

    let data = Object.fromEntries(formData.entries());

    try {
        let response = await fetch(`${url}/api/candy/${id}`, {
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
        alert("Error actualizando candy");
    }
    
    window.location.href = "candy.html";
}

obtenerCandyPorId(id);