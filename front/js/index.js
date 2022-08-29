const items = document.getElementById("items"); //On importe "items" depuis le HTML

fetch("http://localhost:3000/api/products") //On importe les données de l'API depuis le serveur node

.then(function(res) { //Si et seulement si on arrive à importer l'API, alors on stocke toutes les données dans "res.json" qui sera notre base de données
    if (res.ok) {
        return res.json();
    }
})

.then(function(values) { //Si et seulement si function(res) est appliquée, alors on éxecute cette fonction qui a pour valeur (values). On refait le HTML dans le JS et on va le dynamiser.

    values.forEach(function(value) { //Chaque "ligne de donnée" dans l'API importée est appelé "values" et pour chaque "value" dans "values" :
        const produit = document.createElement("a"); //On crée un élément HTML qui a pour balise "a" qu'on va insérer dans la variable "produit"
        produit.href = `./product.html?id=${value._id}`; //Dans la variable "produit", on rajoute un href qui sera le chemin de la donnée que l'on veut récupérer avec une ID dynamique

        const produit_article = document.createElement("article");
        produit.appendChild(produit_article); //On déclare que dans le parent "produit", on veut que "produit_article" soit son enfant.

        const produit_img = document.createElement("img");
        produit_img.src = value.imageUrl; //Dans "produit_img" dans "img" on rajoute le lien "src" qui aura comme valeur "imageUrl" que l'on importe depuis l'API
        produit_img.alt = value.altTxt; //Dans "produit_img" dans "img" on rajoute le "alt" qui aura comme valeur "altTxt" que l'on importe depuis l'API
        produit_article.appendChild(produit_img);

        const produit_name = document.createElement("h3");
        produit_name.classList.add("productName"); //Dans "produit_name", on rajoute la classe "productName" de notre HTML.
        produit_name.innerHTML = value.name; //Dans la classe "productName", on rajoute le nom du canapé importée depuis l'API
        produit_article.appendChild(produit_name);
        
        const produit_description = document.createElement("p");
        produit_description.classList.add("productDescription");
        produit_description.innerHTML = value.description;
        produit_article.appendChild(produit_description);

        items.appendChild(produit); //Une fois que notre produit est créé, on l'ajoute dans les enfants de l'élément "items"
        
        console.log(values);
    }) 
})

.catch(function(err) {
    console.error(err) //Si le js comporte une erreur, il l'affiche dans "console" dans Inspecter.
});