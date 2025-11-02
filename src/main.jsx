import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import App from "./App.jsx"
import "./i18n/i18n"
import {updateMetaTags} from "./utils/updateMetaTags"

// Update meta tags with church-specific information
updateMetaTags()

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope)
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error)
      })
  })
}

createRoot(document.getElementById("root")).render(
  // note strickMode make the code run twice this will be noticed in useEffect, this happened only in the development mode
  // StrictMode can be a bit surprising with that double-render in development,
  // Just remember, this behavior doesn’t happen in production, so you’re good to go!
  <StrictMode>
    <App />
  </StrictMode>
)
