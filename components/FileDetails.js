/** @jsxImportSource theme-ui */

export const FileDetails = ({ info: { txid, tags, date }, statusMessage }) => {
  return (
    <div sx={{ my: 3, border: '1px solid black' }}>
      {statusMessage && (
        <div sx={{ border: '2px solid red' }}>
          {' '}
          <h3 sx={{ color: 'red' }}>{statusMessage}</h3>
        </div>
      )}
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
