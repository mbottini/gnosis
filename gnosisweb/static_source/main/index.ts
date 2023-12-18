// To compile from the outer gnosisweb, do tsc.cmd ./main/static/main/index.ts

/*
const makeNewTemplate = document.getElementById("new-template-button");
const existingTemplate = document.getElementById("existing-template-button");

if (makeNewTemplate && existingTemplate) {
    makeNewTemplate.addEventListener("click", () => {
        window.location.href = "/new";
    });
    existingTemplate.addEventListener("click", () => {
        window.location.href = "/existing";
    });
}
*/

//All valid JS is also valid TS

import "bootstrap";


$('#existingTemplateModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })


const templateSelector = document.getElementById("templateSelector");

if (templateSelector) {
    templateSelector.addEventListener("change", () => {
        const templateSelector = document.getElementById("templateSelector") as HTMLSelectElement;
        const template = templateSelector.value;
        const templateList = document.getElementById("templateList");
        if (templateList) {
            const templateItem = document.createElement("li");
            templateItem.innerHTML = template;
            templateList.appendChild(templateItem);
        }
    });
}

const toposForm = document.getElementById("inputTopoi");
if (toposForm) {
    const toposInput = document.getElementById("inputTopoi") as HTMLInputElement;
    const topos = toposInput.value;
    const toposItem = document.createElement("li");
    toposItem.innerHTML = topos;
    toposInput.appendChild(toposItem);
}

$('#newTemplateModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })