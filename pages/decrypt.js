/** @jsxImportSource theme-ui */
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import lit from '../libs/lit'
import ContainerPage from '../components/ContainerPage'

export default function Decrypt() {
  const [txId, setTxId] = useState(null)
  const [fetchingData, setFetchingData] = useState(false)
  const [dataFetched, setDataFetched] = useState(null)
  const [downloadedEncryptedData, setDownloadedEncryptedData] = useState(null)
  const [accessControlConditions, setAccessControlConditions] = useState(null)
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState(null)
  const [decryptingData, setDecryptingData] = useState(null)
  const [dataDecrypted, setDataDecrypted] = useState(null)
  const [decryptedData, setDecryptedData] = useState(null)

  // ============= Fetch Encrypted Data =============

  const onFetchEncryptedData = async () => {
    console.log('onFetchEncryptedData')

    setDataFetched(false) // <- clear on a new fetch
    setFetchingData(true) // <- set to display loading state
    setDownloadedEncryptedData(null)
    setAccessControlConditions(null)
    setEncryptedSymmetricKey(null)
    setDataDecrypted(null)
    setDecryptedData(null)

    const downloadUrl = 'https://arweave.net/' + txId

    try {
      const data = await fetch(downloadUrl)

      const encryptedData = JSON.parse(await data.text())

      console.log('encryptedData:', encryptedData)

      const dataAccessConditions = encryptedData.accessControlConditions

      console.log('🚀 ~ file: decrypt.js ~ line 35 ~ onFetchEncryptedData ~ dataAccessConditions', dataAccessConditions)

      const dataEncryptedSymmetricKey = encryptedData.encryptedSymmetricKey

      console.log(
        '🚀 ~ file: decrypt.js ~ line 39 ~ onFetchEncryptedData ~ dataEncryptedSymmetricKey',
        dataEncryptedSymmetricKey
      )

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

  // ============= Decrypt Downloaded Data =============

  const onDecryptDownloadedData = async () => {
    console.log('onDecryptDownloadedData')
    setDecryptingData(true)
    const encryptedContent = dataURItoBlob(downloadedEncryptedData.encryptedData)

    console.log('🚀 ~ file: index.js ~ line 226 ~ onDecryptDownloadedData ~ encryptedContent', encryptedContent)

    try {
      const decryptData = await lit.decrypt(encryptedContent, accessControlConditions, encryptedSymmetricKey)

      const originalFormat = atob(decryptData.decryptedString)
      setDecryptingData(false)
      setDataDecrypted(true)
      setDecryptedData(originalFormat)
    } catch (error) {
      setDecryptingData(false)
      console.log('onDecryptDownloadedData ~ error', error)
      setDataDecrypted('encryptionError')
    }
  }

  return (
    <div>
      <Head>
        <title>Decrypt A File</title>
        <meta name='description' content='Generated by create next app' />
      </Head>

      <ContainerPage>
        <h3 sx={{ color: 'primary' }}>Decrypt A File</h3>
        <h4 sx={{ color: 'primary' }}>
          Lit encrypted files on the permaweb created by this PermaPic app can be decrypted here, providing you meet the
          on-chain access control conditions specified by the owner of the file.
        </h4>

        {/* ============= Step 1 ============= */}
        <div>
          <h4>1. Arweave Transaction ID</h4>
          <h5>
            To decrypt the file, we need to fetch the encrypted data file from the Arweave network. Please input the
            Arweave transaction ID in the input field below:
          </h5>
          <input type='text' placeholder='Transaction ID' onChange={(e) => setTxId(e.target.value)} />
          <h5>You can verify you have the correct transaction and file by reviewing the links below:</h5>
          <div>
            {txId && <h5>TRANSACTION on the Arweave network:</h5>}
            {txId && (
              <a
                href={`http://arweave.app/tx/${txId}`}
                target='_blank'
                rel='noreferrer'
              >{`http://arweave.app/tx/${txId}`}</a>
            )}

            {txId && <h5>The Encrypted FILE:</h5>}
            {txId && (
              <a href={`http://arweave.net/${txId}`} target='_blank' rel='noreferrer'>{`http://arweave.net/${txId}`}</a>
            )}
          </div>
        </div>

        {/* ============= Step 2 ============= */}
        {txId && (
          <div>
            <h4>2. Fetch the Encrypted Data</h4>
            <h5>Click below to fetch the encrypted data for the file stored on Arweave network.</h5>

            <button onClick={() => onFetchEncryptedData()}>Fetch data</button>
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
          </div>
        )}
        {/* ============= Step 3 ============= */}
        {downloadedEncryptedData && (
          <div>
            <h4>3. Decrypt the file & view the file</h4>
            <h5>Click below to decrypt the file and view the image.</h5>
            <h5>Make sure you select the correct wallet that meets the access control conditions.</h5>
            <button onClick={() => onDecryptDownloadedData()}>Decrypt</button>
          </div>
        )}
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
          </div>
        )}
      </ContainerPage>
    </div>
  )
}
