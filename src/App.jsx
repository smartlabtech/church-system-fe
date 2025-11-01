import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/dates/styles.css"
import "./App.css"
import store from "./store"

import {MantineProvider, createTheme, DirectionProvider} from "@mantine/core"
import {DatesProvider} from "@mantine/dates"
import {Notifications} from "@mantine/notifications"
import {Provider} from "react-redux"
import {BrowserRouter} from "react-router-dom"
import {useEffect} from "react"
import {useTranslation} from "react-i18next"
import 'dayjs/locale/ar'
import 'dayjs/locale/en'

// Import the new simple layout
import {SimpleLayout} from "./layout/SimpleLayout"

// Import modern theme configuration
import { mantineThemeConfig } from './utils/theme/churchTheme'

// Import environment configuration
import {ENV} from './utils/env'

// Create modern theme
const modernTheme = createTheme(mantineThemeConfig)

function AppContent() {
  const {i18n} = useTranslation()
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language

    // Set document title based on language
    document.title = isRTL ? ENV.CHURCH_NAME_AR : ENV.CHURCH_NAME_EN
  }, [i18n.language, isRTL])

  return (
    <DirectionProvider initialDirection={isRTL ? 'rtl' : 'ltr'}>
      <MantineProvider theme={modernTheme}>
        <DatesProvider settings={{ locale: i18n.language, firstDayOfWeek: 0, weekendDays: [5, 6] }}>
          <Notifications position="top-center" autoClose={3000} />
          <BrowserRouter>
            <SimpleLayout />
          </BrowserRouter>
        </DatesProvider>
      </MantineProvider>
    </DirectionProvider>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App