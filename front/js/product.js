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
    name.innerText = value.name;

    const price = document.getElementById("price");
    price.innerText = value.price;

    const description = document.getElementById("description");
    description.innerText = value.description;

    const colors = document.getElementById("colors"); // Je importe "colors" depuis le HTML

    value.colors.forEach(function(color) { // Je sélectionne le tableau "colors" dans l'objet "value" et pour chaque color :
        const colors_element = document.createElement("option"); //Je crée une variable "colors_element" qui aura comme balise "option"
        colors_element.value = color; // Dans "colors_element" on rajoute la "value" qui aura comme valeur "color" que l'on importe depuis l'API.
        colors_element.innerText = color; // Je rajoute ce qui s'affiche dans entre les balises "option" qui aura la valeur de "color"
        colors.appendChild(colors_element); // Je rajoute tout ce que j'ai fait dans la boucle en tant qu'enfant du parent "colors".
    })
})

const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", addProductToCart); //Si je clique sur "Ajouter au Panier", éxecute la fonction "addProductToCart"
var colors = document.getElementById("colors");

function redirectionToCart() {
    if (
        window.confirm(
            "Votre produit a été ajouté au panier. Pour le consulter, cliquez sur OK."
        )
    ) {
        window.location.href = "cart.html";
    } else {
        window.location.href = "index.html";
    }
}

function addProductToCart() {

    if (!window.localStorage.getItem("panier")) //Si "panier" n'existe pas dans le localStorage
        window.localStorage.setItem("panier", JSON.stringify([])); //On rajoute la clé "panier" dans le localStorage, dans lequel on crée un tableau en "string" vide dans cette même clé

    let article = { //On crée l'objet "article"
        id: id,
        quantity: parseInt (document.getElementById("quantity").value),
        color: colors.options[colors.selectedIndex].value
    };

    if ( //Si l'article n'est pas vide, est au dessus de 0 et en dessous de 100, on exécute la fonction
        article.color != "" &&
        article.quantity > 0 &&
        article.quantity < 100
    ) {
        const panier = JSON.parse(window.localStorage.getItem("panier")); //On crée la constante "panier" qui va prendre la **clé** "panier" depuis le localStorage et le transformer en Objet
        let listeFinalProduit = [];
        let dejaPresent = false;

        panier.forEach (function (articleExistant) {

            if (article.id == articleExistant.id && article.color == articleExistant.color) {
                articleExistant.quantity = article.quantity + parseInt(articleExistant.quantity);
                listeFinalProduit.push(articleExistant);
                dejaPresent = true;

            } else {
                listeFinalProduit.push(articleExistant);
            }
        })

        if (!dejaPresent) {
            listeFinalProduit.push(article);
        }

        window.localStorage.setItem("panier", JSON.stringify(listeFinalProduit)); //On stocke "panier" dans le localStorage qu'on retransforme son contenu en "string"

        document.getElementById("addToCart").textContent = "Produit ajouté !";
        document.getElementById("addToCart").style.color = "rgb(0, 105, 0";
        redirectionToCart();

    } else {
        alert("Veuillez choisir une couleur et/ou une quantité valide") //Erreur si les conditions de "if" ne sont pas remplies
    }
}