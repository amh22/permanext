/** @jsxImportSource theme-ui */
import Head from 'next/head'
import ContainerPage from '../components/ContainerPage'

export default function About() {
  return (
    <div>
      <Head>
        <title>About</title>
        <meta name='description' content='PermaPic is...' />
      </Head>

      <ContainerPage>
        <h3 sx={{ color: 'primary' }}>About Page</h3>
      </ContainerPage>
    </div>
  )
}
