//import paper from "paper";
//import SimplexNoise from "simplex-noise"

/* -------------------
CustomCursor
------------------- */
const CustomCursor = {
    innerCursor: document.querySelector('.cursor--small'),
    clientX: -100,
    clientY: -100,
    lastX: 0,
    lastY: 0,
    isStuck: false,
    showCursor: false,
    group: null,
    stuckX: null,
    stuckY: null,
    fillOuterCursor: null,
    shapeBounds: null,
    noiseScale: null,
    noiseRange: null,
    isNoisy: null,
    lerp: null,
    polygon: null,
    bigCoordinates: null,
    noiseObjects: null,

    initCursor() {
        document.addEventListener("mousemove", e => {
            this.clientX = e.clientX;
            this.clientY = e.clientY;
        });

        const renderCursor = () => {
            this.innerCursor.style.transform = `translate(${this.clientX}px, ${this.clientY}px)`;

            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
    },

    initCanvas() {
        const canvas = document.querySelector(".cursor--canvas");
        this.shapeBounds = {
            width: 75,
            height: 75
        };

        paper.setup(canvas);

        const strokeColor = "#FD3D57";
        const strokeWidth = 2;
        const segments = 8;
        const radius = 200;

        // we'll need these later for the noisy circle
        this.noiseScale = 150; // speed
        this.noiseRange = 9; // range of distortion
        this.isNoisy = false; // state

        // the base shape for the noisy circle
        this.polygon = new paper.Path.RegularPolygon(
            new paper.Point(0, 0),
            segments,
            radius
        );
        this.polygon.strokeColor = strokeColor;
        this.polygon.strokeWidth = strokeWidth;
        this.polygon.smooth();
        this.group = new paper.Group([this.polygon]);
        this.group.applyMatrix = false;

        this.noiseObjects = this.polygon.segments.map(() => new SimplexNoise());
        this.bigCoordinates = [];

        // function for linear interpolation of values
        this.lerp = (a, b, n) => {
            return (1 - n) * a + n * b;
        };

        // the draw loop of Paper.js
        // (60fps with requestAnimationFrame under the hood)
        paper.view.onFrame = event => {
            // using linear interpolation, the circle will move 0.2 (20%)
            // of the distance between its current position and the mouse
            // coordinates per Frame
            this.lastX = this.lerp(this.lastX, this.clientX, 0.2);
            this.lastY = this.lerp(this.lastY, this.clientY, 0.2);
            this.group.position = new paper.Point(this.lastX, this.lastY);
        }
    },

    initHovers() {

        // find the center of the link element and set stuckX and stuckY
        // these are needed to set the position of the noisy circle
        const handleMouseEnter = e => {
            const navItem = e.currentTarget;
            const navItemBox = navItem.getBoundingClientRect();
            this.stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
            this.stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
            this.isStuck = true;
        };

        // reset isStuck on mouseLeave
        const handleMouseLeave = () => {
            this.isStuck = false;
        };

        // add event listeners to all items
        const linkItems = document.querySelectorAll(".link");
        linkItems.forEach(item => {
            item.addEventListener("mouseenter", handleMouseEnter);
            item.addEventListener("mouseleave", handleMouseLeave);
        });
    },

    animateHover() {
        const map = (value, in_min, in_max, out_min, out_max) => {
            return (
                ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
            );
        };
        // the draw loop of Paper.js
// (60fps with requestAnimationFrame under the hood)
        paper.view.onFrame = event => {
            // using linear interpolation, the circle will move 0.2 (20%)
            // of the distance between its current position and the mouse
            // coordinates per Frame
            if (!this.isStuck) {
                // move circle around normally
                this.lastX = this.lerp(this.lastX, this.clientX, 0.2);
                this.lastY = this.lerp(this.lastY, this.clientY, 0.2);
                this.group.position = new paper.Point(this.lastX, this.lastY);
            } else if (this.isStuck) {
                // fixed position on a nav item
                this.lastX = this.lerp(this.lastX, this.stuckX, 0.2);
                this.lastY = this.lerp(this.lastY, this.stuckY, 0.2);
                this.group.position = new paper.Point(this.lastX, this.lastY);
            }

            if (this.isStuck && this.polygon.bounds.width < this.shapeBounds.width) {
                console.warn(this.polygon.bounds.width, this.shapeBounds.width);
                // scale up the shape
                this.polygon.scale(5);
                console.warn(this.polygon.bounds.width, this.shapeBounds.width);
            } else if (!this.isStuck && this.polygon.bounds.width > 30) {
                // remove noise
                if (this.isNoisy) {
                    this.polygon.segments.forEach((segment, i) => {
                        segment.point.set(this.bigCoordinates[i][0], this.bigCoordinates[i][1]);
                    });
                    this.isNoisy = false;
                    this.bigCoordinates = [];
                }
                // scale down the shape
                const scaleDown = 0.92;
                this.polygon.scale(scaleDown);
            }

            // while stuck and big, apply simplex noise
            if (this.isStuck && this.polygon.bounds.width >= this.shapeBounds.width) {
                this.isNoisy = true;
                // first get coordinates of large circle
                if (this.bigCoordinates.length === 0) {
                    this.polygon.segments.forEach((segment, i) => {
                        this.bigCoordinates[i] = [segment.point.x, segment.point.y];
                    });
                }

                // loop over all points of the polygon
                this.polygon.segments.forEach((segment, i) => {

                    // get new noise value
                    // we divide event.count by noiseScale to get a very smooth value
                    const noiseX = this.noiseObjects[i].noise2D(event.count / this.noiseScale, 0);
                    const noiseY = this.noiseObjects[i].noise2D(event.count / this.noiseScale, 1);

                    // map the noise value to our defined range
                    const distortionX = map(noiseX, -1, 1, -this.noiseRange, this.noiseRange);
                    const distortionY = map(noiseY, -1, 1, -this.noiseRange, this.noiseRange);

                    // apply distortion to coordinates
                    const newX = this.bigCoordinates[i][0] + distortionX;
                    const newY = this.bigCoordinates[i][1] + distortionY;

                    // set new (noisy) coodrindate of point
                    segment.point.set(newX, newY);
                });

            }
            this.polygon.smooth();
        };
    }

};

export default CustomCursor;
