let url = "http://localhost:3000";
let altaCandy = document.getElementById("alta-candy-container");

//Alta de funciones
altaCandy.addEventListener("submit", async(event)=>{
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());

    try{
        let response = await fetch(`${url}/api/candy`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if(response.ok){
            console.log(response);
            
            let result = await response.json();
            console.log(result);
            alert(result.message)       
        }
    }catch(error){
        console.error("Error al enviar los datos: ", error);
        alert("Error al procesar la solicitud");
    }
});

let botonCancelarCreacion = document.getElementById("btn-cancelar-creacion-candy");

botonCancelarCreacion.addEventListener("click", () => {
    if(confirm("¿Estas seguro que queres cancelar la creacion?")) {
        window.location.href = "index.html";
    }
})