let altaPeliculas = document.getElementById("alta-peliculas-container");

//Alta de peliculas
altaPeliculas.addEventListener("submit", async(event)=>{
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());

    try{
        let response = await fetch(`${url}/api/peliculas`,{
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