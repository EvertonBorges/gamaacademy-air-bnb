function onNavbarScrollEvent() {
    const navbar = document.getElementById('navbar');

    if (navbar && !isVisible(navbar)) {
        const navbarFixed = document.getElementById('navbar-fixed');
        navbarFixed.classList.remove('d-none');
    } else if (navbar && isVisible(navbar)) {
        const navbarFixed = document.getElementById('navbar-fixed');
        navbarFixed.classList.add('d-none');
    }
}

// font: https://www.it-swarm.dev/pt/javascript/verificar-se-o-elemento-esta-visivel-no-dom/1043392274/
function isVisible(elem) {
    if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
    const style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter   = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === elem) return true;
    } while (pointContainer = pointContainer.parentNode);
    return false;
}

function onMouseMoveEvent(event) {
    const element = event.srcElement;
    if (element.classList.contains('btn-airbnb-radial')) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        const width = element.clientWidth;
        const height = element.clientHeight;

        const calcX = mouseX / width * 100;
        const calcY = mouseY / height * 100;

        element.style = `background-position: calc((100 - var(--mouse-x, 0)) * 1%) calc((100 - var(--mouse-y, 0)) * 1%); --mouse-x:${calcX}; --mouse-y:${calcY};`;
    }
}