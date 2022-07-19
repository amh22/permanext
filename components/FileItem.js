/** @jsxImportSource theme-ui */
import { useState, useEffect, useCallback } from 'react'
import lit from '../libs/lit'
import Image from 'next/image'
import { FileDetails } from './FileDetails'
import { FileEncryptedData } from './FileEncyptedData'
import { FileImageData } from './FileImageData'

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
      <FileEncryptedData
        txid={txid}
        statusMessage={statusMessage}
        fetchingData={fetchingData}
        dataFetched={dataFetched}
        downloadedEncryptedData={downloadedEncryptedData}
      />
      <FileImageData
        downloadedEncryptedData={downloadedEncryptedData}
        accessControlConditions={accessControlConditions}
        encryptedSymmetricKey={encryptedSymmetricKey}
      />
    </div>
  )
}
