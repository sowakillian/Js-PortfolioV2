import '../styles/main.scss';

import HeaderMenu from "./components/global/nav/toggleMenu";
import CustomCursor from "./components/global/cursor/customCursor";
import ProjectList from "./components/project-list/projectList";

const customcursor = ((customcursor) => {
    customcursor.initCursor();
    customcursor.initCanvas();
    customcursor.initHovers();
    customcursor.animateHover();
})(CustomCursor);

const headermenu = ((headermenu) => {
    headermenu.toggleMenu();
})(HeaderMenu);

const projectlist = ((projectlist) => {
    projectlist.displayImage();
})(ProjectList);


