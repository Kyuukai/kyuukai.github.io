draw_articles(); // J'initialise le panier dès qu'on arrive sur la page
majPrixQty(); // J'exécute la fonction pour afficher le prix total des produits

function draw_articles() { // Fonction qui me permet de créer tout le HTML et d'importer les données depuis l'API pour tout les produits.

  const panier = JSON.parse(localStorage.getItem("panier"));
  const panierProduit = document.getElementById("cart__items");
  panierProduit.innerHTML = "";

  console.log(panier);

  for (let article of panier) { // Boucle for pour les éléments dans la clé "panier" qui est stockée dans le localStorage.

    fetch(`http://localhost:3000/api/products/${article.id}`)

      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })

      .then(function (value) { // Si la promesse est tenue, on crée le HTML pour chaque article ajouté au panier les spécificités du produit en question.

        //Initialisation produit
        const panierProduitArticle = document.createElement("article");
        panierProduitArticle.classList.add("cart__item");

        // Image
        const panierProduitDivImg = document.createElement("div");
        panierProduitDivImg.classList.add("cart__item__img");
        const panierProduitImg = document.createElement("img");
        panierProduitImg.src = value.imageUrl;
        panierProduitImg.alt = value.altTxt;

        // Contenu du produit
        const panierProduitContenu = document.createElement("div");
        panierProduitContenu.classList.add("cart__item__content");

        const panierProduitContenuDescription = document.createElement("div");
        panierProduitContenuDescription.classList.add("cart__item__content__description");

        const panierProduitTitre = document.createElement("h2");
        panierProduitTitre.innerText = value.name;

        const panierProduitCouleur = document.createElement("p");
        panierProduitCouleur.innerText = "Couleur: " + article.color;

        const panierProduitPrix = document.createElement("p");
        panierProduitPrix.setAttribute("id", "cart__item__price");
        panierProduitPrix.innerText = "Prix: " + value.price * article.quantity + "€";

        //Réglages du produit
        const panierProduitReglagesDiv = document.createElement("div");
        panierProduitReglagesDiv.classList.add("cart__item__content__settings");

        const panierProduitReglages = document.createElement("div");
        panierProduitReglages.classList.add("cart__item__content__settings__quantity");

        // Quantité
        const panierProduitReglagesQuantite = document.createElement("p");
        panierProduitReglagesQuantite.innerText = "Quantité: ";
        const panierProduitReglagesQuantiteChange = document.createElement("input");
        panierProduitReglagesQuantiteChange.type = "number";
        panierProduitReglagesQuantiteChange.classList.add("itemQuantity");
        panierProduitReglagesQuantiteChange.name = "itemQuantity";
        panierProduitReglagesQuantiteChange.min = "1";
        panierProduitReglagesQuantiteChange.max = "100";
        panierProduitReglagesQuantiteChange.value = article.quantity;

        // Suppression Canapé
        const panierProduitReglagesSupprimerDiv = document.createElement("div");
        panierProduitReglagesSupprimerDiv.classList.add("cart__item__content__settings__delete");
        const panierProduitReglagesSupprimer = document.createElement("p");
        panierProduitReglagesSupprimer.classList.add("deleteItem");
        panierProduitReglagesSupprimer.innerText = "Supprimer";

        // AppendChilds

        // Image = Enfant de ProduitArticle
        panierProduitDivImg.appendChild(panierProduitImg);
        panierProduitArticle.appendChild(panierProduitDivImg);

        // Intérieur Description = Enfant de Description = Enfant de ProduitArticle
        panierProduitContenuDescription.appendChild(panierProduitTitre);
        panierProduitContenuDescription.appendChild(panierProduitCouleur);
        panierProduitContenuDescription.appendChild(panierProduitPrix);
        panierProduitContenu.appendChild(panierProduitContenuDescription);
        panierProduitArticle.appendChild(panierProduitContenu);

        // Réglages Quantité = Enfant de Description
        panierProduitReglages.appendChild(panierProduitReglagesQuantite);
        panierProduitReglages.appendChild(panierProduitReglagesQuantiteChange);
        panierProduitReglagesDiv.appendChild(panierProduitReglages)
        panierProduitContenu.appendChild(panierProduitReglagesDiv);

        // Réglages Suppression = Enfant de Description
        panierProduitReglagesSupprimerDiv.appendChild(panierProduitReglagesSupprimer)
        panierProduitContenu.appendChild(panierProduitReglagesSupprimerDiv);

        // Le Parent
        panierProduit.appendChild(panierProduitArticle);

        //EventListener - Suppression
        panierProduitReglagesSupprimer.addEventListener("click", supprimerArticle);

        //Fin des AppendChilds

        //Changement Quantité
        const articleQuantity = document.getElementsByClassName("itemQuantity");

        for (let i = 0; i < articleQuantity.length; i++) { //Je créée une boucle for, avec i qui pointera chaque éléments de mon panier un par un
          articleQuantity[i].addEventListener("change", function () { // A chaque fois que je change articleQuantity, j'exécute une fonction
            panier[i].quantity = articleQuantity[i].value; // Je change la valeur de quantity dans mon panier et remplace par celle de articleQuantity qui ont tout les deux la clé commune i
            localStorage.setItem("panier", JSON.stringify(panier)); // Je change la valeur JS en JSON et le stocke dans le localStorage
            panierProduitPrix.innerText = "Prix: " + value.price * article.quantity + "€"; // Je change en temps réel le nouveau prix total du produit en fonction de la quantité
            majPrixQty(); // J'exécute la fonction majPrixQty qui me permets de mettre à jour le prix total de tout les articles
          })
        }
      })
  }
}

