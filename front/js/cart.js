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
          articleQuantity[i].addEventListener("change", function (event) {
            panier[i].quantity = articleQuantity[i].value;
            localStorage.setItem("panier", JSON.stringify(panier));
            draw_articles();
            majPrixQty();

            console.log(articleQuantity[i]);
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
}

async function majPrixQty(){
  const panier = JSON.parse(localStorage.getItem("panier"));
  let sum = 0;

  for(let article of panier) {

    const res = await fetch(`http://localhost:3000/api/products/${article.id}`)
    const value = await res.json();
    sum += value.price * article.quantity;
    console.log(`sum: ${sum} | prix: ${value.price} | quantity: ${article.quantity}`);
  }
  
  const prix_produit = document.getElementById("totalPrice");
  prix_produit.innerHTML = sum;

}