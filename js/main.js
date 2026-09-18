import { getTheme, setTheme, toggleTheme } from "./theme.js"

setTheme(getTheme())

const themeButton = document.querySelector("#theme-button")

themeButton.addEventListener("click", toggleTheme)
