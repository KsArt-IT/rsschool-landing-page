class MenuBurger {
    selectors = {
        navMenu: "#nav-menu",
        menuBurger: "#menu-burger",
        menuLink: "#menu-link",
        burgerButton: "#burger-button",
    }

    attributes = {
        ariaExpanded: "aria-expanded",
        ariaLabel: "aria-label",
    }

    labels = {
        opened: "Close menu",
        closed: "Open menu",
    }

    breakpoint = "(min-width: 768px)"

    constructor() {
        this.bindEvents()
    }

    bindEvents() {
        this.navMenu = document.querySelector(this.selectors.navMenu)
        this.menuBurger = document.querySelector(this.selectors.menuBurger)
        this.menuLink = document.querySelector(this.selectors.menuLink)
        this.burgerButton = document.querySelector(this.selectors.burgerButton)

        const requiredElements = [this.navMenu, this.menuBurger, this.menuLink, this.burgerButton]
        if (requiredElements.some((el) => !el)) return

        this.setStateMenu()

        this.burgerButton.addEventListener("click", this.toggleMenu.bind(this))

        this.navMenu.addEventListener("click", this.handleMenuClick.bind(this))

        this.mediaQuery = window.matchMedia(this.breakpoint)
        this.mediaQuery.addEventListener("change", this.handleResetMenu.bind(this))

        document.addEventListener("keydown", this.handleResetMenu.bind(this))
    }

    toggleMenu() {
        const isOpen = this.burgerButton.getAttribute(this.attributes.ariaExpanded) === "true"
        this.setStateMenu(!isOpen)
    }

    handleMenuClick(event) {
        const link = event.target.closest("a")
        if (!link) return

        this.setStateMenu()
    }

    handleResetMenu(event) {
        if (
            event.matches ||
            (event.key === "Escape" && this.burgerButton.getAttribute(this.attributes.ariaExpanded) === "true")
        ) {
            this.setStateMenu()
        }
    }

    setStateMenu(isOpen = false) {
        this.burgerButton.setAttribute(this.attributes.ariaExpanded, String(isOpen))
        this.burgerButton.setAttribute(this.attributes.ariaLabel, isOpen ? this.labels.opened : this.labels.closed)
        document.body.dataset.menuExpanded = String(isOpen)
        document.body.style.overflow = isOpen ? "hidden" : ""
        const target = isOpen ? this.navMenu : this.menuBurger
        target.append(this.menuLink)
    }
}

export default new MenuBurger()
