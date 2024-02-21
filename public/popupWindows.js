function createRegexPairing() {
    let replacementDiv = document.createElement("div");
    let englishRegexInput = document.createElement("input");
    let foreignRegexInput = document.createElement("input");

    englishRegexInput.type = "text";
    foreignRegexInput.type = "text";

    let arrowSpan = document.createElement("span");
    arrowSpan.innerHTML = " → ";

    replacementDiv.appendChild(englishRegexInput);
    replacementDiv.appendChild(arrowSpan);
    replacementDiv.appendChild(foreignRegexInput);

    replacementDiv.style.padding = "5px";
    return replacementDiv;
}

function createRegexTable(document) {
    let popupWindow = window.open("", "", "height=500, width=400");
    popupWindow.document.title = "Add Character Replacement";
    let topDiv = document.createElement("div");

    for (let i = 0; i < 10; i++) {
        let replacementDiv = createRegexPairing();
        topDiv.appendChild(replacementDiv);
    }

    let addButton = document.createElement("button");
    addButton.innerHTML = "Add";
    addButton.addEventListener("click", function() {
        let replacementDiv = createRegexPairing();
        topDiv.appendChild(replacementDiv);
    });
    popupWindow.document.body.appendChild(addButton);
    popupWindow.document.body.appendChild(topDiv);


    let regexDictionary = {};

    let submitButton = document.createElement("button");
    submitButton.innerHTML = "Create mapping";
    submitButton.addEventListener("click", function() {
        for (let i = 0; i < topDiv.children.length; i++) {
            let englishRegex = topDiv.children[i].children[0].value;
            let foreignRegex = topDiv.children[i].children[2].value;
            if (englishRegex !== "" && foreignRegex !== "") {
                regexDictionary[englishRegex] = foreignRegex;
            }
        }
        console.log(regexDictionary);
    });
    popupWindow.document.body.appendChild(submitButton);
    return regexDictionary;
}