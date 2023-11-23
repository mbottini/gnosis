// To compile from the outer gnosisweb, do tsc.cmd ./main/static/main/index.ts
var makeNewTemplate = document.getElementById("new-template-button");
var existingTemplate = document.getElementById("existing-template-button");
if (makeNewTemplate && existingTemplate) {
    makeNewTemplate.addEventListener("click", function () {
        window.location.href = "/new";
    });
    existingTemplate.addEventListener("click", function () {
        window.location.href = "/existing";
    });
}
