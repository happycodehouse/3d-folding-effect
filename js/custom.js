gsap.registerPlugin(ScrollTrigger);

class Text3d {
    constructor() {
        this.section = document.querySelector("#text3d");
        this.contentWrapper = document.querySelector(".content_wrapper");
        this.contentOriginal = document.querySelector("#content");
        this.contents = Array.from(document.querySelectorAll(".content"));

        this.scrollers = [];
        this.state = { disposed: false, scroll: 0, targetScroll: 0 };
        this.contentCenter = this.contents[Math.floor(this.contents.length / 2)];

        this.init();
    }

    setContent() {
        for (let i = 0; i < this.contents.length; i ++) {
            const content = this.contents[i];
            const cloneContent = this.contentOriginal.cloneNode(true);

            cloneContent.removeAttribute("id");

            const sizeFixEle = document.createElement("div");
            sizeFixEle.classList.add("content-size-fix");

            const item = document.createElement("div");
            item.classList.add("item");

            sizeFixEle.appendChild(item);
            item.appendChild(cloneContent);
            content.appendChild(sizeFixEle);

            this.scrollers[i] = item;
        }
    }

    updateStyles(scroll) {
        this.scrollers.forEach((scroller) => {
            scroller.children[0].style.transform = `translateY(${scroll}px)`;
        });
    }

    updateHeight() {
        this.section.style.height = this.scrollers[0].children[0].clientHeight - this.contentCenter.clientHeight + window.innerHeight + "px";
    }

    lerp(current, target, speed = 0.1, limit = 0.001) {
        let change = (target - current) * speed;

        if (Math.abs(change) < limit) {
            change = target - current;
        }

        return change;
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
        this.tick();
    }

    dispose() {
        this.state.disposed = true;
    }
}

class Image3d {
    constructor() {
        this.dom = document.querySelector("#image3d");
        this.init();
    }

    init() {
        // 여기에 이미지 관련 애니메이션 로직
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    const text3d = new Text3d();
    const image3d = new Image3d();
});