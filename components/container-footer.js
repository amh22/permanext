/** @jsxImportSource theme-ui */

export default function ContainerFooter({ children }) {
  return (
    <div
      sx={{
        width: '100%',
        contain: 'content',
        mx: 'auto',
        bg: 'inherit',
        py: 2,
        px: 4,
        backgroundColor: 'primary',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'space-between',
      }}
    >
      <div
        sx={{
          maxWidth: 'layout',
          contain: 'content',
          mx: 'auto',
          bg: 'inherit',
          py: 2,
          px: 4,
          backgroundColor: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}
