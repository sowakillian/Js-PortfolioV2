
/* -------------------
ToggleMenu
------------------- */
const HeaderMenu = {
    hamburgerMenu: document.querySelector('.hb-menu-button'),
    linksMenu: document.querySelector('.hb-menu-links'),

    toggleMenu() {
        this.hamburgerMenu.addEventListener('click', () => this.linksMenu.classList.toggle('hb-menu-links-visible'));

    },
};

export default HeaderMenu;
