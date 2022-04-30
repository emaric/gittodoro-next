import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import { AppProps } from 'next/app'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GithubAuthProvider>
      <Component {...pageProps} />
    </GithubAuthProvider>
  )
}

export default MyApp