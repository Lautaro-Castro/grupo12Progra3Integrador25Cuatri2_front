function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// pelicula debe tener: id, nombre, precio
function agregarPeliculaAlCarrito(pelicula, cantidad) {
    if (cantidad <= 0) {
        alert("Debe seleccionar al menos 1 entrada");
        return;
    }
    // Busco si ya existe esa pelicula en el carrito
    let existente = carrito.find(item => item.id === pelicula.id);

    if (existente) {
        if (existente.cantidad + cantidad > 3) {
            alert("No se pudo agregar al carrito! La cantidad maxima por pelicula es 3.");
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