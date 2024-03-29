import { useState, useRef } from 'react'
import { ThemeProvider } from 'theme-ui'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider, darkTheme, midnightTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { WebBundlr } from '@bundlr-network/client'
import { providers, utils } from 'ethers'
import Theme from '../theme'
import { MainContext } from '../context'
import Layout from '../components/Layout'
import '../styles.css'

const APP_NAME = process.env.ARWEAVE_APP_NAME || 'YOUR_APP_NAME'

// 👇 ============= Wagmi and RainbowKit config =============

// Configure the Chains / Networks we want to support along with Provider/s  (RPCs) for the Chains
const { chains, provider } = configureChains(
  [chain.polygon], // we are only supporting Polygon
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()] // <- set RPC provider to Alchemy, and in case Alchemy does not support the chain, fall back to the public RPC URL
)

// getDefaultWallets function sets up the following wallets:
// Rainbow, MetaMask, WalletConnect, Coinbase
const { connectors } = getDefaultWallets({
  appName: APP_NAME,
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

// 👇 ============= Our App =============

function App({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState()
  const [createdBy, setCreatedBy] = useState()
  const [balance, setBalance] = useState()
  const bundlrRef = useRef()
  const [currency, setCurrency] = useState('matic') // <- set the base currency as matic (this can be changed later via the app UI)

  // ============= Bundlr Config =============

  // create a function to connect to bundlr network
  async function initialiseBundlr() {
    // We are using MetaMask to sign the connection to Bundlr
    // Remember we have already asked a user to choose which wallet they want to connect to our dApp with (using RainbowKit in the Header)
    // await ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new providers.Web3Provider(window.ethereum)
    await provider._ready()

    // const bundlr = new WebBundlr('https://node1.bundlr.network', currency, provider)

    // Our Alchemy Polygon Provider
    const bundlr = new WebBundlr('https://node1.bundlr.network', currency, provider, {
      providerUrl: process.env.ALCHEMY_RPC_URL,
    })

    await bundlr.ready()

    const ownerAddress = bundlr.address // <- get owner address so we can post it as a tag when uploading to Arweave, then we can query connected wallet addresses

    setCreatedBy(ownerAddress)
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
    const balToString = utils.formatEther(bal.toString())
    const balRounded = balToString.substring(0, 4)
    // format the returned value and store to state
    setBalance(balRounded)
  }

  return (
    <MainContext.Provider
      value={{
        initialiseBundlr,
        bundlrInstance,
        fetchBalance,
        balance,
        createdBy,
      }}
    >
      <ThemeProvider theme={Theme}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            coolMode // <- add a little flair for fun!
            chains={chains}
            theme={lightTheme({
              accentColor: '#3cf', // <- active network indicator color
              accentColorForeground: 'white', // <- label color of the active network
              borderRadius: 'large',
              fontStack: 'system',
            })}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </MainContext.Provider>
  )
}

export default App
