import Arweave from 'arweave'

// 👇 create an instance of the arweave api object with default configuration pointing to the https://arweave.net gateway.
export const arweave = Arweave.init({})

export const APP_NAME = process.env.NEXT_PUBLIC_ARWEAVE_APP_NAME || 'YOUR_APP_NAME'

export const createFileInfo = async (node) => {
  const ownerAddress = node.owner.address
  const height = node.block ? node.block.height : -1
  const timestamp = node.block ? parseInt(node.block.timestamp, 10) * 1000 : -1
  const fileInfo = {
    txid: node.id,
    owner: ownerAddress,
    height: height,
    length: node.data.size,
    timestamp: timestamp,
  }

  fileInfo.request = await arweave.api.get(`/${node.id}`, { timeout: 10000 })
  return fileInfo
}

export const buildQuery = () => {
  const queryObject = {
    query: `{
    transactions(first: 100,
      tags: [
        {
          name: "App-Name",
          values: ["${APP_NAME}"]
        },
        {
          name: "Content-Type",
          values: ["application/octet-stream"]
        }
      ]
    ) {
      edges {
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`,
  }
  return queryObject
}
