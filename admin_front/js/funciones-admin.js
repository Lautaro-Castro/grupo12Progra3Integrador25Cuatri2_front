let contenedorFunciones = document.getElementById("contenedor-funciones-admin");
let filtroPelicula = document.getElementById("filtro-pelicula");
let filtroFecha = document.getElementById("filtro-fecha");
let btnAgregarFuncion = document.getElementById("btn-agregar-funcion");

let modalFuncion = document.getElementById("modal-funcion");
let tituloFormFuncion = document.getElementById("titulo-form-funcion");
let formFuncion = document.getElementById("form-funcion");
let btnCancelarFuncion = document.getElementById("btn-cancelar-funcion");

let url = "http://localhost:3000";
let funciones = [];
let mostrandoSoloActivas = true;
let funcionEditando = null; // si es null => alta, si tiene objeto => edición

/* ======================
   OBTENER FUNCIONES
====================== */
async function obtenerFunciones() {
    try {
        let response = await fetch(`${url}/api/funciones`);
        let data = await response.json();
        funciones = data.payload;
        aplicarFiltrosYMostrar();
    } catch (error) {
        console.error("Error obteniendo funciones:", error);
    }
}   

/* ======================
   RENDERIZAR FUNCIONES
====================== */
function mostrarFunciones(lista) {
    if (!lista || lista.length === 0) {
        contenedorFunciones.innerHTML = `
            <div class="card-peliculas-no-encontradas">
                <h1>No se encontraron funciones</h1>
            </div>`;
        return;
    }

    let html = `
        <h1 class="titulo-contenedor">Funciones</h1>
        <section id="contenedor-funciones-lista">
    `;

    lista.forEach(f => {
        const fecha = f.fecha?.split("T")[0]?.split("-").reverse().join("/") || "";
        let hora = f.hora;
        if (hora && hora.includes(":")) {
            let partes = hora.split(":");
            partes.pop();
            hora = partes.join(":");
        }

        html += `
            <div class="card-funcion-admin">
                <p><strong>Id:</strong> ${f.id}</p>
                <p><strong>Película:</strong> ${f.pelicula_nombre || f.pelicula_id}</p>
                <p><strong>Formato:</strong> ${f.formato || f.formato_id}</p>
                <p><strong>Idioma:</strong> ${f.idioma || f.idioma_id}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Hora:</strong> ${hora}</p>
                <p><strong>Sala:</strong> ${f.sala}</p>
                <p><strong>Butacas disp.:</strong> ${f.butacas_disponibles}</p>
                <p><strong>Precio:</strong> $${f.precio}</p>
                <p><strong>Activa:</strong> ${f.activa ? "Sí" : "No"}</p>

                <button class="btn-editar-funcion" data-id="${f.id}">Editar</button>
                <button class="btn-eliminar-funcion" data-id="${f.id}">Eliminar</button>
            </div>
        `;
    });

    html += `</section>`;
    contenedorFunciones.innerHTML = html;

    // eventos editar / eliminar
    document.querySelectorAll(".btn-editar-funcion").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const func = funciones.find(f => f.id === id);
            abrirModalFuncion(func);
        });
    });

    document.querySelectorAll(".btn-eliminar-funcion").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            eliminarFuncion(id);
        });
    });
}

/* ======================
   FILTROS
====================== */
function aplicarFiltrosYMostrar() {
    let lista = [...funciones];

    // filtro de activas
    if (mostrandoSoloActivas) {
        lista = lista.filter(f => f.activa);
    }

    // filtro por pelicula id o nombre
    const textoPeli = filtroPelicula.value.toLowerCase().trim();
    if (textoPeli) {
        lista = lista.filter(f =>
            (f.pelicula_nombre && f.pelicula_nombre.toLowerCase().includes(textoPeli)) ||
            f.pelicula_id?.toString().includes(textoPeli)
        );
    }

    // filtro por fecha
    const fechaFiltro = filtroFecha.value;
    if (fechaFiltro) {
        lista = lista.filter(f => f.fecha && f.fecha.startsWith(fechaFiltro));
    }

    mostrarFunciones(lista);
}

filtroPelicula.addEventListener("keyup", aplicarFiltrosYMostrar);
filtroFecha.addEventListener("change", aplicarFiltrosYMostrar);


/* ======================
   MODAL ALTA / EDICIÓN
====================== */
function abrirModalFuncion(funcion = null) {
    funcionEditando = funcion;

    if (funcionEditando) {
        tituloFormFuncion.textContent = "Editar función";

        document.getElementById("pelicula-id").value = funcionEditando.pelicula_id;
        document.getElementById("formato-id").value = funcionEditando.formato_id;
        document.getElementById("idioma-id").value = funcionEditando.idioma_id;
        document.getElementById("precio").value = funcionEditando.precio;
        document.getElementById("fecha").value = funcionEditando.fecha?.split("T")[0] || "";
        document.getElementById("hora").value = funcionEditando.hora?.slice(0,5) || "";
        document.getElementById("sala").value = funcionEditando.sala;
        document.getElementById("butacas").value = funcionEditando.butacas_disponibles;
    } else {
        tituloFormFuncion.textContent = "Agregar función";
        formFuncion.reset();
    }

    modalFuncion.style.display = "flex";
}

btnAgregarFuncion.addEventListener("click", () => abrirModalFuncion());

btnCancelarFuncion.addEventListener("click", () => {
    modalFuncion.style.display = "none";
    funcionEditando = null;
});

/* ======================
   GUARDAR (POST / PUT)
====================== */
formFuncion.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        pelicula_id: Number(document.getElementById("pelicula-id").value),
        formato_id: Number(document.getElementById("formato-id").value),
        idioma_id: Number(document.getElementById("idioma-id").value),
        precio: Number(document.getElementById("precio").value),
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        sala: Number(document.getElementById("sala").value),
        butacas_disponibles: Number(document.getElementById("butacas").value)
    };

    try {
        let response;
        if (funcionEditando) {
            // PUT /api/funciones/:id
            response = await fetch(`${url}/api/funciones/${funcionEditando.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } else {
            // POST /api/funciones
            response = await fetch(`${url}/api/funciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            alert("Error guardando la función");
            return;
        }

        modalFuncion.style.display = "none";
        funcionEditando = null;
        await obtenerFunciones();  // refresco lista
    } catch (error) {
        console.error("Error guardando función:", error);
        alert("Ocurrió un error");
    }
});

/* ======================
   ELIMINAR (DELETE)
====================== */
async function eliminarFuncion(id) {
    if (!confirm("¿Seguro que querés eliminar esta función?")) return;

    try {
        const response = await fetch(`${url}/api/funciones/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            alert("Error eliminando la función");
            return;
        }

        await obtenerFunciones();
    } catch (error) {
        console.error("Error eliminando función:", error);
        alert("Ocurrió un error");
    }
}

/* ======================
   INICIO
====================== */
obtenerFunciones();