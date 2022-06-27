/** @jsxImportSource theme-ui */
import { useContext, useState } from 'react'
import BigNumber from 'bignumber.js'
import { MainContext } from '../context'
import ContainerPage from '../components/container-page'

export default function Home() {
  const [file, setFile] = useState()
  const [image, setImage] = useState()
  // a link for user to view the upload on the Arweave network
  const [URI, setURI] = useState()
  const [fundingAmount, setFundingAmount] = useState()

  const { initialiseBundlr, bundlrInstance, fetchBalance, balance } = useContext(MainContext)

  async function initialise() {
    initialiseBundlr()
  }

  // allow user to fund their wallet
  async function fundWallet() {
    if (!fundingAmount) return
    const amountParsed = parseInput(fundingAmount)
    let response = await bundlrInstance.fund(amountParsed)
    console.log('🚀 ~ Wallet funded', response)
    fetchBalance()
  }

  function parseInput(input) {
    const conv = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1])
    if (conv.isLessThan(1)) {
      console.log('Error: value is too small')
      return
    } else {
      return conv
    }
  }

  return (
    <ContainerPage>
      <h3 sx={{ color: 'primary' }}>Landing Page: Gallery</h3>
      {!balance && <button onClick={initialise}>Connect Bundlr</button>}
      {balance && (
        <>
          <div>
            <h4>You are connected to bundlr</h4>
            <h4>Your bundlr Balance: {balance}</h4>
          </div>
          <div style={{ padding: '30px 0' }}>
            <input
              // type='text'
              placeholder='Amount to fund bundlr wallet'
              onChange={(e) => setFundingAmount(e.target.value)}
              sx={{ width: '200px' }}
            />
            <button onClick={fundWallet}>Fund Wallet</button>
          </div>
        </>
      )}
    </ContainerPage>
  )
}
