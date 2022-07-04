/** @jsxImportSource theme-ui */
import { useContext, useState } from 'react'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { MainContext } from '../context'
import ContainerPage from '../components/container-page'

export default function Home() {
  const [fundingAmount, setFundingAmount] = useState()
  const [file, setFile] = useState()
  console.log('🚀 ~ file: index.js ~ line 11 ~ Home ~ file', file)
  const [image, setImage] = useState()
  const [URI, setURI] = useState() // a link for user to view the upload on the Arweave network

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

  // handle image file upload
  function onFileChange(e) {
    console.log('🚀 ~ file: index.js ~ line 40 ~ onFileChange ~ e', e)
    const file = e.target.files[0]
    // make sure there is a file
    if (file) {
      // give us a nice way to VIEW the IMAGE in our UI
      const image = URL.createObjectURL(file)
      setImage(image)
      // now to save the FILE locally
      // this is the encoded file sent to Arweave
      let reader = new FileReader()
      reader.onload = function () {
        if (reader.result) {
          setFile(Buffer.from(reader.result)) // save the file locally
        }
        console.log('line 56 - file:', file)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // handle upload of image file to Arweave via bundlr
  async function uploadFile() {
    let tx = await bundlrInstance.uploader.upload(file, [{ name: 'Content-Type', value: 'image/png' }])
    console.log('🚀 ~ uploadFile ~ tx', tx)
    fetchBalance()
    setURI(`http://arweave.net/${tx.data.id}`)
  }

  return (
    <ContainerPage>
      <h3 sx={{ color: 'primary' }}>Landing Page: Gallery</h3>
      {!balance && <button onClick={initialise}>1. Connect Bundlr</button>}
      {balance && (
        <>
          <div>
            <h3>1. Connect Bundlr</h3>
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

          {/* choose file */}
          <div>
            <h4>2. Choose Image</h4>
            <h5>Select the image you want to upload.</h5>
            <input type='file' onChange={onFileChange} />
            {/* <button onClick={uploadFile}>Upload File</button> */}
          </div>
          <div sx={{ pt: 4, border: '1px solid red' }}>
            {image && (
              <Image alt='The uploaded image' src={image} width='240px' height='100%'>
                poop
              </Image>
            )}
          </div>

          {/* encrypt file */}
          <div>
            <h4>3. Encrypt Image</h4>
            <h5>Encrypt your image.</h5>

            <button>Encypt Image</button>
          </div>

          {/* upload file */}
          <div>
            <h4>4. Upload File</h4>
            <h5>Upload your file to the permaweb.</h5>
            <button onClick={uploadFile}>Upload File</button>
          </div>

          {/* display Arweave URI */}
          <div>
            {URI && <h5>View the file stored on the Arweave network:</h5>}
            {URI && <a href={URI}>{URI}</a>}
          </div>
        </>
      )}
    </ContainerPage>
  )
}
