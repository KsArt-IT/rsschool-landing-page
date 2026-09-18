export function getTheme() {
    return localStorage.getItem("theme") || "light"
}

export function setTheme(theme) {
    document.body.dataset.theme = theme
    localStorage.setItem("theme", theme)
}

export function toggleTheme() {
    const currentTheme = getTheme()
    const newTheme = currentTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
}
