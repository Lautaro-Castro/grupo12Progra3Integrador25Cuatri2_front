/*
 ===============
    Carrito 
 ===============
 */

 //Obtengo el boton de finalizar compra
const botonFinalizarCompra = document.getElementById("btn-finalizar-compra");

//verifico que no sea null y tenga un array vacio
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

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
        existente.cantidad + cantidad === 3 ? alert("No se pudo agregar al carrito! La cantidad maxima por producto es 3.") : existente.cantidad +=cantidad;
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

renderizarCarrito();
actualizarBotonFinalizarCompra();

// Evento del botón "Vaciar carrito"
const btnVaciar = document.getElementById("btn-vaciar-carrito");
if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
}