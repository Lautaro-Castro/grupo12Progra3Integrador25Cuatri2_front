//Se obtienen los contendores html donde iran los productos y los combos
let contendorProductos = document.getElementById("contenedor-productos");
let contenedorCombos = document.getElementById("contenedor-combos");

//Obtengo el boton de finalizar compra
const botonFinalizarCompra = document.getElementById("btn-finalizar-compra");

//verifico que no sea null y tenga un array vacio
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//Se crea la url para consumir la api
let url = "http://localhost:3000";
    
//Funcion para poder consumir la api y traer los productos
async function obtenerProductos() {
    try {
        let response = await fetch(`${url}/api/candy/productos`);
        console.log(response);
        console.log(`Solicitud fetch `)
    
        let data = await response.json();
        console.log(data);
        
        let productos = data.payload;
        console.log(productos);
        
        mostrarProductos(productos);
    
    } catch (error) {
        console.error("Error obteniendo productos: ", error);
    }
}


//Funcion para poder mostrar en pantalla los productos que trajimos de la BD
function mostrarProductos(array){
    let htmlProductos = "";
    array.forEach(prod => {
        htmlProductos += `
                <div class="card-producto">
                    <img class="producto-img" src="${prod.imagen_url}" alt="${prod.nombre}">
                    <h2>${prod.nombre}</h2>
                    <p>${prod.descripcion}
                    <br><strong>$${prod.precio}</strong></p>
                    <div class="fila-input">
                        <label for="cantidad-funcion-${prod.id}"><strong>Cantidad:</strong></label>
                        <input type="number" id="cantidad-combos-${prod.id}" min="0" max="3" value="0">
                    </div>
                    <button id="agregar-combo-${prod.id}">Agregar</button>
                </div>
        `;
    });

    contendorProductos.innerHTML = htmlProductos;

     array.forEach(prod => {
        let boton = document.getElementById(`agregar-combo-${prod.id}`);
        let inputCantidad = document.getElementById(`cantidad-combos-${prod.id}`);

        boton.addEventListener("click", () => {
            const cantidad = Number(inputCantidad.value);

            const producto = {
                id: prod.id,
                nombre: prod.nombre,
                precio: prod.precio,
                imagen: prod.imagen_url
            };

            agregarAlCarrito(producto, cantidad);
        });
    });

}

async function obtenerCombos() {
    try {
        let response = await fetch(`${url}/api/candy/combos`);
        console.log(response);
        console.log(`Solicitud fetch `)
    
        let data = await response.json();
        console.log(data);
        
        let combos = data.payload;
        console.log(combos);
        
        mostrarCombos(combos);
    
    } catch (error) {
        console.error("Error obteniendo combos: ", error);
    }
}

function mostrarCombos(array){
    let htmlCombos = "";
    array.forEach(combo => {
        htmlCombos += `
                    <div class="card-producto">
                    <img class="producto-img" src="${combo.imagen_url}" alt="${combo.nombre}">
                    <h2>${combo.nombre}</h2>
                    <p>${combo.descripcion}
                    <br><strong>$${combo.precio}</strong></p>
                    <div class="fila-input">
                        <label for="cantidad-funcion-${combo.id}"><strong>Cantidad:</strong></label>
                        <input type="number" id="cantidad-combos-${combo.id}" min="0" max="3" value="0">
                    </div>
                    <button id="agregar-combo-${combo.id}">Agregar</button>
                </div>
        `;
    });

    contenedorCombos.innerHTML = htmlCombos;
    array.forEach(combo => {
    let boton = document.getElementById(`agregar-combo-${combo.id}`);
    let inputCantidad = document.getElementById(`cantidad-combos-${combo.id}`);

    boton.addEventListener("click", () => {
        const cantidad = Number(inputCantidad.value);

        const producto = {
            id: combo.id,
            nombre: combo.nombre,
            precio: combo.precio,
            imagen: combo.imagen_url
        };

        agregarAlCarrito(producto, cantidad);
    });
});
}

/*
 ===============
    Carrito 
 ===============
 */
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto, cantidad) {
    if (cantidad <= 0){
        alert("Debe seleccionar una cantidad mayor a 0");
        return;
    }
    let existente = carrito.find(item => item.id === producto.id);

    if(existente){
        existente.cantidad === 3 ? alert("No se pudo agregar al carrito! La cantidad maxima por producto es 3.") : existente.cantidad +=cantidad;
    }
    else{
        carrito.push({
            ...producto,
            cantidad:cantidad
        });
    }
    guardarCarrito()
    renderizarCarrito();
}

//Vacia todo el carrito
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
}

// Elimina un solo producto por id
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderizarCarrito();
}

function renderizarCarrito(){
    let contenedor = document.getElementById("carrito-items");
    let totalHTML = document.getElementById("carrito-total");

    if (!contenedor || !totalHTML) return;

    if(carrito.length === 0){
        contenedor.innerHTML = "<p>El carrito esta vacio</p>";
        totalHTML.innerHTML = "<strong>Total: $0 </strong>";
        actualizarBotonFinalizarCompra();
        return;
    }

    let html = "";
    let total =0;

    carrito.forEach(item => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;

        html +=`
            <div class="carrito-item">
                <div>
                    <p>${item.nombre} x ${item.cantidad}</p>
                    <p>$${subtotal}</p>
                </div>
                <button class="btn-eliminar-item" data-id="${item.id}" title="Eliminar"> 
                x
                </button>
            </div>
        `;
    });
    contenedor.innerHTML = html;
    totalHTML.innerHTML = `<strong>Total: $${total}</strong>`;

    const botonesEliminar = document.querySelectorAll(".btn-eliminar-item");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = Number(boton.dataset.id);
            eliminarDelCarrito(id);
        });
    });
    actualizarBotonFinalizarCompra();
}

function actualizarBotonFinalizarCompra(){
    if(carrito.length === 0){
        botonFinalizarCompra.disabled = true;
    }
    else
    {
      botonFinalizarCompra.disabled = false;  
    }
}

obtenerProductos();
obtenerCombos();
renderizarCarrito();
actualizarBotonFinalizarCompra();

// Evento del botón "Vaciar carrito"
const btnVaciar = document.getElementById("btn-vaciar-carrito");
if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
}