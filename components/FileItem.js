/** @jsxImportSource theme-ui */
import { useState, useEffect, useCallback } from 'react'
import lit from '../libs/lit'
import Image from 'next/image'

export const FileItem = (props) => {
  // console.log('🚀 ~ file: FileItem.js ~ line 7 ~ FileItem ~ props', props)
  const [fileData, setFileData] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [fetchingData, setFetchingData] = useState(false)
  const [dataFetched, setDataFetched] = useState(null)
  const [downloadedEncryptedData, setDownloadedEncryptedData] = useState(null)
  const [accessControlConditions, setAccessControlConditions] = useState(null)
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState(null)

  // file INFO
  const { txid, date, tags } = props.fileInfo
  const fileDetails = {
    txid,
    date,
    tags,
  }

  // ============= Fetch Encrypted Data =============

  const onFetchEncryptedData = useCallback(async (newFileData) => {
    // setDataFetched(null) // <- clear on a new fetch
    setFetchingData(true) // <- set to display loading state
    // setDownloadedEncryptedData(null)
    // setAccessControlConditions(null)
    // setEncryptedSymmetricKey(null)
    // setDataDecrypted(null)
    // setDecryptedData(null)

    try {
      const encryptedData = newFileData

      const dataAccessConditions = encryptedData.accessControlConditions

      const dataEncryptedSymmetricKey = encryptedData.encryptedSymmetricKey

      setFetchingData(false)
      setDataFetched(true)
      setDownloadedEncryptedData(encryptedData)
      setAccessControlConditions(dataAccessConditions)
      setEncryptedSymmetricKey(dataEncryptedSymmetricKey)
    } catch (error) {
      setFetchingData(false)
      console.log('onFetchEncryptedData ~ error', error)
      setDataFetched('fetchError')
    }
  }, [])

  useEffect(() => {
    let newFileData = ''
    let newStatus = ''

    if (!props.fileInfo.fileData) {
      setStatusMessage('loading...')
      let isCancelled = false

      const getFileData = async () => {
        const response = await props.fileInfo.request

        switch (response?.status) {
          case 200:
          case 202:
            props.fileInfo.fileData = response.data
            newStatus = ''
            newFileData = props.fileInfo.fileData
            break
          case 404:
            newStatus = 'Not Found'
            break
          default:
            newStatus = props.fileInfo?.error
            if (!newStatus) {
              newStatus = 'missing data'
            }
        }
        if (isCancelled) return

        setFileData(newFileData)
        setStatusMessage(newStatus)
        onFetchEncryptedData(newFileData)
      }
      if (props.fileInfo.error) {
        setFileData('')
        setStatusMessage(props.fileInfo.error)
      } else {
        getFileData()
      }
      return () => (isCancelled = true)
    }
  }, [onFetchEncryptedData, props.fileInfo])

  return (
    <div sx={{ my: 3, p: 3, border: '1px solid red' }}>
      <FileDetails info={fileDetails} />
      <EncryptedData
        txid={txid}
        statusMessage={statusMessage}
        fetchingData={fetchingData}
        dataFetched={dataFetched}
        downloadedEncryptedData={downloadedEncryptedData}
      />
      <ImageData
        downloadedEncryptedData={downloadedEncryptedData}
        accessControlConditions={accessControlConditions}
        encryptedSymmetricKey={encryptedSymmetricKey}
      />
    </div>
  )
}

const FileDetails = ({ info: { txid, tags, date }, statusMessage }) => {
  return (
    <div sx={{ my: 3, border: '1px solid black' }}>
      <p>Uploaded {date}</p>
      <div>
        {tags.map((tag) => (
          <div key={txid}>
            {tag.name === 'Title' && <h2>Title: {tag.value}</h2>}
            {tag.name === 'Description' && <h4>Description: {tag.value}</h4>}
          </div>
        ))}
      </div>
      <div>
        <h5>TRANSACTION on the Arweave network:</h5>

        <a href={`http://arweave.app/tx/${txid}`} target='_blank' rel='noreferrer'>{`http://arweave.app/tx/${txid}`}</a>
      </div>
    </div>
  )
}

const EncryptedData = ({ txid, fetchingData, dataFetched, downloadedEncryptedData, statusMessage }) => (
  <div sx={{ my: 3, border: '1px solid blue' }}>
    <h5>The Encrypted FILE:</h5>
    {statusMessage && (
      <div sx={{ border: '2px solid red' }}>
        {' '}
        <h3 sx={{ color: 'red' }}>{statusMessage}</h3>
      </div>
    )}
    {fetchingData && <p>fetching file data...</p>}
    {!fetchingData && dataFetched && downloadedEncryptedData && (
      <div>
        <code>{JSON.stringify(downloadedEncryptedData)}</code>
      </div>
    )}
    {dataFetched === 'fetchError' && (
      <div>
        <p>Error fetching file data. Please check your transaction ID.</p>
      </div>
    )}
    <a href={`http://arweave.net/${txid}`} target='_blank' rel='noreferrer'>{`http://arweave.net/${txid}`}</a>
  </div>
)

const ImageData = (props) => {
  const [decryptingData, setDecryptingData] = useState(null)
  const [decryptError, setDecryptError] = useState(null)
  const [dataDecrypted, setDataDecrypted] = useState(null)
  const [decryptedData, setDecryptedData] = useState(null)
  // ============= (Helper) Convert data URI to blob =============

  const dataURItoBlob = (dataURI) => {
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

  // ============= Decrypt Downloaded Data =============

  const onDecryptDownloadedData = async () => {
    // console.log('onDecryptDownloadedData')
    const getEncryptedData = props.downloadedEncryptedData.encryptedData
    const { accessControlConditions, encryptedSymmetricKey } = props

    setDataDecrypted(null)
    setDecryptingData(true)
    const encryptedContent = dataURItoBlob(getEncryptedData)

    try {
      const decryptData = await lit.decrypt(encryptedContent, accessControlConditions, encryptedSymmetricKey)

      const originalFormat = atob(decryptData.decryptedString)
      setDecryptingData(false)
      setDataDecrypted(true)
      setDecryptedData(originalFormat)
    } catch (error) {
      setDecryptingData(false)
      console.log('onDecryptDownloadedData ~ error', error)
      setDecryptError(`${error.message}. Please try again or contact the file owner.`)
      setDataDecrypted('encryptionError')
    }
  }

  return (
    <div sx={{ my: 3, border: '1px solid pink' }}>
      <h5>The IMAGE FILE:</h5>
      <button onClick={() => onDecryptDownloadedData()}>Decrypt</button>
      {decryptingData && <p>decrypting the file...</p>}
      {!decryptingData && decryptedData && (
        <div>
          <Image alt='The decrypted image' src={decryptedData} width='240px' height='100%'></Image>
        </div>
      )}
      {dataDecrypted === 'encryptionError' && (
        <div>
          <p>
            Error decrypting the file data. You may not meet the access control conditions, or the file was encrypted
            and uploaded by another app. Please check the wallet you are signing with or with the owner of the file.
          </p>
          <p>{decryptError}</p>
        </div>
      )}
    </div>
  )
}
