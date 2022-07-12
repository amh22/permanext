import { useState, useRef } from 'react'
import { ThemeProvider } from 'theme-ui'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider, darkTheme, midnightTheme } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { WebBundlr } from '@bundlr-network/client'
import { providers, utils } from 'ethers'
import Theme from '../theme'
import { MainContext } from '../context'
import Layout from '../components/Layout'
import '../styles.css'

const { chains, provider } = configureChains(
  [chain.polygon],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
)

const APP_NAME = process.env.ARWEAVE_APP_NAME || 'YOUR_APP_NAME'

const { connectors } = getDefaultWallets({
  appName: APP_NAME,
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function App({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState()
  const [balance, setBalance] = useState()
  const bundlrRef = useRef()

  // set the base currency as matic (this can be changed later via the app UI)
  const [currency, setCurrency] = useState('matic')

  // create a function to connect to bundlr network
  async function initialiseBundlr() {
    await window.ethereum.enable()

    const provider = new providers.Web3Provider(window.ethereum)
    console.log('🚀 ~ file: _app.js ~ line 24 ~ initialiseBundlr ~ provider', provider)
    await provider._ready()

    const bundlr = new WebBundlr('https://node1.bundlr.network', currency, provider)
    await bundlr.ready()

    setBundlrInstance(bundlr)

    // set the current value of 'bundlrRef' to 'bundlr'
    // this then allows us to grab this instance of 'bundlr'
    // to use to update the user's bundlr balance in the fetchBalance()
    // function below (instead of having to save the bundlr reference to state..)
    bundlrRef.current = bundlr
    fetchBalance()
  }

  async function fetchBalance() {
    const bal = await bundlrRef.current.getLoadedBalance()
    console.log('🚀 ~ fetchBalance ~ balance ', utils.formatEther(bal.toString()))
    // format the returned value and store to state
    setBalance(utils.formatEther(bal.toString()))
  }

  return (
    <MainContext.Provider
      value={{
        initialiseBundlr,
        bundlrInstance,
        fetchBalance,
        balance,
      }}
    >
      <ThemeProvider theme={Theme}>
        <Layout>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <Component {...pageProps} />
            </RainbowKitProvider>
          </WagmiConfig>
        </Layout>
      </ThemeProvider>
    </MainContext.Provider>
  )
}

export default App
