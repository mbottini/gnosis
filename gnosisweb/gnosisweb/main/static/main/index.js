"use strict";
// To compile from the outer gnosisweb, do tsc.cmd ./main/static/main/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
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
require("bootstrap");
$('#existingTemplateModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus');
});
var templateSelector = document.getElementById("templateSelector");
if (templateSelector) {
    templateSelector.addEventListener("change", function () {
        var templateSelector = document.getElementById("templateSelector");
        var template = templateSelector.value;
        var templateList = document.getElementById("templateList");
        if (templateList) {
            var templateItem = document.createElement("li");
            templateItem.innerHTML = template;
            templateList.appendChild(templateItem);
        }
    });
}
var toposForm = document.getElementById("inputTopoi");
if (toposForm) {
    var toposInput = document.getElementById("inputTopoi");
    var topos = toposInput.value;
    var toposItem = document.createElement("li");
    toposItem.innerHTML = topos;
    toposInput.appendChild(toposItem);
}
$('#newTemplateModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus');
});
