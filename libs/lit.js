import LitJsSdk from 'lit-js-sdk'

// ============= Instantiating the Lit Client =============
const client = new LitJsSdk.LitNodeClient()
const chain = 'polygon'

const accessControlConditions = [
  {
    contractAddress: '',
    standardContractType: '',
    chain: 'ethereum',
    method: 'eth_getBalance',
    parameters: [':userAddress', 'latest'],
    returnValueTest: {
      comparator: '>=',
      value: '1000000000000', // 0.000001 ETH
    },
  },
]

// ============= Create a Lit class and set the litNodeClient =============
class Lit {
  litNodeClient

  // ============= Connect To The Client =============
  async connect() {
    await client.connect()
    this.litNodeClient = client
  }

  // ============= Encrypt The Content =============
  async encrypt(content) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    // ----> first obtain an authorisation signature
    // ----> i.e. get the user to sign a message with their wallet provider
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    // ----> encrypt the content and get the symmetricKey
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(content)

    // ----> save the encrypted content, with the access control conditions to the Lit Nodes
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    })

    return {
      accessConditions: accessControlConditions,
      encryptedContent: encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16'),
    }
  }

  // ============= Decrypt The Content =============
  async decrypt(encryptedContent, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    // ----> first, obtain an authSig from the user. This will ask their wallet
    // ----> to sign a message proving they own their crypto address
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    // ----> decrypt the encrypted symmetricKey
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    })

    // ----> decrypt the content
    const decryptedString = await LitJsSdk.decryptString(encryptedContent, symmetricKey)

    return { decryptedString }
  }
}
export default new Lit()
