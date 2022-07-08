/** @jsxImportSource theme-ui */
import { useContext, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { MainContext } from '../context'
import DropZone from '../components/DropZone'
import prettyBytes from 'pretty-bytes'
import { utils } from 'ethers'
import ContainerPage from '../components/ContainerPage'
import lit from '../libs/lit'

export default function Home() {
  const [fundingAmount, setFundingAmount] = useState(null)
  const [file, setFile] = useState(null)
  const [fileTypeError, setFileTypeError] = useState({ error: false, message: '' })
  const [fileName, setFileName] = useState(null)
  const [fileSizeInBytes, setFileSizeInBytes] = useState(null)
  const [fileSize, setFileSize] = useState(null)
  const [fileCost, setFileCost] = useState(null)
  const [image, setImage] = useState(null)
  const [accessConditions, setAccessConditions] = useState(null)
  const [encryptedData, setEncryptedData] = useState(null)
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState(null)
  const [txId, setTxId] = useState('g3U06X5C22t-PIVDIL0hdq0T_OKCcNMVVx2kDoDzLac')
  const [downloadedEncryptedData, setDownloadedEncryptedData] = useState(null)
  const [decryptedData, setDecryptedData] = useState(null)

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

  // ============= Handle Image File Selection with Dropezone =============
  const onDropFile = useCallback(async (acceptedFiles) => {
    const supportedFileTypes = ['image/jpeg', 'image/png'] // <- define the accepted file types

    const file = acceptedFiles[0] // <- we only return a single file
    console.log('🚀 ~ file: index.js ~ line 52 ~ onDropFile ~ file', file)

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

      setImage(image) // <- now to save the FILE locally

      // 👇 we use the FileReader API to read the image as a data URL
      const fileReader = new FileReader()

      fileReader.onload = async (e) => {
        const dataURL = e.target.result

        console.log('🚀 ~ file: index.js ~ line 80 ~ fileReader.onload= ~ dataURL', dataURL)
        console.log('🚀 ~  index.js ~ line 80 ~ dataURL LENGTH', dataURL.length)

        setFile(dataURL)
        setFileSizeInBytes(dataURL.length)
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

  // ============= Handle Image Encryption =============
  const onClickEncryptImage = async () => {
    // const fileInBase64 = btoa(file)
    const fileInBase64 = Buffer.from(file).toString('base64')

    console.log('fileInBase64:', fileInBase64)

    try {
      const encryptedFile = await lit.encrypt(fileInBase64)

      const encryptedFileInDataURI = await blobToDataURI(encryptedFile.encryptedContent)

      const accessConditions = await encryptedFile.accessConditions

      // 👇 get estimated cost to upload file to Arweave
      const cost = await bundlrInstance.getPrice(fileSizeInBytes)
      const formatCost = utils.formatEther(cost.toString())
      setFileCost(formatCost)

      setAccessConditions(accessConditions)
      setEncryptedData(encryptedFileInDataURI)
      setEncryptedSymmetricKey(encryptedFile.encryptedSymmetricKey)
    } catch (error) {
      console.log('onClickEncryptImage ~ error', error)
    }
  }

  // ============= (Helper) Turn blob data to data txId =============
  const blobToDataURI = (blob) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()

      reader.onload = (e) => {
        var data = e.target.result
        resolve(data)
      }
      reader.readAsDataURL(blob)
    })
  }

  // ============= (Helper) Convert data URI to blob =============

  const dataURItoBlob = (dataURI) => {
    console.log(dataURI)

    var byteString = window.atob(dataURI.split(',')[1])
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    var blob = new Blob([ab], { type: mimeString })

    return blob
  }

  // ============= LIT: Handle Upload of Image To Arweave Via Bundlr =============

  const onClickSignAndUpload = async () => {
    console.log('onClickSignAndUpload')

    const getAccessConditions = accessConditions

    const packagedData = {
      encryptedData: encryptedData,
      encryptedSymmetricKey,
      accessControlConditions: getAccessConditions,
    }

    console.log('packagedData:', packagedData)

    const packagedDataInString = JSON.stringify(packagedData)

    console.log('packagedDataInString:', packagedDataInString)
    console.log('packagedDataInString LENGTH:', packagedDataInString.length)

    const tags = [
      // { name: 'Content-Type', value: 'image/png' },
      { name: 'File', value: 'PermaNext' },
      { name: 'Collection', value: 'permanext-collection-test' },
    ]

    // Sign AND Upload
    let tx = await bundlrInstance.uploader.upload(packagedDataInString, { tags })
    console.log('🚀 ~ file: index.js ~ line 175 ~ onClickSignAndUpload ~ tx', tx)

    fetchBalance()
    setTxId(tx.data.id)
  }

  // ============= Fetch Encrypted Data =============

  const onFetchEncryptedData = async () => {
    const downloadUrl = 'https://arweave.net/' + txId

    const data = await fetch(downloadUrl)

    const encryptedData = JSON.parse(await data.text())

    console.log('encryptedData:', encryptedData)

    setDownloadedEncryptedData(encryptedData)
  }

  // ============= Decrypt Downloaded Data =============

  const onDecryptDownloadedData = async () => {
    try {
      // const decrypt = lit.decrypt(encryptedData, accessConditions, encryptedSymmetricKey)

      const symmetricKey = await lit.decrypt.symmetricKey()
    } catch (error) {
      console.log('onDecryptDownloadedData ~ error', error)
    }

    const symmetricKey = await litNodeClient.getEncryptionKey({
      accessControlConditions: downloadedEncryptedData.accessControlConditions,
      // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string. This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array. But the getEncryptionKey method expects a hex string.
      toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16'),
      chain: 'ethereum',
      authSig,
    })

    const decryptedString = await LitJsSdk.decryptString(
      dataURItoBlob(downloadedEncryptedData.encryptedData),
      symmetricKey
    )

    const originalFormat = atob(decryptedString)

    console.log('Original Format:', originalFormat)

    setDecryptedData(originalFormat)
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
              {/* <p>Your file name: {fileName}</p> */}
              <Image alt='The uploaded image' src={image} width='240px' height='100%'></Image>
            </div>
          )}

          {/* ============= Step 3 ============= */}
          <div>
            <h4>3. Encrypt Your Image</h4>
            <h5>Encrypt your image.</h5>
            <button onClick={() => onClickEncryptImage()}>Encrypt Image</button>
          </div>

          {/* ============= Step 4 ============= */}
          <div>
            <h4>Only show Upload AFTER encryption</h4>
            <h4>4. Upload Your File</h4>
            <h5>Upload your file to the permaweb.</h5>
            <h5>Encrypted File Size: {fileSize}</h5>
            <h5>ESTIMATED Cost to upload encrypted file: {fileCost}</h5>
            {fileCost && <h4>Cost to upload: {Math.round(fileCost * 1000) / 1000} MATIC</h4>}
            <button onClick={onClickSignAndUpload}>Upload File</button>
          </div>

          {/* ---- display Arweave txId ---- */}
          <div>
            {txId && <h5>View the TRANSACTION on the Arweave network:</h5>}
            {txId && (
              <a
                href={`http://arweave.app/tx/${txId}`}
                target='_blank'
                rel='noreferrer'
              >{`http://arweave.app/tx/${txId}`}</a>
            )}
            {txId && <h5>Download the Encrypted FILE:</h5>}
            {txId && (
              <a href={`http://arweave.net/${txId}`} target='_blank' rel='noreferrer'>{`http://arweave.net/${txId}`}</a>
            )}
          </div>

          {/* ============= Step 5 ============= */}
          <div>
            <h4>5. Decrypt Your Image</h4>
            <h5>a) Click to fetch the encrypted data from Arweave</h5>
            <button onClick={() => onFetchEncryptedData()}>{`http://arweave.net/${txId}`}</button>
            <div>
              <code>{JSON.stringify(downloadedEncryptedData)}</code>
            </div>
          </div>
          {decryptedData && (
            <div>
              <h5>b) Now decrypt the encrypted data</h5>
              <button onClick={() => onDecryptDownloadedData()}>Decrypt</button>
              <div>
                <Image alt='The decrypted image' src={decryptedData} width='240px' height='100%'></Image>
              </div>
            </div>
          )}
        </>
      )}
    </ContainerPage>
  )
}
