import { IconButton, useColorMode } from 'theme-ui'

const ColorModeSwitch = (props) => {
  const [mode, setMode] = useColorMode()
  return (
    <IconButton
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      sx={{
        // position: 'absolute',
        // top: [2, 3],
        // right: [2, 3],
        color: 'primary',
        cursor: 'pointer',
        borderRadius: 'circle',
        transition: 'box-shadow .125s ease-in-out',
        ':hover,:focus': {
          boxShadow: '0 0 0 3px',
          outline: 'none',
        },
      }}
      {...props}
    >
      <svg viewBox='0 0 24 24' width={24} height={24} fill='currentcolor'>
        <circle cx={12} cy={12} r={11} fill='none' stroke='currentcolor' strokeWidth={2} />
        <path d='M 12 0 A 12 12 0 0 0 12 24 z' />
      </svg>
    </IconButton>
  )
}

export default ColorModeSwitch
