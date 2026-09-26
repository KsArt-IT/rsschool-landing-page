class SliderProduct {
    selectors = {
        product: ".slider-product",
        list: ".slider-list",
        slide: ".slider-slide",
        dotsWrapper: ".slider-dots",
        dot: ".slider-dot",
        prevButton: '[data-action="slider-prev"]',
        nextButton: '[data-action="slider-next"]',
    }

    attributes = {
        ariaCurrent: "aria-current",
        ariaHidden: "aria-hidden",
    }

    swipeThreshold = 40

    transitionDuration = 400

    constructor() {
        this.bindEvents()
    }

    bindEvents() {
        this.product = document.querySelector(this.selectors.product)
        this.list = document.querySelector(this.selectors.list)
        this.slides = this.list ? [...this.list.querySelectorAll(this.selectors.slide)] : []
        this.dotsWrapper = document.querySelector(this.selectors.dotsWrapper)
        this.dots = this.dotsWrapper ? [...this.dotsWrapper.querySelectorAll(this.selectors.dot)] : []
        this.prevButton = document.querySelector(this.selectors.prevButton)
        this.nextButton = document.querySelector(this.selectors.nextButton)

        const requiredElements = [this.product, this.list, this.dotsWrapper, this.prevButton, this.nextButton]
        if (requiredElements.some((el) => !el) || this.slides.length < 2 || this.dots.length !== this.slides.length) {
            return
        }

        this.slidesCount = this.slides.length
        this.currentIndex = 1
        this.isAnimating = false
        this.touchStartX = null

        this.setupClones()
        this.goTo(this.currentIndex, { instant: true })

        this.prevButton.addEventListener("click", this.prev.bind(this))
        this.nextButton.addEventListener("click", this.next.bind(this))
        this.dotsWrapper.addEventListener("click", this.handleDotClick.bind(this))
        this.list.addEventListener("transitionend", this.handleTransitionEnd.bind(this))
        this.product.addEventListener("keydown", this.handleKeydown.bind(this))
        this.product.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: true })
        this.product.addEventListener("touchend", this.handleTouchEnd.bind(this))
    }

    setupClones() {
        const firstClone = this.slides[0].cloneNode(true)
        const lastClone = this.slides[this.slidesCount - 1].cloneNode(true)
        firstClone.setAttribute(this.attributes.ariaHidden, "true")
        lastClone.setAttribute(this.attributes.ariaHidden, "true")

        this.list.append(firstClone)
        this.list.prepend(lastClone)
        this.frames = [...this.list.querySelectorAll(this.selectors.slide)]
    }

    next() {
        this.goToSlide(this.currentIndex + 1)
    }

    prev() {
        this.goToSlide(this.currentIndex - 1)
    }

    goToSlide(index) {
        if (this.isAnimating) return
        this.isAnimating = true
        this.goTo(index)
    }

    handleTransitionEnd(event) {
        if (event.target !== this.list) return
        this.isAnimating = false

        if (this.currentIndex === 0) {
            this.goTo(this.slidesCount, { instant: true })
        } else if (this.currentIndex === this.frames.length - 1) {
            this.goTo(1, { instant: true })
        }
    }

    handleKeydown(event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
        event.preventDefault()
        event.key === "ArrowRight" ? this.next() : this.prev()
    }

    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX
    }

    handleTouchEnd(event) {
        if (this.touchStartX === null) return

        const deltaX = event.changedTouches[0].clientX - this.touchStartX
        this.touchStartX = null

        if (Math.abs(deltaX) < this.swipeThreshold) return

        deltaX < 0 ? this.next() : this.prev()
    }

    handleDotClick(event) {
        const dot = event.target.closest(this.selectors.dot)
        if (!dot || this.isAnimating) return

        const targetIndex = this.dots.indexOf(dot)
        if (targetIndex === -1) return

        this.isAnimating = true
        this.goTo(targetIndex + 1)
    }

    updateDots(realIndex) {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle("is-active", i === realIndex)
            dot.setAttribute(this.attributes.ariaCurrent, String(i === realIndex))
        })
    }

    goTo(index, { instant = false } = {}) {
        this.currentIndex = index
        this.list.style.transition = instant ? "none" : ""
        this.list.style.transform = `translateX(-${index * 100}%)`
        if (instant) this.list.offsetHeight

        this.updateDots(this.toRealIndex(index))
    }

    toRealIndex(index) {
        return (index - 1 + this.slidesCount) % this.slidesCount
    }
}

export default new SliderProduct()
