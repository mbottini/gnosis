import { appendWithDeadSpan, appendBreak, appendSpansToColumns } from './textFormattingFunctions.js';
//This is the class constructor for the card template. Each card HTML dict looks like {"front": <frontHTML>, "back": <backHTML>}. 
class cardTemplate {
    constructor(name, fields, fieldTypes, fieldSettingDicts, cards, cardHTMLDicts) {
        this.name = name;
        this.fields = fields;
        this.fieldTypes = fieldTypes;
        this.fieldSettingDicts = fieldSettingDicts;
        this.cards = cards;
        this.cardHTMLDicts = cardHTMLDicts;
    }
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
//Put all this stuff into a module (and figure out why you can't open new windows when you're using a module)
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
    addButton.classList.add("jost");

    addButton.addEventListener("click", function() {
        let replacementDiv = createRegexPairing();
        topDiv.appendChild(replacementDiv);
    });
    popupWindow.document.body.appendChild(addButton);
    popupWindow.document.body.appendChild(topDiv);


    let regexDictionary = {};

    let submitButton = document.createElement("button");
    submitButton.innerHTML = "Create mapping";
    submitButton.classList.add("jost");
    submitButton.addEventListener("click", function() {
        for (let i = 0; i < topDiv.children.length; i++) {
            let englishRegex = topDiv.children[i].children[0].value;
            let foreignRegex = topDiv.children[i].children[2].value;
            if (englishRegex !== "" && foreignRegex !== "") {
                regexDictionary[englishRegex] = foreignRegex;
            }
        }
        popupWindow.close();
    });
    popupWindow.document.body.appendChild(submitButton);
    return regexDictionary;
}

function addFormattingOptions(dropdown) {
    let formattingTypes = ["Color", "Text style", "Visibility"];
    for (let i = 0; i < formattingTypes.length; i++) {
        let option = document.createElement("option");
        option.text = formattingTypes[i];
        option.value = formattingTypes[i];
        dropdown.add(option);
    }
}


//This applies formatting to some field or other. In the text browser this is done by e.g. {f1:f4} or {f1:f3[f2]}, where [f2] allows us to take an optional parameter. This will require some sort of microlanguage to parse the formatting, and then we can apply it to the field.
function addFormatting() {
    let popupWindow = window.open("", "", "height=500, width=400");
    popupWindow.document.title = "Add Formatting";
    let allSelectionDivs = document.createElement("div");

    let selectionDiv = document.createElement("div");
    selectionDiv.style.padding = "5px";
    let selectionDropdown = document.createElement("select");
    addFormattingOptions(selectionDropdown);
    selectionDiv.appendChild(selectionDropdown);
    

    let additionalFormatting = document.createElement("button");
    additionalFormatting.innerHTML = "Add another option";
    additionalFormatting.classList.add("jost");

    popupWindow.document.body.appendChild(selectionDiv);
    popupWindow.document.body.appendChild(additionalFormatting);

    //Fix this later
    additionalFormatting.addEventListener("click", function() {
        let formattingDiv = document.createElement("div");
        formattingDiv.style.padding = "5px";
        let extraFormattingDropdown = document.createElement("select");
        addFormattingOptions(extraFormattingDropdown);
        formattingDiv.appendChild(extraFormattingDropdown);
        
        allSelectionDivs.appendChild(formattingDiv);
    });

    
    
}

function showSettingsWindow(setting){
    if (setting != "Formatting") {
        createRegexTable();
    } else {
        addFormatting();
    }
}

function createFieldSpan(nextFieldButton, inputBox, cardBox) {
    let editorText = "";
    let outerFieldSpan = document.createElement("span");
    outerFieldSpan.style.width = "33%";

    let innerFieldSpan = document.createElement("span");
    innerFieldSpan.innerHTML = "Add Field";
    innerFieldSpan.classList.add("newField");

    innerFieldSpan.addEventListener("click", function() {
        outerFieldSpan.innerHTML = "";
        let inputField = document.createElement("input");
        inputField.type = "text";
        inputField.style.width = "33%";
        outerFieldSpan.appendChild(inputField);
        inputField.focus();

        inputField.addEventListener("keydown", function(event) {
            if (event.key === "Enter" && inputField.value != "") {
                outerFieldSpan.innerHTML = "";
                let replacementInnerSpan = document.createElement("span");
                replacementInnerSpan.innerHTML = inputField.value;
                appendWithDeadSpan(outerFieldSpan, replacementInnerSpan, "existingField", 20);
                editorText = inputField.value;
                inputBox.value += "{" + editorText + "}\n";
                updateOutputBox(inputBox, cardBox);
                nextFieldButton.click();
            } else if (event.key === "Enter") {
                outerFieldSpan.innerHTML = "";
                appendWithDeadSpan(outerFieldSpan, innerFieldSpan, "newField", 20)
            }
        });
    });
        
    appendWithDeadSpan(outerFieldSpan, innerFieldSpan, "newField", 20);
    return outerFieldSpan;

}

function createEditorInput(thisDiv, inputBox, cardBox, nextFieldButton) {

    let subDiv = document.createElement("div");
    subDiv.style.width = "100%";
    //inputBox.value += "{f" + counter.toString() + "}\n";
    //updateOutputBox(inputBox, cardBox);

    let settingsButton = document.createElement("button");
    settingsButton.display = "inline";
    settingsButton.innerHTML = "Settings";
    settingsButton.classList.add("Jost");

    let fieldSpan = createFieldSpan(nextFieldButton, inputBox, cardBox);

    let fieldTypeDropdown = document.createElement("select");
    //This seems to not *quite* work as intended?
    possibleFieldTypes(fieldTypeDropdown);

    settingsButton.addEventListener("click", function() {
        showSettingsWindow(fieldTypeDropdown.value);
    });
    
    thisDiv.appendChild(fieldSpan);
    thisDiv.appendChild(fieldTypeDropdown);
    thisDiv.appendChild(settingsButton);
    
        
    appendBreak(thisDiv);
}


