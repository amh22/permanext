import { useDropzone } from 'react-dropzone'

function DropZone({ onDrop }) {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  return (
    <section>
      <div
        {...getRootProps({
          onClick: (event) => console.log('event:', event),
          role: 'button',
          'aria-label': 'drag and drop area',
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag &apos;n&apos; drop, or click to select your file</p>}
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  )
}

export default DropZone
