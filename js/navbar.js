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