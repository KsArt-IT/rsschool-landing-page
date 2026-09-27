class ThemeSwitcher {
    selectors = {
        themeButton: "#theme-button",
    }

    themes = {
        light: "light",
        dark: "dark",
    }

    storageKey = "theme"

    get theme() {
        const stored = localStorage.getItem(this.storageKey)
        return Object.values(this.themes).includes(stored) ? stored : this.themes.light
    }

    set theme(value) {
        document.body.dataset.theme = value
        localStorage.setItem(this.storageKey, value)
    }

    constructor() {
        this.setInitialState()
        this.bindEvents()
    }

    setInitialState() {
        this.theme = this.theme
    }

    bindEvents() {
        this.themeButtonElement = document.querySelector(this.selectors.themeButton)

        if (!this.themeButtonElement) return

        this.themeButtonElement.addEventListener("click", this.toggleTheme.bind(this))
    }

    toggleTheme() {
        this.theme = this.theme === this.themes.light ? this.themes.dark : this.themes.light
    }
}

export default new ThemeSwitcher()
