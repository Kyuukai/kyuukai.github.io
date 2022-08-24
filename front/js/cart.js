draw_articles();
majPrixQty();

function draw_articles() {

  const panier = JSON.parse(localStorage.getItem("panier"));
  const panierProduit = document.getElementById("cart__items");
  panierProduit.innerHTML = "";

  console.log(panier);

  for (let article of panier) {

    fetch(`http://localhost:3000/api/products/${article.id}`)

      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })

      .then(function (value) {

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

        for (let i = 0; i < articleQuantity.length; i++) {
          articleQuantity[i].addEventListener("change", function () {
            panier[i].quantity = articleQuantity[i].value;
            localStorage.setItem("panier", JSON.stringify(panier));
            panierProduitPrix.innerText = "Prix: " + value.price * article.quantity + "€";
            majPrixQty();
          })
        }
      })
  }
}

function supprimerArticle(event) {

  const panier = JSON.parse(localStorage.getItem("panier"));
  var child = event.target.parentNode.parentNode.parentNode;
  var parent = child.parentNode;
  var index = Array.prototype.indexOf.call(parent.children, child);
  panier.splice(index, 1);
  window.localStorage.setItem("panier", JSON.stringify(panier));

  draw_articles();
  majPrixQty();
}

async function majPrixQty() {
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

function checkFormulaire(dataUser) {

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