//Se obtienen los contendores html donde iran los productos y los combos
let contendorProductos = document.getElementById("contenedor-productos");
let contenedorCombos = document.getElementById("contenedor-combos");


//Se crea la url para consumir la api
let url = "http://localhost:3000";
    
//Funcion para poder consumir la api y traer los productos
async function obtenerProductos() {
    try {
        let response = await fetch(`${url}/api/candy?tipo=producto`);
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
                candy_id: prod.id,
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
        let response = await fetch(`${url}/api/candy?tipo=combo`);
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

obtenerProductos();
obtenerCombos();