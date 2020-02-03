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
ProjectList
------------------- */
const ProjectList = {
    projectListItem: document.querySelectorAll('.project-list-item'),

    displayImage() {
        this.projectListItem.forEach(item =>
            item.addEventListener('mouseover', () => {
                item.children[1].classList.add('project-list-item-photo-visible');
            })
        );

        this.projectListItem.forEach(item =>
            item.addEventListener('mouseleave', () => {
                item.children[1].classList.remove('project-list-item-photo-visible');
            })
        )

    },
};

export default ProjectList;
