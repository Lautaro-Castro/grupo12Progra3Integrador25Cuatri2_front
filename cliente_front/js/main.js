//Se obtiene el contendor html donde iran los productos
let contendorProductos = document.getElementById("contenedor-productos");

//Se crea la url para consumir la api
let url = "http://localhost:3000";

//Funcion para poder consumir la api y traer los productos
async function obtenerProductos() {
    try {
        let response = await fetch(`${url}/productos`);
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
                </div>
        `;
    });

    contendorProductos.innerHTML = htmlProductos;
}

obtenerProductos();