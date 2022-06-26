import { ThemeProvider } from 'theme-ui'
import Theme from '../theme'
import Layout from '../components/layout'
import '../styles.css'

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={Theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default App
