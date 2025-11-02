import ENV from './env'

/**
 * Updates HTML meta tags dynamically based on environment configuration
 * This runs at application startup to set church-specific metadata
 */
export const updateMetaTags = () => {
  const churchNameAr = ENV.CHURCH_NAME_AR || 'كنيسة القديس مارمرقس'
  const churchNameEn = ENV.CHURCH_NAME_EN || 'Saint Mark Church - Maadi'
  const churchId = ENV.API_CHURCH_ID || '63cd11f4808cc1923ca5f3ca'
  const siteUrl = ENV.SITE_URL || 'http://localhost:5173'

  // Use Arabic name for title (primary language)
  document.title = churchNameAr

  // Update Open Graph meta tags
  updateMetaTag('og:title', churchNameAr)
  updateMetaTag('twitter:title', churchNameAr)
  updateMetaTag('og:url', siteUrl)

  // Update og:image with dynamic church ID
  const ogImageUrl = `https://storage.googleapis.com/church-profiles/${churchId}/site%20materials/ogimage.jpg?v=60`
  updateMetaTag('og:image', ogImageUrl)
  updateMetaTag('twitter:image', ogImageUrl)

  console.log(`Meta tags updated for: ${churchNameAr} / ${churchNameEn}`)
  console.log(`Site URL: ${siteUrl}, Church ID: ${churchId}`)
}

/**
 * Helper function to update or create a meta tag
 * @param {string} property - The meta tag property (og:title, twitter:title, etc)
 * @param {string} content - The content value
 */
const updateMetaTag = (property, content) => {
  // Try to find existing meta tag by property
  let metaTag = document.querySelector(`meta[property="${property}"]`)

  // If not found by property, try by name
  if (!metaTag) {
    metaTag = document.querySelector(`meta[name="${property}"]`)
  }

  if (metaTag) {
    metaTag.setAttribute('content', content)
  } else {
    // Create new meta tag if it doesn't exist
    const newMetaTag = document.createElement('meta')
    newMetaTag.setAttribute('property', property)
    newMetaTag.setAttribute('content', content)
    document.head.appendChild(newMetaTag)
  }
}