function createDropdownMenu(topElement, inputBox, cardBox) {
    let thisDropdownArea = document.createElement("div");

    let nextButton = document.createElement("button");
    topElement.appendChild(thisDropdownArea);
    nextButton.innerHTML = "Add Field";
    nextButton.classList.add("Jost");

    createEditorInput(thisDropdownArea, inputBox, cardBox, nextButton);

    nextButton.addEventListener("click", function() {
        createEditorInput(thisDropdownArea, inputBox, cardBox, nextButton);
    });
    

    appendBreak(topElement);
    topElement.appendChild(nextButton);
}

function updateOutputBox(textBox, cardBox) {
    let outputText = textBox.value.split("\n").join("<br>");
    cardBox.innerHTML = outputText;
}


function createTextInput() {
    let textBox = document.createElement("textarea");
    textBox.style.width = "100%";
    textBox.style.height = "80%";
    textBox.style.fontSize = "16px";
    //textBox.type = "text";
    textBox.name = "cardName";
    textBox.id = "cardName";
    return textBox;
}

function createCardTabs(tabDiv, counter, activeTab=0) {
    tabDiv.innerHTML = "";
    let tabList = [];
    for (let i = 1; i <= counter; i++) {
        let tab = document.createElement("button");
        tab.classList.add("Jost");
        tab.id = "card-" + i.toString();
        tab.innerHTML = "Card " + i.toString();
        tabList.push(tab);
        tabDiv.appendChild(tab);
    }
    tabList[activeTab].style.backgroundColor = "#aaaaff";

    let activeTabIndex = 0;
    for (let j = 0; j < tabList.length; j++) {
        tabList[j].addEventListener("click", function() {
            activeTabIndex = j;
            for (let k = 0; k < tabList.length; k++) {
                if (k === j) {
                    tabList[k].style.backgroundColor = "#aaaaff";
                } else {
                    tabList[k].style.backgroundColor = "#f1f1f1";
                }
            }
        });
    }

    let plusTab = document.createElement("button");
    plusTab.innerHTML = "+";
    plusTab.style.backgroundColor = "#aaffaa";
    plusTab.classList.add("Jost");

    plusTab.addEventListener("click", function() {
        counter++;
        createCardTabs(tabDiv, counter, activeTabIndex);
    });
    tabDiv.appendChild(plusTab);

    if (counter > 1) {
        let minusTab = document.createElement("button");
        minusTab.innerHTML = "-";
        minusTab.style.backgroundColor = "#ffaaaa";
        minusTab.classList.add("Jost");

        minusTab.addEventListener("click", function() {
            counter--;
            createCardTabs(tabDiv, counter, activeTabIndex);
        });

        tabDiv.appendChild(minusTab);
    }
}

function createFrontBackTabs(tabDiv) {
    let frontTab = document.createElement("button");
    frontTab.innerHTML = "Front";
    frontTab.classList.add("Jost");

    frontTab.onclick = function() {
        frontTab.style.backgroundColor = "#66ff66";
        backTab.style.backgroundColor = "#f1f1f1";
    }

    let backTab = document.createElement("button");
    backTab.innerHTML = "Back";
    backTab.classList.add("Jost");

    backTab.onclick = function() {
        backTab.style.backgroundColor = "#66ff66";
        frontTab.style.backgroundColor = "#f1f1f1";
    }
    frontTab.style.backgroundColor = "#66ff66";
    tabDiv.appendChild(frontTab);
    tabDiv.appendChild(backTab);
}

function addPaddingDiv(inputDiv) {
    let paddingDiv = document.createElement("div");
    paddingDiv.style.height = "5px";
    inputDiv.appendChild(paddingDiv);
}

function styleInputBox(textBox) {
    let inputDiv = document.createElement("div");
    let topTabs = document.createElement("div");
    topTabs.classList.add("tab");
    createCardTabs(topTabs, 1);
    inputDiv.appendChild(topTabs);
    
    addPaddingDiv(inputDiv);

    let frontBackTabs = document.createElement("div");
    frontBackTabs.classList.add("tab");
    createFrontBackTabs(frontBackTabs);
    inputDiv.appendChild(frontBackTabs);

    addPaddingDiv(inputDiv);
    
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

//Unsure exactly why I set this up as a class
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

        //man, some of this needs to be functions"
        this.window.editorDiv = document.createElement("div");
        this.window.editorDiv.style.width = "33%";
        this.window.editorDiv.style.height = "100%";
        this.window.editorDiv.id = "editorDiv";
        this.window.editorDiv.style.float = "left";
        this.window.editorDiv.style.display = "inline-block";
        this.window.document.body.appendChild(this.window.editorDiv);

        let cardBox = document.createElement("div");
        cardBox.style = "border-style: solid; border-width: 2px; border-color: black; height: 50%; width: 80%; text-align: center";

        let cardCollectionDict = {};

        let textInput = createTextInput();

        createDropdownMenu(this.window.editorDiv, textInput, cardBox); 

        this.window.textBox = document.createElement("div");
        this.window.textBox.style.width = "33%";
        this.window.textBox.style.height = "100%";
        this.window.textBox.style.display = "inline-block";

        
        this.window.textBox.appendChild(styleInputBox(textInput));

        this.window.document.body.appendChild(this.window.textBox);
 
        this.window.document.body.appendChild(createHTMLDisplay(cardBox));

        updateOutputBox(textInput, cardBox);

        textInput.oninput = function() {
            updateOutputBox(textInput, cardBox);
        }
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
