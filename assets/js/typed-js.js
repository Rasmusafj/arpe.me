import Typed from "typed.js/lib/typed.min.js"

// Typed JS configurations
const typedTextPlaceholderId = "#typed-js-text-placeholder"
const typedTextInputId = "typed-js-text-input"

const typedStrings = document
    .getElementById(typedTextInputId)
    .textContent
    .replace("\n", "")
    .replace(/\s\s+/g, ' ')
    .split(",")
    .map(element => element.trim())

var options = {
    strings: typedStrings,
    typeSpeed: 100,
    backSpeed: 20,
    smartBackspace: false,
    loop: true
};

var typed = new Typed(typedTextPlaceholderId, options);