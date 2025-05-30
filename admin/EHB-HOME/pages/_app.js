
import '../styles/globals.css'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove any service worker that might be causing caching issues
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister()
      })
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
