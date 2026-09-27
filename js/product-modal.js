class ProductModal {
    selectors = {
        modal: "#product-modal",
        image: "#modal-image",
        title: "#modal-title",
        description: "#modal-description",
        sizes: "#modal-sizes",
        additives: "#modal-additives",
        total: "#modal-total",
        closeButton: "#modal-close",
        option: "[data-value]",
    }

    classes = {
        active: "is-active",
        option: "button-item action-link",
        badge: "button-item-badge",
    }

    attributes = {
        ariaPressed: "aria-pressed",
        ariaHidden: "aria-hidden",
    }

    imagesBasePath = "assets/images/"

    constructor() {
        this.bindEvents()
    }

    bindEvents() {
        this.modal = document.querySelector(this.selectors.modal)
        if (!this.modal) return

        this.image = this.modal.querySelector(this.selectors.image)
        this.title = this.modal.querySelector(this.selectors.title)
        this.description = this.modal.querySelector(this.selectors.description)
        this.sizesList = this.modal.querySelector(this.selectors.sizes)
        this.additivesList = this.modal.querySelector(this.selectors.additives)
        this.total = this.modal.querySelector(this.selectors.total)
        this.closeButton = this.modal.querySelector(this.selectors.closeButton)

        this.closeButton.addEventListener("click", this.close.bind(this))
        this.modal.addEventListener("pointerdown", this.handlePointerDown.bind(this))
        this.modal.addEventListener("click", this.handleBackdropClick.bind(this))
        this.sizesList.addEventListener("click", this.handleSizeClick.bind(this))
        this.additivesList.addEventListener("click", this.handleAdditiveClick.bind(this))
    }

    open(product) {
        if (!this.modal) return

        this.product = product
        this.selectedSize = Object.keys(product.sizes)[0]
        this.selectedAdditives = new Set()

        this.image.src = `${this.imagesBasePath}${product.image}`
        this.image.alt = product.name
        this.title.textContent = product.name
        this.description.textContent = product.description

        this.renderSizes()
        this.renderAdditives()
        this.updateTotal()

        this.modal.showModal()
    }

    close() {
        this.modal.close()
    }

    handlePointerDown(event) {
        this.pointerDownTarget = event.target
    }

    handleBackdropClick(event) {
        if (event.target === this.modal && this.pointerDownTarget === this.modal) {
            this.close()
        }
    }

    handleSizeClick(event) {
        const option = event.target.closest(this.selectors.option)
        if (!option || option.dataset.value === this.selectedSize) return

        this.selectedSize = option.dataset.value
        this.renderSizes()
        this.updateTotal()
    }

    handleAdditiveClick(event) {
        const option = event.target.closest(this.selectors.option)
        if (!option) return

        const index = Number(option.dataset.value)
        if (this.selectedAdditives.has(index)) {
            this.selectedAdditives.delete(index)
        } else {
            this.selectedAdditives.add(index)
        }
        this.setOptionState(option, this.selectedAdditives.has(index))
        this.updateTotal()
    }

    renderSizes() {
        const options = Object.entries(this.product.sizes).map(([key, { size }]) =>
            this.createOption(key, key.toUpperCase(), size, key === this.selectedSize),
        )
        this.sizesList.replaceChildren(...options)
    }

    renderAdditives() {
        const options = this.product.additives.map(({ name }, index) =>
            this.createOption(index, index + 1, name, this.selectedAdditives.has(index)),
        )
        this.additivesList.replaceChildren(...options)
    }

    createOption(value, badgeText, label, isActive) {
        const button = document.createElement("button")
        button.type = "button"
        button.className = this.classes.option
        button.dataset.value = value

        const badge = document.createElement("span")
        badge.className = this.classes.badge
        badge.setAttribute(this.attributes.ariaHidden, "true")
        badge.textContent = badgeText

        button.append(badge, label)
        this.setOptionState(button, isActive)
        return button
    }

    setOptionState(option, isActive) {
        option.classList.toggle(this.classes.active, isActive)
        option.setAttribute(this.attributes.ariaPressed, String(isActive))
    }

    updateTotal() {
        const sizePrice = Number(this.product.sizes[this.selectedSize]["add-price"])
        const additivesPrice = [...this.selectedAdditives].reduce(
            (sum, index) => sum + Number(this.product.additives[index]["add-price"]),
            0,
        )
        const total = Number(this.product.price) + sizePrice + additivesPrice
        this.total.textContent = `$${total.toFixed(2)}`
    }
}

export default new ProductModal()
