import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export const Files = ({ isSearching, data }) => {
  return (
    <div>
      {data.map((data) => {
        const { txid, timestamp, tags } = data
        const date = new Date(timestamp)
        const formattedDate = format(date, 'LLLL d, yyyy')

        const info = {
          txid,
          date: formattedDate,
          tags,
        }
        return <FileItem key={txid} fileInfo={info} />
      })}
    </div>
  )
}

const FileItem = (props) => {
  const [fileData, setFileData] = useState('')
  // console.log('🚀 ~ file: Files.js ~ line 26 ~ FileItem ~ fileData', fileData)

  const [statusMessage, setStatusMessage] = useState('')

  const { txid, date, tags, dateString } = props.fileInfo

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
      }
      if (props.fileInfo.error) {
        setFileData('')
        setStatusMessage(props.fileInfo.error)
      } else {
        getFileData()
      }
      return () => (isCancelled = true)
    }
  }, [props.fileInfo])

  return (
    <>
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

        <h5>The Encrypted FILE:</h5>

        <a href={`http://arweave.net/${txid}`} target='_blank' rel='noreferrer'>{`http://arweave.net/${txid}`}</a>
      </div>
    </>
  )
}
