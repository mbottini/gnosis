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
$('#existingTemplateModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus');
});
