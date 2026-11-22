// The theme, in one place. The `dark` class on <html> is the theme: the server renders it, the
// script below removes it before the first paint for visitors who picked light, and the toggle
// flips it. CSS keys everything (colours, which toggle icon shows) on that class.

/** Where a visitor's choice is saved: "light" or "dark". */
export const THEME_KEY = "theme";

/** For a <script> in <head>: dark unless the visitor picked light. Runs before the first paint. */
export const THEME_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(THEME_KEY)})==="light")document.documentElement.classList.remove("dark")}catch(e){}`;
