import {
    TweenMax,
    TimelineMax,
    AttrPlugin,
    CSSPlugin,
    MorphSVGPlugin,
    Power1,
    Bounce,
} from "gsap/all";
import gsap from "gsap";
/* -------------------
ToggleMenu
------------------- */
const HeaderMenu = {
    hamburgerMenu: document.querySelector('.hb-menu-button-checkbox'),
    linksMenu: document.querySelector('.hb-menu-links'),
    linkMenu1: document.querySelector('.hb-menu-links li:nth-of-type(1)'),
    linkMenu2: document.querySelector('.hb-menu-links li:nth-of-type(2)'),
    linkMenu3: document.querySelector('.hb-menu-links li:nth-of-type(3)'),

    toggleMenu() {

        var tl = gsap.timeline();
        tl
            .to(this.linksMenu, {y: 0, duration: 0.2, ease:Bounce.easeIn})
            .to(this.linkMenu1, {opacity: 1, duration: 0.4, ease:Power1.out} )
            .to(this.linkMenu2, {opacity: 1, duration: 0.4, ease:Power1.out} )
            .to(this.linkMenu3, {opacity: 1, duration: 0.4, ease:Power1.out} )
            .reversed(true);

        const toggleDirection = () => {
            tl.reversed( !tl.reversed() );
        };
        this.hamburgerMenu.addEventListener('click', () => {
            toggleDirection();
        });
    },
};

export default HeaderMenu;
