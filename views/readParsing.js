// index.js
document.addEventListener("DOMContentLoaded", function() {
    // Ambil data JSON dari tag script
    var jsonData = JSON.parse(document.getElementById("jsonData").textContent);
    console.log(jsonData); // Lakukan sesuatu dengan data JSON
});