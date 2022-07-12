/** @jsxImportSource theme-ui */
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { arweave, buildQuery, createFileInfo, APP_NAME } from '../utils'
import ContainerPage from '../components/ContainerPage'
import { Files } from '../components/Files'

export default function Profile() {
  const [fileInfo, setFileInfo] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setIsSearching(true)
    getFileInfo().then((files) => {
      setFileInfo(files)
      setIsSearching(false)
    })
  }, [])

  async function getFileInfo() {
    const query = buildQuery()
    const results = await arweave.api.post('/graphql', query).catch((err) => {
      console.error('GraphQL query failed')
      throw new Error(err)
    })
    const edges = results.data.data.transactions.edges
    console.log(edges)
    return edges.map((edge) => createFileInfo(edge.node))
  }

  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta name='description' content='PermaPic profile page to view your images on the Arweave network.' />
      </Head>

      <ContainerPage>
        <h3 sx={{ color: 'primary' }}>Profile Page</h3>
        <h3 sx={{ color: 'primary' }}>{APP_NAME}</h3>
        <button onClick={() => getFileInfo()}>Query</button>
        {isSearching && <p>searching for files...</p>}
        <Files data={fileInfo} />
      </ContainerPage>
    </div>
  )
}
