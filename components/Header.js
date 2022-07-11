/** @jsxImportSource theme-ui */
import { Themed } from 'theme-ui'
import Link from 'next/link'
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
            <div sx={{ display: 'flex', flex: '0 0 30%' }}>
              <Themed.li sx={{ px: 0 }}>
                <Link href='/' passHref>
                  <a sx={styles.navLink}>PermaPic</a>
                </Link>
              </Themed.li>
            </div>
            <div
              sx={{
                display: 'flex',
                flex: '1 1 60%',
                justifyContent: 'flex-end',
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
                <Link href='/about' passHref>
                  <a sx={styles.navLink}>Profile</a>
                </Link>
              </Themed.li>
            </div>
          </ul>
          <div sx={{ display: 'flex', flex: '0 0 10%', justifyContent: 'center' }}>
            <ColorModeSwitch />
          </div>
        </nav>
      </ContainerHeader>
    </header>
  )
}

const styles = {
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
