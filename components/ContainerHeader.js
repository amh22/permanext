/** @jsxImportSource theme-ui */

export default function ContainerHeader({ children }) {
  return (
    <div
      sx={{
        contain: 'content',
        mx: 'auto',
        bg: 'inherit',
        py: 3,
        px: 4,
        borderBottom: '1px solid gray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {children}
    </div>
  )
}
