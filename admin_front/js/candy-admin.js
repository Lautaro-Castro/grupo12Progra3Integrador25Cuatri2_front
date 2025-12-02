let contenedorCandy = document.getElementById("contenedor-candy");
let botonProductos = document.getElementById("btn-productos-candy");
let botonCombos = document.getElementById("btn-combos");
let filtroNombreOIdCandy = document.getElementById("filtro-nombre-id-candy");
let btnAgregarCandy = document.getElementById("btn-agregar-candy");

let url= "http://localhost:3000";
let combos = [];
let productos = [];
let opcionSeleccionada = "productos"

async function obtenerProductos() {
    try{
        let response = await fetch(`${url}/api/candy/productos`)
        let data = await response.json();
        return data.payload || [];
    } catch (error) {
        console.error("Error obteniendo productos: ", error);
        return [];
    }
}

function mostrarProductos(array) {
    let htmlProductos = `
        <h1 class="titulo-contenedor">Productos</h1>
        <section id="contenedor-productos">`;

    array.forEach(prod => {
        htmlProductos += `
            <div class="card-producto">
                <img class="producto-img" src="${prod.imagen_url}" alt="${prod.nombre}">
                <h2>${prod.nombre}</h2>
                <p><strong>Id:</strong> ${prod.id}</p>
                <p><strong>Precio:</strong> $${prod.precio}</p>
                <button class="btn-editar-producto" data-id="${prod.id}">Editar</button>
                <button class="btn-eliminar-producto" data-id="${prod.id}">Eliminar</button>
            </div>`;
    });

    htmlProductos += `</section`;
    contenedorCandy.innerHTML = htmlProductos;
}
/*
==================
    COMBOS 
==================
    */
async function obtenerCombos() {
    try {
        let response = await fetch(`${url}/api/candy/combos`);
        let data = await response.json();
        return data.payload || [];
    } catch (error) {
        console.error("Error obteniendo combos: ", error);
        return [];
    }
}

function mostrarCombos(array) {
    let htmlCombos = `
        <h1 class="titulo-contenedor">Combos</h1>
        <section id="contenedor-combos">`;

    array.forEach(combo => {
        htmlCombos += `
            <div class="card-producto">
                <img class="producto-img" src="${combo.imagen_url}" alt="${combo.nombre}">
                <h2>${combo.nombre}</h2>
                <p><strong>Id:</strong> ${combo.id}</p>
                <p><strong>Precio:</strong> $${combo.precio}</p>
                <button class="btn-editar-combo" data-id="${combo.id}">Editar</button>
                <button class="btn-eliminar-combo" data-id="${combo.id}">Eliminar</button>
            </div>
        `;        
    });

    htmlCombos += `</section>`;
    contenedorCandy.innerHTML = htmlCombos;

}


//Cargar segun opcion productos / combos

async function cargarCandy(opcionSeleccionada) {
    if (opcionSeleccionada === "productos") {
        productos = await obtenerProductos();
        validarListaCandy(productos);
    } else {
        combos = await obtenerCombos();
        validarListaCandy(combos);
    }
}
//capturamos el filtro por id/nombre
filtroNombreOIdCandy.addEventListener("keyup", () => {
    const textoFiltro = filtroNombreOIdCandy.value.toLowerCase().trim();

    if (opcionSeleccionada === "productos") {
        const filtrados = productos.filter(p =>
            p.nombre.toLowerCase().includes(textoFiltro) ||
            p.id.toString().includes(textoFiltro)
        );
        validarListaCandy(filtrados);
    } else {
        const filtrados = combos.filter(c =>
            c.nombre.toLowerCase().includes(textoFiltro) ||
            c.id.toString().includes(textoFiltro)
        );
        validarListaCandy(filtrados);
    }
});

function validarListaCandy(lista) {
    if (!lista || lista.length === 0) {
        contenedorCandy.innerHTML = `
            <div class="card-peliculas-no-encontradas">
                <h1>No se encontraron resultados</h1>
            </div>`;
        return;
    }

    if (opcionSeleccionada === "productos") {
        mostrarProductos(lista);
    } else {
        mostrarCombos(lista);
    }
}


botonProductos.addEventListener("click", () => {
    opcionSeleccionada = "productos";
    cargarCandy(opcionSeleccionada);
});

botonCombos.addEventListener("click", () => {
    opcionSeleccionada = "combos";
    cargarCandy(opcionSeleccionada);
});

// después, para el modal de alta:
btnAgregarCandy.addEventListener("click", () => {
    // TODO: abrir modal de alta de producto/combo
});

/*
    INICIO
*/
cargarCandy(opcionSeleccionada);