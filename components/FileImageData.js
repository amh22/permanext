/** @jsxImportSource theme-ui */
import { useState } from 'react'
import lit from '../libs/lit'
import Image from 'next/image'

export const FileImageData = (props) => {
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
