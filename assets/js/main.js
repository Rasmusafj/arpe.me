import "jquery/dist/jquery.slim.min.js"
import "popper.js/dist/popper.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Custom javascript

// Typed js configuration
import "./typed-js.js"
import "./cv-tree-d3.js"


// Open-source filter
function handleOpenSourceFilterClick(e) {
    const value = (e.target.textContent || e.target.innerText).toLowerCase();

    Array.from(document.getElementById("open-source-filter").children).forEach(element => {
        element.classList.remove('active')
    });

    
    Array.from(document.getElementById("open-source-items").children).forEach(element => {
        if (Array.from(element.classList).includes(value) || value === "all") {
            element.style.visibility = "visible";
        } else {
            element.style.visibility = "hidden";
        }
    });

    const openSourceDiv = document.getElementById("open-source-items");

    // Double sort to keep order
    [...openSourceDiv.children]
        .sort((a) => a.style.visibility === "hidden" ? 1 : -1)
        .sort((a) => a.style.visibility === "hidden" ? 1 : -1)
        .forEach(node => openSourceDiv.appendChild(node));

    e.target.classList.add("active");

}

Array.from(document.getElementById("open-source-filter").children).forEach(elem => {
    elem.addEventListener("click", handleOpenSourceFilterClick)
})


// Skills filter
function handleSkillsFilterClick(e) {
    const tempValue = (e.target.textContent || e.target.innerText).toLowerCase();

    let value = tempValue;
    if (tempValue === "programming languages") {
        value = "programming-language";
    } else if (tempValue === "frameworks") {
        value = "framework";
    } else if (tempValue === "infrastructure") {
        value = "infrastructure";
    }

    Array.from(document.getElementById("skills-filter").children).forEach(element => {
        element.classList.remove('active')
    });

    Array.from(document.getElementById("skills-items").children).forEach(element => {
        if (Array.from(element.classList).includes(value) || value === "all") {
            element.style.visibility = "visible";
        } else {
            element.style.visibility = "hidden";
        }
    });

    const skillsDiv = document.getElementById("skills-items");

    // Double sort to keep order
    [...skillsDiv.children]
        .sort((a) => a.style.visibility === "hidden" ? 1 : -1)
        .sort((a) => a.style.visibility === "hidden" ? 1 : -1)
        .forEach(node => skillsDiv.appendChild(node));


    e.target.classList.add("active");
}

Array.from(document.getElementById("skills-filter").children).forEach(elem => {
    elem.addEventListener("click", handleSkillsFilterClick)
})

// Navbar stuff
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll("#navbarCollapse ul li");

window.onscroll = () => {
    var current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 62) {
            current = section.getAttribute("id");
        }
    });

    navLi.forEach((li) => {
        li.classList.remove("active");
        if (li.classList.contains(current)) {
            li.classList.add("active");
        }
    });
};


// Smooth scroll
var validSections = ["home", "about", "timeline", "skills", "open-source", "contact"]

function onClickNavBarElementSmoothScroll(e) {
    e.preventDefault();
    const clickedLink = e.target;
    const sectionId = validSections.filter(value => clickedLink.parentNode.classList.contains(value));
    const sectionToScrollTo = document.getElementById(sectionId);
    window.scrollTo({ top: sectionToScrollTo.offsetTop - 60, behavior: 'smooth' });
}

Array.from(document.querySelectorAll(".nav-link")).forEach(element => {
    element.addEventListener('click', onClickNavBarElementSmoothScroll)
});


// About me button
document.getElementById('about-me-btn').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: document.getElementById("about").offsetTop - 60, behavior: 'smooth' });
})
