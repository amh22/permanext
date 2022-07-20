/** @jsxImportSource theme-ui */

export const FileEncryptedData = ({ txid, fetchingData, dataFetched, downloadedEncryptedData, statusMessage }) => (
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
