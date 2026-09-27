import productModal from "./product-modal.js"

class Catalog {
    selectors = {
        products: ".catalog-products",
        tabs: ".tabs-filter",
        tab: "[data-category]",
        card: ".catalog-item",
        grid: "#catalog-grid",
        showMoreButton: "#show-more",
    }

    classes = {
        active: "is-active",
        hidden: "is-hidden",
    }

    attributes = {
        ariaCurrent: "aria-current",
        ariaHaspopup: "aria-haspopup",
    }

    dataUrl = "data/products.json"
    imagesBasePath = "assets/images/"

    INITIAL_MOBILE_COUNT = 4

    mobileQuery = "(max-width: 768px)"

    constructor() {
        this.bindEvents()
    }

    async bindEvents() {
        this.products = document.querySelector(this.selectors.products)
        this.tabsWrapper = document.querySelector(this.selectors.tabs)
        this.grid = document.querySelector(this.selectors.grid)
        this.showMoreButton = document.querySelector(this.selectors.showMoreButton)

        const requiredElements = [this.products, this.tabsWrapper, this.grid, this.showMoreButton]
        if (requiredElements.some((el) => !el)) {
            return
        }

        this.tabs = [...this.tabsWrapper.querySelectorAll(this.selectors.tab)]
        this.currentCategory = this.tabs[0]?.dataset.category
        this.isExpanded = false
        this.mediaQuery = window.matchMedia(this.mobileQuery)

        try {
            this.allProducts = await this.loadProducts()
        } catch (error) {
            this.showError()
            return
        }

        this.setActiveTab(this.tabs[0])
        this.render()

        this.tabsWrapper.addEventListener("click", this.handleTabClick.bind(this))
        this.showMoreButton.addEventListener("click", this.handleShowMore.bind(this))
        this.grid.addEventListener("click", this.handleCardClick.bind(this))
        this.grid.addEventListener("keydown", this.handleCardKeydown.bind(this))
        this.mediaQuery.addEventListener("change", this.handleMediaChange.bind(this))
    }

    async loadProducts() {
        const response = await fetch(this.dataUrl)
        if (!response.ok) {
            throw new Error(`Failed to load products: ${response.status}`)
        }
        return response.json()
    }

    showError() {
        const message = document.createElement("p")
        message.className = "body-medium"
        message.textContent = "Failed to load products. Please try again later."
        this.grid.replaceChildren(message)
        this.showMoreButton.classList.remove(this.classes.active)
    }

    handleTabClick(event) {
        const tab = event.target.closest(this.selectors.tab)
        if (!tab || tab.dataset.category === this.currentCategory) return

        this.currentCategory = tab.dataset.category
        this.isExpanded = false
        this.setActiveTab(tab)
        this.render()
    }

    handleCardClick(event) {
        const card = event.target.closest(this.selectors.card)
        if (!card) return

        productModal.open(this.allProducts[card.dataset.index])
    }

    handleCardKeydown(event) {
        if (event.key !== "Enter" && event.key !== " ") return

        event.preventDefault()
        this.handleCardClick(event)
    }

    handleShowMore() {
        this.isExpanded = true
        this.render()
    }

    handleMediaChange(event) {
        if (event.matches) {
            this.isExpanded = false
            this.render()
        }
    }

    setActiveTab(activeTab) {
        this.tabs.forEach((tab) => {
            const isActive = tab === activeTab
            tab.classList.toggle(this.classes.active, isActive)
            if (isActive) {
                tab.setAttribute(this.attributes.ariaCurrent, "true")
            } else {
                tab.removeAttribute(this.attributes.ariaCurrent)
            }
        })
    }

    getFiltered() {
        return this.allProducts.filter((product) => product.category === this.currentCategory)
    }

    render() {
        const filtered = this.getFiltered()
        const hasHidden = !this.isExpanded && filtered.length > this.INITIAL_MOBILE_COUNT

        const cards = filtered.map((product, index) => {
            const card = this.createCard(product)
            card.classList.toggle(this.classes.hidden, hasHidden && index >= this.INITIAL_MOBILE_COUNT)
            return card
        })

        this.grid.replaceChildren(...cards)
        this.showMoreButton.classList.toggle(this.classes.active, hasHidden)
    }

    createCard(product) {
        const card = document.createElement("div")
        card.className = "catalog-item"
        card.dataset.index = this.allProducts.indexOf(product)
        card.tabIndex = 0
        card.setAttribute("role", "button")
        card.setAttribute(this.attributes.ariaHaspopup, "dialog")

        const imageWrapper = document.createElement("div")
        imageWrapper.className = "catalog-image-wrapper"

        const image = document.createElement("img")
        image.className = "catalog-image"
        image.src = `${this.imagesBasePath}${product.image}`
        image.alt = product.name
        image.loading = "lazy"

        const content = document.createElement("div")
        content.className = "catalog-content"

        const title = document.createElement("h2")
        title.className = "heading-3"
        title.textContent = product.name

        const description = document.createElement("p")
        description.className = "body-medium"
        description.textContent = product.description

        const price = document.createElement("p")
        price.className = "heading-3"
        price.textContent = `$${product.price}`

        content.append(title, description, price)
        imageWrapper.append(image)
        card.append(imageWrapper, content)
        return card
    }
}

export default new Catalog()
