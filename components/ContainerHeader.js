/** @jsxImportSource theme-ui */

export default function ContainerHeader({ children }) {
  return (
    <div
      sx={{
        contain: 'content',
        mx: 'auto',
        bg: 'inherit',
        py: 3,
        px: [2, 2, 4, 4],
        borderBottom: '1px solid gray',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  )
}
