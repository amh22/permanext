/** @jsxImportSource theme-ui */
import { ConnectButton } from '@rainbow-me/rainbowkit'
import ContainerPage from '../components/container-page'

export default function Home() {
  return (
    <ContainerPage>
      <h3 sx={{ color: 'primary' }}>Home Page</h3>
      <ConnectButton />
    </ContainerPage>
  )
}
