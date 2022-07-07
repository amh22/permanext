import { useState, useRef } from 'react'
import { ThemeProvider } from 'theme-ui'
import { WebBundlr } from '@bundlr-network/client'
import { providers, utils } from 'ethers'
// import lit from '../utils/lit'
import Theme from '../theme'
import { MainContext } from '../context'
import Layout from '../components/layout'
import '../styles.css'

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

  async function fetchCostToUploadFile(fileSize) {
    console.log('🚀 ~ file: index.js ~ line 156 ~ costToUploadFile ~ fileSize', fileSize)
    if (fileSize) {
      const cost = await bundlrRef.current.getPrice(fileSize)
      const costFormatted = utils.formatEther(cost.toString())
      return costFormatted
    }
  }

  return (
    <MainContext.Provider
      value={{
        initialiseBundlr,
        bundlrInstance,
        fetchBalance,
        balance,
        fetchCostToUploadFile,
      }}
    >
      <ThemeProvider theme={Theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </MainContext.Provider>
  )
}

export default App
