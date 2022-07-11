/** @jsxImportSource theme-ui */
import Head from 'next/head'
import ContainerPage from '../components/ContainerPage'

export default function Profile() {
  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta name='description' content='PermaPic profile page to view your images on the Arweave network.' />
      </Head>

      <ContainerPage>
        <h3 sx={{ color: 'primary' }}>Profile Page</h3>
      </ContainerPage>
    </div>
  )
}
