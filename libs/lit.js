import LitJsSdk from 'lit-js-sdk'

// ============= Instantiating the Lit Client =============
const client = new LitJsSdk.LitNodeClient()
const chain = 'polygon'

const accessControlConditions = [
  {
    contractAddress: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
    chain: 'ethereum',
    standardContractType: 'ERC721',
    method: 'balanceOf',
    parameters: [':userAddress', 'latest'],
    returnValueTest: {
      comparator: '>',
      value: '0',
    },
  },
]

// const accessControlConditions = [
//   {
//     contractAddress: '',
//     chain: 'ethereum',
//     standardContractType: '',
//     method: 'eth_getBalance',
//     parameters: [':userAddress', 'latest'],
//     returnValueTest: {
//       comparator: '>=',
//       value: '0000000000000', // 0.000001 ETH
//     },
//   },
// ]

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
    // ----> if wallet already connected they will be asked to sign with that wallet
    // ----> otherwise they will be prompted to connect a wallet
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
  async decrypt(encryptedContent, accessConditions, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    // ----> first, obtain an authSig from the user. This will ask their wallet
    // ----> to sign a message proving they own their crypto address
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    // ----> decrypt the encrypted symmetricKey
    try {
      const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: accessConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig,
      })

      // ----> decrypt the content
      const decryptedString = await LitJsSdk.decryptString(encryptedContent, symmetricKey)

      return { decryptedString }
    } catch (error) {
      console.log('Decryption error: ', error)
      return error
    }
  }
}
export default new Lit()
