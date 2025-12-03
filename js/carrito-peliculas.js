function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// pelicula debe tener: id, nombre, precio
function agregarPeliculaAlCarrito(pelicula, cantidad) {

    //Valdiamos que se agregue una funcion nueva o la misma que ya esta en el carrito
    if(!validarMismaFuncion(pelicula)){
        return;
    }

    if (cantidad <= 0) {
        alert("Debe seleccionar al menos 1 entrada");
        return;
    }
    // Busco si ya existe esa pelicula en el carrito
    let existente = carrito.find(item => item.id === pelicula.id);

    if (existente) {
        if (existente.cantidad + cantidad > pelicula.butacas_disponibles) {
            alert("No se pudo agregar al carrito! No hay butacas disponibles para la cantidad solicitada.");
            return;
        }
        existente.cantidad += cantidad;
    } else {
        carrito.push({
            ...pelicula,      // id, nombre, precio
            cantidad: cantidad
        });
    }

    guardarCarrito();

    //verifica que estemos en una pag que tenga el carrito y lo actualice
    if (typeof renderizarCarrito === "function") {
        renderizarCarrito();
    }
    if (typeof actualizarBotonFinalizarCompra === "function") {
        actualizarBotonFinalizarCompra();
    }

    // Mostrar carrito si hay productos
    const carritoBox = document.getElementById("carrito-box");
        if (carritoBox && carrito.length > 0) {
            carritoBox.style.display = "block";
    }
}


function validarMismaFuncion(pelicula){

    //Revisamos si ya hay una entrada agregada al carrito (validamos por funcion_id !== undefined para filtrar los candy)
    const entradaExistente = carrito.find(item => item.funcion_id !== undefined); 

    //Si no hay entradaExistente retornamos true porque es seguro agregar la entrada
    if (!entradaExistente) {
        return true; 
    }

    if (entradaExistente.funcion_id !== pelicula.funcion_id) {
        alert("⚠️ ¡Atencion! Ya estas comprando entradas para otra funcion.\nFinaliza la compra actual para adquirir entradas para otras funciones.");
        return false;
    }else{
        return true;
    }
}