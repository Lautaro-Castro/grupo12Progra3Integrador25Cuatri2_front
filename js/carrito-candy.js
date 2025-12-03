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
    let existente = carrito.find(item => item.nombre === producto.nombre);

    if(existente){
        existente.cantidad + cantidad > 3 ? alert("No se pudo agregar al carrito! La cantidad maxima por producto es 3.") : existente.cantidad +=cantidad;
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

// Elimina un solo producto por nombre
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
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
                <button class="btn-eliminar-item" data-id="${item.nombre}" title="Eliminar"> 
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
            const nombre = boton.dataset.id;
            console.log(nombre);
            eliminarDelCarrito(nombre);
        });
    });
    actualizarBotonFinalizarCompra();
    actualizarVisibilidadCarrito();
}

function actualizarBotonFinalizarCompra(){
    if (!botonFinalizarCompra) return;  
    
    if(carrito.length === 0){
        botonFinalizarCompra.disabled = true;
    }
    else
    {
      botonFinalizarCompra.disabled = false;  
    }
}

function actualizarVisibilidadCarrito() {
    const carritoBox = document.getElementById("carrito-box");

    // Si la pagina no tiene carrito-box, no hacemos nada
    if (!carritoBox) return;

    // Ocultar / mostrar segun si hay productos
    if (carrito.length === 0) {
        carritoBox.style.display = "none";
    } else {
        carritoBox.style.display = "block";
    }
}

renderizarCarrito();
actualizarBotonFinalizarCompra();

// Evento del botón "Vaciar carrito"
const btnVaciar = document.getElementById("btn-vaciar-carrito");
if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
}

botonFinalizarCompra.addEventListener("click", async () => {
    if(window.location.pathname.includes('comprar-entrada')){
        window.location.href = "candy.html";
    }else {
        let validacion = await actualizarButacasDisponibles();
        if(validacion){
            alert("¡Compra finalizada exitosamente!");
            window.location.href = "standby.html";
        }
    }
})

async function actualizarButacasDisponibles() {
    try {

        let funcion = carrito.find(item => item.butacas_disponibles !== undefined);
        if(!funcion){
            return true;
        }
        const nuevasButacasDisponibles = funcion.butacas_disponibles - funcion. cantidad;
        const funcionId = funcion.funcion_id;
        const data = {"id": funcionId, "butacas_disponibles": nuevasButacasDisponibles}

        if(funcion){
            let url = "http://localhost:3000";

            let response = await fetch(`${url}/api/funciones/${funcionId}/butacasDisponibles`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }); 
        }
        return true;
    } catch (error) {
        console.log(response);
        alert("⚠️ Error al realizar la compra. Consulte con el staff del cine.");
        return false;
    }
    
}

