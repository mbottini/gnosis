

export function appendWithDeadSpan(outerSpan, innerSpan, innerSpanClass, numPixels) {
    innerSpan.classList.add(innerSpanClass);
    outerSpan.appendChild(innerSpan);
    let deadSpan = document.createElement("span");
    deadSpan.innerHTML = "";
    deadSpan.style.paddingRight = numPixels.toString() + "px";
    outerSpan.appendChild(deadSpan);
}

export function appendSpansToColumns(spanList, columnList) {
    for (let i = 0; i < spanList.length; i++) {
        columnList[i].appendChild(spanList[i]);
    }
}


export function appendBreak(div) {
    let br = document.createElement("br");
    div.appendChild(br);
}