let contenedorCandy = document.getElementById("contenedor-candy");
let botonProductos = document.getElementById("btn-productos-candy");
let botonCombos = document.getElementById("btn-combos");
let filtroNombreOIdCandy = document.getElementById("filtro-nombre-id-candy");
let btnAgregarCandy = document.getElementById("btn-agregar-candy");
let url= "http://localhost:3000";
let esCombo = false;

async function obtenerCandy(esCombo) {
    try{
        let request = esCombo ? `${url}/api/candy?tipo=combo` : `${url}/api/candy?tipo=producto`;
        let response = await fetch(request);
        let data = await response.json();
        let candy = data.payload
        return candy;

    } catch (error) {
        console.error("Error obteniendo candy: ", error);
    }
}

function mostrarCandy(array, esCombo) {
    
    let htmlCandy = ``;
    if(esCombo){
        htmlCandy += `
        <h1 class="titulo-contenedor">Combos</h1>
        <section id="contenedor-candy">`
    }else{
        htmlCandy += `
        <h1 class="titulo-contenedor">Productos</h1>
        <section id="contenedor-candy">`
    }

    array.forEach(candy => {
        htmlCandy += `
            <div class="card-candy">
                <img class="candy-img" src="${candy.imagen_url}" alt="${candy.nombre}">
                <h2>${candy.nombre}</h2>
                <p><strong>Id:</strong> ${candy.id}</p>
                <p><strong>Precio:</strong> $${candy.precio}</p>
                <button class="btn-editar-candy" data-id="${candy.id}">Editar</button>
                <button class="btn-eliminar-candy" data-id="${candy.id}">Eliminar</button>
            </div>`;
    });

    htmlCandy += `</section`;
    contenedorCandy.innerHTML = htmlCandy;
}

//Cargar segun opcion productos / combos
async function cargarCandy(esCombo) {
    candy = await obtenerCandy(esCombo)
    if(validarListaCandy(candy)){
        mostrarCandy(candy, esCombo)
    }
    // ventos editar / eliminar
    document.querySelectorAll('.btn-editar-candy').forEach(boton => {
        boton.addEventListener('click', () => {
            // Obtenemos el id del atributo data-id
            const id = Number(boton.dataset.id); 
            // Redirigimos
            window.location.href = `/editar-candy.html?id=${id}`;
        });
    });

    document.querySelectorAll('.btn-eliminar-candy').forEach(boton => {
        boton.addEventListener('click', () => {
            // Obtenemos el id del atributo data-id
            const id = Number(boton.dataset.id); 
            eliminarCandy(id);
        });
    }); 
}

//Validamos si la lista esta vacia o tiene productos o combos del candy. Si esta vacia lo informamos en pantalla. Se retorna true o false segun lo que corresponda a la validacion.
function validarListaCandy(listaCandy) {
    if (listaCandy.length === 0) {
        contenedorCandy.innerHTML = `
        <div class="card-candy-no-encontrado">
        <h1>No se encontraron productos o combos</h1>
        </div>`;
        return false;
    }
    return true;
}

//capturamos el filtro por id/nombre
filtroNombreOIdCandy.addEventListener("keyup", () => {
    const textoFiltro = filtroNombreOIdCandy.value.toLowerCase().trim();
    const candyFiltrados = candy.filter(p =>  p.nombre.toLowerCase().includes(textoFiltro) || p.id.toString().includes(textoFiltro));
    if(textoFiltro.trim() === "") {
        mostrarCandy(candy, esCombo);
    }else if(validarListaCandy(candyFiltrados)){
        mostrarCandy(candyFiltrados, esCombo);
    }
});

botonProductos.addEventListener("click", () => {
    esCombo = false;
    cargarCandy(esCombo);
});

botonCombos.addEventListener("click", () => {
    esCombo = true;
    cargarCandy(esCombo);
});

// después, para el modal de alta:
btnAgregarCandy.addEventListener("click", () => {
    // TODO: abrir modal de alta de producto/combo
});

/*
    INICIO
*/
async function eliminarCandy(id) {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;

    try {
        let response = await fetch(`${url}/api/candy/${id}`, {
            method: "DELETE"
        });

        let result = await response.json();

        if(response.ok) {
            alert(result.message);
            cargarCandy(esCombo);
        } else {
            console.error("Error: ", result.message);
            alert("No se pudo eliminar el producto");
        }

    } catch (error) { // El catch este, solo atrapa errores de red
        console.error("Error en la solicitud DELETE: ", error);
        alert("Ocurrio un error al eliminar un producto");
    }
}
// boton agregar Candy
btnAgregarCandy.addEventListener("click", () => {
    window.location.href = "crear-candy.html"
})


cargarCandy(esCombo);