/** @jsxImportSource theme-ui */

export default function ContainerPage({ children }) {
  return (
    <div
      sx={{
        maxWidth: 'layout',
        contain: 'content',
        mx: 'auto',
        p: ['4', '4', '4', '4'],
        bg: 'inherit',
      }}
    >
      {children}
    </div>
  )
}
