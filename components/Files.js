export const Files = (props) => {
  console.log('🚀 ~ file: Files.js ~ line 2 ~ Files ~ props', props)

  return <FileItem data={props} />
}

const FileItem = (props) => {
  console.log('🚀 ~ file: Files.js ~ line 8 ~ FileItem ~ props', props)
  return <p>poopy</p>
}
