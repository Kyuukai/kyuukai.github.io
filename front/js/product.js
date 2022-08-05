const item = document.getElementById("item");

var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

fetch(`http://localhost:3000/api/products/${id}`)

.then(function(res) { 
    if (res.ok) {
        return res.json();
    }
})

.then(function(value) {
    console.log(value);

    const image = document.querySelector(".item__img > img");
    image.src = value.imageUrl;
    image.alt = value.altTxt;

    const name = document.getElementById("title");
    name.innerHTML = value.name;

    const price = document.getElementById("price");
    price.innerHTML = value.price;

    const description = document.getElementById("description");
    description.innerHTML = value.description;

    const colors = document.getElementById("colors"); // Je importe "colors" depuis le HTML

    value.colors.forEach(function(color) { // Je sélectionne le tableau "colors" dans l'objet "value" et pour chaque color :
        const colors_element = document.createElement("option"); //Je crée une variable "colors_element" qui aura comme balise "option"
        colors_element.value = color; // Dans "colors_element" on rajoute la "value" qui aura comme valeur "color" que l'on importe depuis l'API.
        colors_element.innerHTML = color; // Je rajoute ce qui s'affiche dans entre les balises "option" qui aura la valeur de "color"
        colors.appendChild(colors_element); // Je rajoute tout ce que j'ai fait dans la boucle en tant qu'enfant du parent "colors".
    })
})