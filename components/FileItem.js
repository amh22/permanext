/** @jsxImportSource theme-ui */
import { useState, useEffect, useCallback } from 'react'

export const FileItem = (props) => {
  const [fileData, setFileData] = useState('')
  // console.log('🚀 ~ file: Files.js ~ line 26 ~ FileItem ~ fileData', fileData)
  const [statusMessage, setStatusMessage] = useState('')
  const [fetchingData, setFetchingData] = useState(false)
  const [dataFetched, setDataFetched] = useState(null)
  const [downloadedEncryptedData, setDownloadedEncryptedData] = useState(null)
  const [accessControlConditions, setAccessControlConditions] = useState(null)
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState(null)

  const { txid, date, tags } = props.fileInfo
  const fileDetails = {
    txid,
    date,
    tags,
  }

  // ============= Fetch Encrypted Data =============

  const onFetchEncryptedData = useCallback(async () => {
    console.log('onFetchEncryptedData')

    // setDataFetched(null) // <- clear on a new fetch
    setFetchingData(true) // <- set to display loading state
    // setDownloadedEncryptedData(null)
    // setAccessControlConditions(null)
    // setEncryptedSymmetricKey(null)
    // setDataDecrypted(null)
    // setDecryptedData(null)

    const downloadUrl = 'https://arweave.net/' + txid

    try {
      const data = await fetch(downloadUrl)

      const encryptedData = JSON.parse(await data.text())

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
  }, [txid])

  useEffect(() => {
    let newFileData = ''
    let newStatus = ''

    if (!props.fileInfo.fileData) {
      setStatusMessage('loading...')
      let isCancelled = false

      const getFileData = async () => {
        const response = await props.fileInfo.request
        // console.log('🚀 ~ file: Files.js ~ line 42 ~ getFileData ~ response', response)
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
        onFetchEncryptedData()
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
        fetchingData={fetchingData}
        dataFetched={dataFetched}
        downloadedEncryptedData={downloadedEncryptedData}
      />
      <ImageData data={fileData} />
    </div>
  )
}

const FileDetails = ({ info: { txid, tags, date } }) => {
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

const EncryptedData = ({ txid, fetchingData, dataFetched, downloadedEncryptedData }) => (
  <div sx={{ my: 3, border: '1px solid blue' }}>
    <h5>The Encrypted FILE:</h5>
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

const ImageData = ({ txid }) => (
  <div sx={{ my: 3, border: '1px solid pink' }}>
    <h5>The IMAGE FILE:</h5>
  </div>
)
