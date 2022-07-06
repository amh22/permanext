/** @jsxImportSource theme-ui */
import { useContext, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { MainContext } from '../context'
import DropZone from '../components/DropZone'
import prettyBytes from 'pretty-bytes'
import ContainerPage from '../components/ContainerPage'

export default function Home() {
  const [fundingAmount, setFundingAmount] = useState()
  const [file, setFile] = useState()
  const [fileTypeError, setFileTypeError] = useState({ error: false, message: '' })
  const [fileSize, setFileSize] = useState(null)
  const [image, setImage] = useState()
  const [URI, setURI] = useState() // <- a link for user to view the upload on the Arweave network

  const { initialiseBundlr, bundlrInstance, fetchBalance, balance } = useContext(MainContext)

  async function initialise() {
    initialiseBundlr()
  }

  // ============= Allow User To Fund Their Wallet =============
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

  // ============= Handle Image File Selection with DROPZONE =============
  const onDropFile = useCallback(async (acceptedFiles) => {
    const supportedFileTypes = ['image/jpeg', 'image/png'] // <- define the accepted file types

    const file = acceptedFiles[0] // <- we only return a single file

    // 👇 check submitted file type
    if (!supportedFileTypes.includes(file.type)) {
      setFileTypeError({
        error: true,
        message: `Incorrect file type! We only support ${supportedFileTypes.toString()} at the moment`,
      })
      return
    }

    if (file) {
      setFileTypeError({
        error: false,
        message: '',
      })
      // 👇 give us a nice way to VIEW the IMAGE in our UI
      const image = URL.createObjectURL(file)
      console.log('🚀 ~ file: index.js ~ line 79~ image', image)
      setImage(image) // <- now to save the FILE locally

      const fileReader = new FileReader() // <- we use the FileReader API to read the image as a data URL

      fileReader.onload = async (e) => {
        const dataURL = e.target.result

        console.log('DataURL:', dataURL)

        setFile(dataURL)

        setFileSize(prettyBytes(dataURL.length))
      }

      fileReader.readAsDataURL(file)
    }
  }, [])

  // ============= Handle Image File Selection =============
  function onFileChange(e) {
    console.log('🚀 ~ file: index.js ~ line 40 ~ onFileChange ~ e', e)
    const file = e.target.files[0]

    if (file) {
      // 👇 give us a nice way to VIEW the IMAGE in our UI
      const image = URL.createObjectURL(file)
      console.log('🚀 ~ file: index.js ~ line 79~ image', image)
      setImage(image) // <- now to save the FILE locally

      // 👇 this is the encoded file sent to Arweave
      let reader = new FileReader()
      reader.onload = function () {
        if (reader.result) {
          setFile(Buffer.from(reader.result)) // <- save the file locally
        }
        console.log('line 87 - file:', file)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // ============= Handle Upload of Image To Arweave Via Bundlr =============
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
          {/* ============= Step 1 ============= */}
          <div>
            <h3>1. Connect To Bundlr</h3>
            <h4>You are connected to bundlr</h4>
            <h4>Your bundlr Balance: {balance}</h4>
          </div>

          {/* ---- fund your bundlr wallet ---- */}
          <div style={{ padding: '30px 0' }}>
            <input
              // type='text'
              placeholder='Amount to fund bundlr wallet'
              onChange={(e) => setFundingAmount(e.target.value)}
              sx={{ width: '200px' }}
            />
            <button onClick={fundWallet}>Fund Wallet</button>
          </div>

          {/* ============= Step 2 ============= */}
          <div>
            <h4>2. Choose An Image</h4>
            <h5>Select the image you want to upload.</h5>
            {/* <input type='file' onChange={onFileChange} /> */}
            {/* <button onClick={uploadFile}>Upload File</button> */}
            <DropZone onDrop={onDropFile} />
          </div>

          {fileTypeError.error && (
            <div sx={{ pt: 4, border: '1px solid red' }}>
              <p>{fileTypeError.message}</p>
            </div>
          )}
          {/* ---- show the selected image ---- */}
          {image && (
            <div sx={{ pt: 4, border: '1px solid red' }}>
              <Image alt='The uploaded image' src={image} width='240px' height='100%'></Image>
            </div>
          )}

          {/* ============= Step 3 ============= */}
          <div>
            <h4>3. Encrypt Your Image</h4>
            <h5>Encrypt your image.</h5>
            <button>Encypt Image</button>
          </div>

          {/* ============= Step 4 ============= */}
          <div>
            <h4>4. Upload Your File</h4>
            <h5>Upload your file to the permaweb.</h5>
            <button onClick={uploadFile}>Upload File</button>
          </div>

          {/* ---- display Arweave URI ---- */}
          <div>
            {URI && <h5>View the file stored on the Arweave network:</h5>}
            {URI && <a href={URI}>{URI}</a>}
          </div>
        </>
      )}
    </ContainerPage>
  )
}
