/** @jsxImportSource theme-ui */
import Link from 'next/link'
import ColorModeSwitch from '../components/color-mode-switch'
import ContainerHeader from './container-header'

export default function Header({ children }) {
  return (
    <header>
      <ContainerHeader>
        <div>
          <nav>
            <Link href='/' passHref>
              <a sx={styles.navLink}>Home</a>
            </Link>
            <Link href='/about' passHref>
              <a sx={styles.navLink}>About</a>
            </Link>
          </nav>
        </div>
        <div>
          <ColorModeSwitch />
        </div>
      </ContainerHeader>
    </header>
  )
}

const styles = {
  navLink: {
    fontSize: 2,
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: 'text',
    pr: 2,
    ':hover,:focus': {
      boxShadow: '0 0 0 3px',
      outline: 'none',
    },
  },
}
