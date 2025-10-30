import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import store from "./store"

import {useState} from "react"
import {MantineProvider} from "@mantine/core"
import {Notifications} from "@mantine/notifications" // Import Notifications

import {theme} from "./theme"
import {Provider} from "react-redux"
import {BrowserRouter} from "react-router-dom"

import {AppShellLayout} from "./layout/AppShellLayout"

function App() {
  return (
    <MantineProvider
      theme={theme}
      styles={{
        global: () => ({
          ":root": {
            "--mantine-breakpoint-sm": "768px"
          }
        })
      }}
    >
      <Provider store={store}>
        <Notifications position="top-center" autoClose={3000} />
        <BrowserRouter>{<AppShellLayout />}</BrowserRouter>
      </Provider>
    </MantineProvider>
  )
}

export default App
