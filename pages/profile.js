/** @jsxImportSource theme-ui */
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { arweave, buildQuery, createFileInfo, APP_NAME } from '../utils'
import ContainerPage from '../components/ContainerPage'
import { Files } from '../components/Files'

// 👇 Here we use the arweave-js package to POST a GraphQL request to the default gateway’s graphql endpoint (https://arweave.net/graphql) and await the response. Note: we are getting the transaction 'info' NOT the transaction 'data'
async function getFileInfo() {
  console.log('running getFileInfo')
  const query = buildQuery()
  const results = await arweave.api.post('/graphql', query).catch((err) => {
    console.error('GraphQL query failed')
    throw new Error(err)
  })
  const edges = results.data.data.transactions.edges
  console.log('🚀 ~ file: profile.js ~ line 17 ~ getFileInfo ~ edges', edges)

  return edges.map((edge) => createFileInfo(edge.node))
}

export default function Profile() {
  const [fileInfo, setFileInfo] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // 👇 execute our fileInfo query from '../utils'
  useEffect(() => {
    console.log('running useEffect')
    setIsSearching(true)
    getFileInfo().then((files) => {
      console.log('🚀 ~ file: profile.js ~ line 30 ~ getFileInfo ~ files', files)
      setFileInfo(files)
      setIsSearching(false)
    })
  }, [])

  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta name='description' content='PermaPic profile page to view your images on the Arweave network.' />
      </Head>

      <ContainerPage>
        <h3 sx={{ color: 'primary' }}>Profile Page</h3>
        <h3 sx={{ color: 'primary' }}>App Name: {APP_NAME}</h3>
        <button onClick={() => getFileInfo()}>Query</button>
        {isSearching && <p>searching for files...</p>}
        <Files isSearching={isSearching} data={fileInfo} />
      </ContainerPage>
    </div>
  )
}
