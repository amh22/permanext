/** @jsxImportSource theme-ui */
import { useDropzone } from 'react-dropzone'

function DropZone({ onDrop }) {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))
  console.log('🚀 ~ file: DropZone.js ~ line 12 ~ DropZone ~ files', files)

  return (
    <section>
      <div
        {...getRootProps({
          onClick: (event) => console.log('event:', event),
          role: 'button',
          'aria-label': 'drag and drop area',
        })}
        sx={{ border: '2px solid blue' }}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag &apos;n&apos; drop, or click to select your file</p>}
      </div>
      {files && (
        <aside>
          <h4>Your File Details</h4>
          <ul>{files}</ul>
        </aside>
      )}
    </section>
  )
}

export default DropZone