function supprimerArticle(event) { // Fonction permettant de supprimer un produit du panier

  const panier = JSON.parse(localStorage.getItem("panier")); // On importe la clé "panier"
  var child = event.target.parentNode.parentNode.parentNode; // La variable "child" est égale à "cart__item" selon le produit
  var parent = child.parentNode; // La variable "parent" est égale à "cart__items"
  var index = Array.prototype.indexOf.call(parent.children, child); // L'index varie en fonction du produit auquel on va choisir de supprimer
  panier.splice(index, 1); // On supprime l'élément de notre panier
  window.localStorage.setItem("panier", JSON.stringify(panier)); // Je change la valeur JS en JSON et le stocke dans le localStorage

  draw_articles(); // On mets à jour le HTML
  majPrixQty(); // On mets à jour le prix
}

async function majPrixQty() { // On crée une fonction pour mettre à jour le prix et la quantité totale des produitsqu'on va mettre en asynchrone. La fonction va attendre la réponse de l'API avant de mettre les données à jour.
  // On importe le clé "panier" et on déclare la somme totale et la quantité et on fait une boucle "for" pour donner à "sum" (le prix total) et "quantity" (quantité totale) les valeurs correspondant a tout ce qui se trouve dans notre panier
  //Enfin, on sélectionne les ID sur le HTML pour donner les valeurs stockées dans "sum" et "quantity"
  const panier = JSON.parse(localStorage.getItem("panier"));
  let sum = 0;
  let quantity = 0;

  for (let article of panier) {

    const res = await fetch(`http://localhost:3000/api/products/${article.id}`)
    const value = await res.json();

    sum += value.price * article.quantity;
    quantity += parseInt(article.quantity)
  }

  const prix_produit = document.getElementById("totalPrice");
  prix_produit.innerHTML = sum;

  const quantity_produit = document.getElementById("totalQuantity");
  quantity_produit.innerHTML = quantity;
}

document.getElementById("order").addEventListener("click", function (event) { 
  // On sélectionne l'ID "order" et on rajoute une fonction qui s'exécute si on clique sur le bouton "Commander"
  // On fait en sorte de ne pas prendre les paramètres par défaut du bouton, on créée un objet contenant toutes les lignes du formulaire et on fait une fonction if contenant la vérification regExp ci-dessous. 
  // Si le formulaire est valide, on récupère depuis le panier tous les elements du client (productToSubmit), ainsi que ses info perso (dataUser) et on les fusionne dans 1 gros objet que nous enverrons a notre API
  // Enfin, on récupère la réponse de notre appel d'API et on prends l'orderId

  event.preventDefault();

  let dataUser = {
    "firstName": document.getElementById("firstName").value,
    "lastName": document.getElementById("lastName").value,
    "address": document.getElementById("address").value,
    "city": document.getElementById("city").value,
    "email": document.getElementById("email").value
  };

  if (checkFormulaire(dataUser)) {

    let productToSubmit = [];
    const panier = JSON.parse(localStorage.getItem("panier"));
    panier.forEach(element => {
      productToSubmit.push(element.id);
    });

    let dataToSend = {
      "contact": dataUser,
      "products": productToSubmit
    };

    let promesseReception = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: { "Content-Type": "application/json" }
    })

    promesseReception.then(async (response) => {
      let retourServeur = await response.json();
      console.log(retourServeur);
      window.location.href = "confirmation.html?orderId=" + retourServeur.orderId;
    });
  }
});

// RegExp //

function checkFormulaire(dataUser) { // On crée une fonction qui nous permets de vérifier si les données entrées par l'utilisateur sont correctes. On créée tout d'abord des variables regEx pour toutes les lignes du formulaire
  // Ainsi qu'un booléen error qui est défini sur False par défaut.
  // On crée des conditions "if" pour vérifier si chaque ligne est false/ null/ underfined ou 0, on affiche un message d'erreur et error = true

  let regExpFirstName = /^[^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{3,20}$/.test(dataUser.firstName);
  let regExpLastName = /^[^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{3,20}$/.test(dataUser.lastName);
  let regExpAddress = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/.test(dataUser.address);
  let regExpCity = /^[a-zA-Zàâäéèêëïîôöùûüç]+(?:[- ][a-zA-Zàâäéèêëïîôöùûüç]+)*$/.test(dataUser.city);
  let regExpEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(dataUser.email);
  let error = false;

  if (!regExpFirstName) {
    let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    firstNameErrorMsg.innerHTML = "Votre prénom doit contenir entre 3 et 20 caractères";
    error = true;
  }

  if (!regExpLastName) {
    let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    lastNameErrorMsg.innerHTML = "Votre nom doit contenir entre 3 et 20 caractères";
    error = true;
  }

  if (!regExpAddress) {
    let addressErrorMsg = document.getElementById("addressErrorMsg");
    addressErrorMsg.innerHTML = "Votre addresse est invalide";
    error = true;
  }

  if (!regExpCity) {
    let cityErrorMsg = document.getElementById("cityErrorMsg");
    cityErrorMsg.innerHTML = "Votre ville est invalide";
    error = true;
  }

  if (!regExpEmail) {
    let emailErrorMsg = document.getElementById("emailErrorMsg");
    emailErrorMsg.innerHTML = "Votre e-mail est invalide";
    error = true;
  }

  return !error;
}