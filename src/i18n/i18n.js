// شرح
// https://www.youtube.com/watch?v=lvP_64LjyZU
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import translationEn from "./en.json"
import translationAr from "./ar.json"
const lang = localStorage.getItem("lang")
const resources = {
  en: {
    translation: translationEn
  },
  ar: {
    translation: translationAr
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: lang || "ar",
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })

export default i18n
