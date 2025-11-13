gsap.registerPlugin(ScrollTrigger);

class FoldedContent {
    constructor(section, contentOriginalSelector, contentSelector) {
        this.section = section;
        this.contentOriginal = this.section.querySelector(contentOriginalSelector);
        this.contents = Array.from(this.section.querySelectorAll(contentSelector));

        this.scrollers = [];
        this.state = {disposed: false, scroll: 0, targetScroll: 0};
    }

    setContent() {
        for (let i = 0; i < this.contents.length; i++) {
            const content = this.contents[i];
            const cloneContent = this.contentOriginal.cloneNode(true);

            cloneContent.removeAttribute("id");

            const sizeFixEle = document.createElement("div");
            sizeFixEle.classList.add("content-size-fix");

            const scroller = document.createElement("div");
            scroller.classList.add("content-scroller");

            sizeFixEle.appendChild(scroller);
            scroller.appendChild(cloneContent);
            content.appendChild(sizeFixEle);

            this.scrollers[i] = scroller;
        }
    }

    // Linear Interpolation
    lerp(current, target, speed = 0.1, limit = 0.001) {
        let change = (target - current) * speed;

        if (Math.abs(change) < limit) {
            change = target - current;
        }

        return change;
    }
}

class Text3d extends FoldedContent {
    constructor() {
        const section = document.querySelector("#text3d");
        super(section, "#content", ".content");

        this.contentCenter = this.contents[Math.floor(this.contents.length / 2)];
        this.init();
    }

    updateStyles(scroll) {
        this.scrollers.forEach((scroller) => {
            scroller.children[0].style.transform = `translateY(${scroll}px)`;
        });
    }

    updateHeight() {
        this.section.style.height = this.scrollers[0].children[0].clientHeight - this.contentCenter.clientHeight + window.innerHeight + "px";
    }

    tick = () => {
        if (this.state.disposed) return;

        this.updateHeight();

        this.state.targetScroll = -(document.documentElement.scrollTop || document.body.scrollTop);

        this.state.scroll += this.lerp(
            this.state.scroll,
            this.state.targetScroll,
            0.1,
            0.0001
        );

        this.updateStyles(this.state.scroll);
        requestAnimationFrame(this.tick);
    }

    setupResizeListener() {
        window.addEventListener("resize", () => {
            this.updateHeight();
        });
    }

    init() {
        this.setContent();
        this.setupResizeListener();
        this.tick();
    }

    dispose() {
        this.state.disposed = true;
    }
}

class Image3d extends FoldedContent {
    constructor() {
        const section = document.querySelector("#image3d");
        super(section, "#characters", ".content");

        this.drag = document.querySelector("#drag");
        this.contentMain = this.contents[this.contents.length - 1];
        this.isDown = false;
        this.lastClientX = null;

        this.init();
    }

    updateStyles(scroll) {
        this.scrollers.forEach((scroller) => {
            scroller.children[0].style.transform = `translateX(${scroll}px)`;
        });
    }

    tick = () => {
        if (this.state.disposed) return;

        this.state.targetScroll = Math.max(Math.min(0, this.state.targetScroll), -this.scrollers[0].children[0].clientWidth + this.contentMain.clientWidth);

        this.state.scroll += this.lerp(
            this.state.scroll,
            this.state.targetScroll,
            0.1,
            0.0001
        );

        this.updateStyles(this.state.scroll);
        requestAnimationFrame(this.tick);
    }

    setupDragListener() {
        this.drag.addEventListener("mousedown", () => {
            this.isDown = true;
        });

        this.drag.addEventListener("mouseup", () => {
            this.isDown = false;
            this.lastClientX = null;
        });

        this.drag.addEventListener("mouseout", (e) => {
            const from = e.relatedTarget || e.toElement;

            if (!from || from.nodeName === "HTML") {
                this.isDown = false;
            }
        });

        this.drag.addEventListener("mousemove", (e) => {
            if (this.lastClientX && this.isDown) {
                this.state.targetScroll += e.clientX - this.lastClientX;
            }
            this.lastClientX = e.clientX;
        });
    }

    init() {
        this.setContent();
        this.setupDragListener();
        this.tick();
    }

    dispose() {
        this.state.disposed = true;
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    const text3d = new Text3d();
    const image3d = new Image3d();
});