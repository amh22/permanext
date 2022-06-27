import { useState, useRef } from 'react'
import { ThemeProvider } from 'theme-ui'
import { WebBundlr } from '@bundlr-network/client'
import { providers } from 'ethers'
import Theme from '../theme'
import Layout from '../components/layout'
import '../styles.css'

function App({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState()
  const [balance, setBalance] = useState(0)

  // set the base currency as matic (this can be changed later in the app)
  const [currency, setCurrency] = useState('matic')
  const bundlrRef = useRef()

  // create a function to connect to bundlr network
  async function initialiseBundlr() {
    await window.ethereum.enable()

    const provider = new providers.Web3Provider(window.ethereum)
    await provider._ready()

    const bundlr = new WebBundlr('https://node1.bundlr.network', currency, provider)
    await bundlr.ready()

    setBundlrInstance(bundlr)
    bundlrRef.current = bundlr
    // fetchBalance()
  }

  return (
    <ThemeProvider theme={Theme}>
      <Layout>
        <button onClick={initialiseBundlr}>Connect Bundlr</button>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default App
