/** @jsxImportSource theme-ui */
import { useContext } from 'react'
import { MainContext } from '../context'
import ContainerPage from '../components/container-page'

export default function Home() {
  const { initialiseBundlr, bundlrInstance, fetchBalance, balance } = useContext(MainContext)
  return (
    <ContainerPage>
      <h3 sx={{ color: 'primary' }}>Landing Page: Gallery</h3>
      <button onClick={initialiseBundlr}>Connect Bundlr</button>
      {balance && <h4>Bal: {balance}</h4>}
    </ContainerPage>
  )
}
