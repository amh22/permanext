import { useState, useEffect } from 'react'

export const Files = ({ isSearching, data }) => {
  console.log('🚀 ~ file: Files.js ~ line 2 ~ Files ~ data', data)

  return (
    <div>
      {data.map((data) => (
        <FileItem key={data.txid} fileInfo={data} />
      ))}
    </div>
  )
}

const FileItem = (props) => {
  const [imageFile, setImageFile] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  console.log('🚀 ~ file: Files.js ~ line 18 ~ FileItem ~ fileInfo', props.fileInfo)
  const { txid, height, length, owner, timestamp } = props.fileInfo

  useEffect(() => {
    let newImageFile = ''
    let newStatus = ''

    if (!props.fileInfo.image) {
      setStatusMessage('loading...')
      let isCancelled = false

      const getImageFile = async () => {
        const response = await props.fileInfo.request
        console.log('🚀 ~ file: Files.js ~ line 26 ~ getImageFile ~ response', response)
        switch (response?.status) {
          case 200:
          case 202:
            props.fileInfo.image = response.data.toString()
            newStatus = ''
            newImageFile = props.fileInfo.image
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

        setImageFile(newImageFile)
        setStatusMessage(newStatus)
      }
      if (props.fileInfo.error) {
        setImageFile('')
        setStatusMessage(props.fileInfo.error)
      } else {
        getImageFile()
      }
      return () => (isCancelled = true)
    }
  }, [props.fileInfo])

  return (
    <>
      <h4>File Info</h4>
      <p>Tx ID: {txid}</p>
      <p>Height: {height}</p>
      <p>Length: {length}</p>
      <p>Owner: {owner}</p>
      <p>Timestamp: {timestamp}</p>
    </>
  )
}
