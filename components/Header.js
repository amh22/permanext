/** @jsxImportSource theme-ui */
import { Themed } from 'theme-ui'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import ColorModeSwitch from './ColorModeSwitch'
import ContainerHeader from './ContainerHeader'

export default function Header({ children }) {
  return (
    <header>
      <ContainerHeader>
        <nav
          sx={{
            maxWidth: 'layoutPlus',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <ul
            sx={{
              width: '100%',
              display: 'flex',
              m: 0,
              pl: 2,
            }}
          >
            <div
              sx={{
                display: 'flex',
                flex: '0 0 30%',
                justifyContent: 'left',
                alignItems: 'center',
              }}
            >
              <li sx={styles.logo}>
                <Link href='/' passHref>
                  <a sx={styles.navLink}>PermaPic</a>
                </Link>
              </li>
            </div>
            <div
              sx={{
                display: 'flex',
                flex: '1 1 60%',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
              }}
            >
              <ConnectButton />
            </div>
          </ul>
          <div sx={{ display: 'flex', flex: '0 0 10%', justifyContent: 'center' }}>
            <ColorModeSwitch />
          </div>
        </nav>
        {/* Main Navigation */}
        <nav
          sx={{
            maxWidth: 'layoutPlus',
            backgroundColor: 'pink',
          }}
        >
          <ul
            sx={{
              width: '100%',
              m: 0,
            }}
          >
            <div
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Themed.li>
                <Link href='/' passHref>
                  <a sx={styles.navLink}>Upload</a>
                </Link>
              </Themed.li>
              <Themed.li>
                <Link href='/decrypt' passHref>
                  <a sx={styles.navLink}>Decrypt</a>
                </Link>
              </Themed.li>
              <Themed.li>
                <Link href='/about' passHref>
                  <a sx={styles.navLink}>About</a>
                </Link>
              </Themed.li>
              <Themed.li>
                <Link href='/profile' passHref>
                  <a sx={styles.navLink}>Profile</a>
                </Link>
              </Themed.li>
            </div>
          </ul>
        </nav>
      </ContainerHeader>
    </header>
  )
}

const styles = {
  logo: {
    listStyle: 'none',
    display: 'flex',
    color: 'text',
    variant: 'text.paragraph',
    fontSize: [4, 4, 4, 4],
    px: [0, 0, 0, 0],
  },
  navLink: {
    fontSize: 2,
    textTransform: 'none',
    textDecoration: 'none',
    color: 'text',
    pr: 2,
    ':hover,:focus': {
      boxShadow: '0 0 0 3px',
      outline: 'none',
    },
  },
}
