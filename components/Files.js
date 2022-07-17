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

const FileItem = ({ fileInfo }) => {
  console.log('🚀 ~ file: Files.js ~ line 14 ~ FileItem ~ fileInfo', fileInfo)
  const { txid, height, length, owner, timestamp } = fileInfo
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
