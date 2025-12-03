let url = "http://localhost:3000";
let altaFunciones = document.getElementById("alta-funciones-container");

//Alta de funciones
altaFunciones.addEventListener("submit", async(event)=>{
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());

    try{
        let response = await fetch(`${url}/api/funciones`,{
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