const item = document.getElementById("item");

var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

fetch(`http://localhost:3000/api/products/${id}`) // On récupère l'ID du produit

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

const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", addProductToCart);
var colors = document.getElementById("colors");

function redirectionToCart() {
    if (
        window.confirm(
            "Votre produit a été ajouté au panier. Pour le consulter, cliquez sur OK."
        )
    ) {
        window.location.href = "cart.html";
    }
}

function addProductToCart() {

    if (!window.localStorage.getItem("panier"))
        window.localStorage.setItem("panier", JSON.stringify([]));

    let article = {
        id: id,
        quantity: document.getElementById("quantity").value,
        color: colors.options[colors.selectedIndex].value
    };

    if (
        article.color != "" &&
        article.quantity > 0 &&
        article.quantity < 100
    ) {
        const panier = JSON.parse(window.localStorage.getItem("panier"));
        panier.push(article);
        window.localStorage.setItem("panier", JSON.stringify(panier));

        document.getElementById("addToCart").textContent = "Produit ajouté !";
        document.getElementById("addToCart").style.color = "rgb(0, 105, 0";
        redirectionToCart();

    } else {
        alert("Veuillez choisir une couleur et/ou une quantité valide")
    }
}