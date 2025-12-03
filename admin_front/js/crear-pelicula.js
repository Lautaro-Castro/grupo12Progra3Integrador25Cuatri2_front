let altaPeliculas = document.getElementById("alta-peliculas-container");
let url = "http://localhost:3000";

//Alta de peliculas
altaPeliculas.addEventListener("submit", async(event)=>{
    event.preventDefault();

    // Transformamos en objeto FormData los campos del formulario
    let formData = new FormData(event.target);
    // Transformaos a objeto JS el objeto FormData
    let data = Object.fromEntries(formData.entries());
    console.log(data);

    try{
        let response = await fetch(`${url}/api/peliculas`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        console.log("llegue a la linea 21");
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