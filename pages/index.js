/** @jsxImportSource theme-ui */
import { useContext, useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { utils } from 'ethers'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { MainContext } from '../context'
import DropZone from '../components/DropZone'
import prettyBytes from 'pretty-bytes'
import ContainerPage from '../components/ContainerPage'
import lit from '../libs/lit'
import { APP_NAME } from '../utils'
import { LoadingRings } from '../components/LoadingIndictor'

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false)
  const [accountAddress, setAccountAddress] = useState(null)
  const [bundlrConnected, setBundlrConnected] = useState(null)
  const [fundingAmount, setFundingAmount] = useState(null)
  const [file, setFile] = useState(null)
  const [fileTypeError, setFileTypeError] = useState({ error: false, message: '' })
  const [imageTitle, setImageTitle] = useState(null)
  const [imageDescription, setImageDescription] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [fileSizeInBytes, setFileSizeInBytes] = useState(null)
  const [fileSize, setFileSize] = useState(null)
  const [fileCost, setFileCost] = useState(null)
  const [image, setImage] = useState(null)
  const [accessConditions, setAccessConditions] = useState(null)
  const [encryptedData, setEncryptedData] = useState(null)
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState(null)
  const [isEncrypted, setIsEncrypted] = useState(null)
  const [txId, setTxId] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [isUploaded, setIsUploaded] = useState(null)
  const [downloadedEncryptedData, setDownloadedEncryptedData] = useState(null)
  const [decryptedData, setDecryptedData] = useState(null)

  const { initialiseBundlr, bundlrInstance, fetchBalance, balance, createdBy } = useContext(MainContext)

  const { address, isConnected } = useAccount() // <- get wallet info and status

  const router = useRouter()

  async function initialise() {
    setBundlrConnected('connecting')
    await initialiseBundlr()
    setBundlrConnected('connected')
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
      setIsEncrypted('success')
    } catch (error) {
      console.log('onClickEncryptImage ~ error', error)
      setIsEncrypted('error')
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

    const packagedDataInString = JSON.stringify(packagedData)

    const tags = [
      { name: 'Content-Type', value: 'application/octet-stream' },
      { name: 'App-Name', value: APP_NAME },
      { name: 'Title', value: imageTitle },
      { name: 'Description', value: imageDescription },
      { name: 'Created-By', value: createdBy },
    ]

    // Sign AND Upload
    try {
      let tx = await bundlrInstance.uploader.upload(packagedDataInString, tags)
      console.log('🚀 ~ file: index.js ~ line 175 ~ onClickSignAndUpload ~ tx', tx)

      fetchBalance()
      setIsUploaded('success')
      setTxId(tx.data.id)
    } catch (error) {
      console.log('There was an error uploading the image: ', error)
      setUploadError(`${error.message}. Please try again.`)
      setIsUploaded('error')
    }
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
    console.log('onDecryptDownloadedData')

    const encryptedContent = dataURItoBlob(downloadedEncryptedData.encryptedData)

    try {
      const decryptData = await lit.decrypt(encryptedContent, accessConditions, encryptedSymmetricKey)

      const originalFormat = atob(decryptData.decryptedString)

      setDecryptedData(originalFormat)
    } catch (error) {
      console.log('onDecryptDownloadedData ~ error', error)
    }
  }

  useEffect(() => {
    setHasMounted(true)
    setAccountAddress(address)
  }, [address])

  if (!hasMounted) {
    return null
  }

  return (
    <div>
      <Head>
        <title>Upload Encrypted File</title>
        <meta name='description' content='Encrypt and upload images to the Arweave permaweb network.' />
      </Head>
      <ContainerPage>
        <h3>Store an encrypted image permanently on the Arweave network.</h3>
        {/* ============= Step 1 ============= */}
        <>
          <div>
            <h3>1. Connect To The Bundlr Network</h3>
          </div>
          <div
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              height: '40px',
              contain: 'content',
            }}
          >
            <div>
              <button
                onClick={initialise}
                disabled={!isConnected || balance || bundlrConnected === 'connecting'}
                sx={{ cursor: !isConnected || balance || bundlrConnected === 'connecting' ? 'not-allowed' : 'pointer' }}
              >
                {balance ? 'You are connected' : 'Connect to Bundlr'}
              </button>
            </div>
            {bundlrConnected === 'connecting' && (
              <>
                <div sx={{ display: 'flex', m: 3 }}>
                  {' '}
                  <LoadingRings />
                </div>
                <div>
                  <p>Sign with your wallet...</p>
                </div>
              </>
            )}
          </div>
          {!isConnected && (
            <div>
              <p sx={{ color: 'red' }}>You must first connect your wallet before you can connect to bundlr.</p>
            </div>
          )}
        </>

        {isConnected && balance && (
          <>
            <div>
              <p>You are now connected to the bundlr network.</p>
              <div sx={{ display: 'flex', m: 0, p: 0 }}>
                <p>Your bundlr balance is:</p>
                <p sx={{ fontWeight: '700', pl: 2 }}>{balance} matic</p>
              </div>
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
              <h4>2. Select An Image</h4>
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
            {image && (
              <div>
                <h4>3. Encrypt Your Image</h4>
                <h5>grant decryption keys to users based on their blockchain credentials and asset ownership.</h5>
                {/* ---- fund your bundlr wallet ---- */}
                <div style={{ padding: '10px 0 10px 0' }}>
                  <input
                    type='text'
                    placeholder='Image Title'
                    onChange={(e) => setImageTitle(e.target.value)}
                    sx={{ width: '200px' }}
                  />
                </div>
                <div style={{ padding: '10px 0 30px 0' }}>
                  <textarea
                    type='text'
                    placeholder='Description'
                    onChange={(e) => setImageDescription(e.target.value)}
                    sx={{ width: '200px' }}
                  />
                </div>
                <button onClick={() => onClickEncryptImage()}>Encrypt Image</button>
              </div>
            )}

            {/* ============= Step 4 ============= */}
            {isEncrypted === 'success' && (
              <div>
                <h4>4. Upload Your File</h4>
                <h5>Upload your file to the permaweb.</h5>
                <h5>Encrypted File Size: {fileSize}</h5>
                <h5>ESTIMATED Cost to upload encrypted file: {fileCost}</h5>
                {fileCost && <h4>Cost to upload: {Math.round(fileCost * 1000) / 1000} MATIC</h4>}
                <button onClick={onClickSignAndUpload}>Upload File</button>
              </div>
            )}
            {isUploaded === 'success' && (
              <div>
                {txId && <h5>View the TRANSACTION on the Arweave network:</h5>}
                {txId && (
                  <a
                    href={`http://arweave.app/tx/${txId}`}
                    target='_blank'
                    rel='noreferrer'
                  >{`http://arweave.app/tx/${txId}`}</a>
                )}
                {txId && (
                  <h5>
                    The Encrypted FILE: As you will see, the data is obfuscated and safe. If someone was to try and view
                    the image, they will only get the access control conditions along with the encrypted and encoded zip
                    and symmetric key. All they can do is downlaod the encrypted file, but not view it until it is
                    decrypted.
                  </h5>
                )}
                {txId && <h5>Download the Encrypted FILE:</h5>}
                {txId && (
                  <a
                    href={`http://arweave.net/${txId}`}
                    target='_blank'
                    rel='noreferrer'
                  >{`http://arweave.net/${txId}`}</a>
                )}
              </div>
            )}
            {isUploaded === 'error' && (
              <div>
                <h4 sx={{ color: 'red' }}>Upload Error</h4>
                <h5>{uploadError}</h5>
              </div>
            )}

            {/* ============= Step 5 ============= */}
            {/* <div>
              <h4>5. Decrypt Your Image</h4>
              <h5>a) Click to fetch the encrypted data from Arweave</h5>
              <button onClick={() => onFetchEncryptedData()}>{`http://arweave.net/${txId}`}</button>
              <div>
                <code>{JSON.stringify(downloadedEncryptedData)}</code>
              </div>
            </div>
            {encryptedData && (
              <div>
                <h5>b) Now decrypt the encrypted data</h5>
                <button onClick={() => onDecryptDownloadedData()}>Decrypt</button>
              </div>
            )}
            {decryptedData && (
              <div>
                <Image alt='The decrypted image' src={decryptedData} width='240px' height='100%'></Image>
              </div>
            )} */}
          </>
        )}
      </ContainerPage>
    </div>
  )
}
