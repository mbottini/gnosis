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

function createRegexTable() {
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
}

function possibleFieldTypes(dropdownElement) {
    let fieldTypes = ["Text", "Input", "Formatting", "Cloze"];
    for (let i = 0; i < fieldTypes.length; i++) {
        let option = document.createElement("option");
        option.text = fieldTypes[i];
        option.value = fieldTypes[i];
        dropdownElement.add(option);
    }
}

function createEditorInput(counter, thisDiv, inputBox, cardBox) {
    inputBox.value += "{field" + counter.toString() + "}\n";
    updateOutputBox(inputBox, cardBox);

    let fieldSpan = document.createElement("span");
    fieldSpan.innerHTML = "Field " + counter.toString() + ": ";
    fieldSpan.id = "field-" + counter.toString() + "input";
    fieldSpan.style.padding = "5px";

    let fieldNameInput = document.createElement("input");
    fieldNameInput.type = "text";

    let fieldTypeDropdown = document.createElement("select");
    possibleFieldTypes(fieldTypeDropdown);

    let settingsButton = document.createElement("button");
    settingsButton.display = "inline";
    settingsButton.innerHTML = "Settings";
    
    
    settingsButton.addEventListener("click", function() {
        if (fieldTypeDropdown.value === "Text") {
            createRegexTable();
        }
    });
    
    thisDiv.appendChild(fieldSpan);
    thisDiv.appendChild(fieldNameInput);
    thisDiv.appendChild(fieldTypeDropdown);
    thisDiv.appendChild(settingsButton);

    let breakLine = document.createElement("br");
    thisDiv.appendChild(breakLine);
}


function createDropdownMenu(topElement, counter, inputBox, cardBox) {
    let thisDropdownArea = document.createElement("div");
    let nextButton = document.createElement("button");
    topElement.appendChild(thisDropdownArea);
    nextButton.innerHTML = "Add Field";
    createEditorInput(counter, thisDropdownArea, inputBox, cardBox);

    nextButton.addEventListener("click", function() {
        counter++;
        createEditorInput(counter, thisDropdownArea, inputBox, cardBox);
    });

    topElement.appendChild(nextButton);
}

function updateOutputBox(textBox, cardBox) {
    let outputText = textBox.value.split("\n").join("<br>");
    cardBox.innerHTML = outputText;
}

function createTextInput(cardBox) {
    let textBox = document.createElement("textarea");
    textBox.style.width = "100%";
    textBox.style.height = "80%";
    textBox.type = "text";
    textBox.name = "cardName";
    textBox.id = "cardName";

    textBox.oninput = function() {
        updateOutputBox(textBox, cardBox);
    }

    return textBox;
}

function createTabs(tabDiv) {
}

function styleInputBox(textBox) {
    let inputDiv = document.createElement("div");
    let topTabs = document.createElement("div");
    topTabs.classList.add("tab");
    for (let i = 0; i < 3; i++) {
        let tab = document.createElement("button");
        tab.classList.add("tablinks");
        tab.innerHTML = "Card " + i.toString();
        topTabs.appendChild(tab);
    }
    inputDiv.appendChild(topTabs);

    let breakLine = document.createElement("br");
    inputDiv.appendChild(breakLine);
    inputDiv.appendChild(textBox);
    return inputDiv;
}

function createHTMLDisplay(cardBox) {
    let thisDisplay = document.createElement("div");
    thisDisplay.style.width = "33%";
    thisDisplay.style.height = "100%";
    thisDisplay.id = "seeHTML";
    thisDisplay.style.float = "right";

    let blankDiv = document.createElement("div");
    blankDiv.style.height = "20%";
    thisDisplay.appendChild(blankDiv);

    

    thisDisplay.appendChild(cardBox);

    return thisDisplay;
}

class PopupEditor {
    constructor() {
    }
    showPopup(height, width) {
        this.window = window.open("", "", `height=${height}, width=${width}`);
        //this.window.document.body.classList.add('jost');
        this.window.document.head.innerHTML = '<link rel="stylesheet" type="text/css" href="styles.css"><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
        this.window.document.title = "Create a Card Template"
        let left = (window.screen.width - width) / 2;
        let top = (window.screen.height - height) / 4;
        this.window.moveTo(left, top);

        this.window.editorDiv = document.createElement("div");
        this.window.editorDiv.style.width = "33%";
        this.window.editorDiv.style.height = "100%";
        this.window.editorDiv.id = "editorDiv";
        this.window.editorDiv.style.float = "left";
        this.window.editorDiv.style.display = "inline-block";
        this.window.document.body.appendChild(this.window.editorDiv);

        let cardBox = document.createElement("div");
        cardBox.style = "border-style: solid; border-width: 2px; border-color: black; height: 50%; width: 80%; text-align: center";

        let textInput = createTextInput(cardBox);

        let fieldCounter = 1;
        createDropdownMenu(this.window.editorDiv, fieldCounter, textInput, cardBox); 

        this.window.textBox = document.createElement("div");
        this.window.textBox.style.width = "33%";
        this.window.textBox.style.height = "100%";
        this.window.textBox.style.display = "inline-block";

        
        this.window.textBox.appendChild(styleInputBox(textInput));

        this.window.document.body.appendChild(this.window.textBox);
 
        this.window.document.body.appendChild(createHTMLDisplay(cardBox));

        updateOutputBox(textInput, cardBox);
    }
    hidePopup() {
        this.window.close();
    }
}

let reviewButton = document.getElementById("createReviewButton");

// Pass a reference to the function, don't call it immediately

reviewButton.addEventListener("click", function() {
    let popupEditor = new PopupEditor();
    popupEditor.showPopup(500, 1200);
});
