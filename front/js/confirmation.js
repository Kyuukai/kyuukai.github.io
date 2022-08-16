var str = window.location.href;
var url = new URL(str);
var orderId = url.searchParams.get("orderId");
document.getElementById("orderId").innerText = orderId;
localStorage.removeItem("panier");