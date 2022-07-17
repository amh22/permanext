/** @jsxImportSource theme-ui */
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { arweave, buildQuery, createFileInfo, APP_NAME } from '../utils'
import ContainerPage from '../components/ContainerPage'
import { Files } from '../components/Files'

// 👇 We use the arweave-js package to POST a GraphQL request to the default gateway’s graphql endpoint (https://arweave.net/graphql) and await the response. We will receive the transaction 'info' NOT the 'file data'
async function getFileInfo() {
  // console.log('running getFileInfo')
  const query = buildQuery()
  const results = await arweave.api.post('/graphql', query).catch((err) => {
    console.error('GraphQL query failed')
    throw new Error(err)
  })
  const edges = results.data.data.transactions.edges

  return edges.map((edge) => createFileInfo(edge.node))
}

export default function Profile() {
  const [fileInfo, setFileInfo] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // 👇 execute our fileInfo query from '../utils'
  useEffect(() => {
    // console.log('running useEffect')
    setIsSearching(true)
    getFileInfo().then((files) => {
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
        {isSearching && <h3 sx={{ color: 'blue' }}>Searching for files...</h3>}
        <Files data={fileInfo} />
      </ContainerPage>
    </div>
  )
}
