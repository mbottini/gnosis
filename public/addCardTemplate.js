

function showPopup() {
    let editWindow = window.open("", "Popup", "width=500,height=300");
    editWindow.document.body.innerHTML = `
    <textarea style="width:100%; height:100%"></textarea>`
}

let reviewButton = document.getElementById("createReviewButton");

reviewButton.addEventListener("click", showPopup);

