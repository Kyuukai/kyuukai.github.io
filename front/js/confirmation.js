var str = window.location.href;
var url = new URL(str);
var orderId = url.searchParams.get("orderId"); // On créée la variable orderId qui correspondra au numéro de commande
document.getElementById("orderId").innerText = orderId; // On affiche le numéro de commande avec orderId
localStorage.removeItem("panier"); // On enlève la clé "panier" du localStorage