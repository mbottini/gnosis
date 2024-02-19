import sqlite3 from 'sqlite3';

function showPopup() {
    window.open("", "Popup", "width=500,height=300");
}

let reviewButton = document.getElementById("begin_review");

reviewButton.addEventListener("click", showPopup);
