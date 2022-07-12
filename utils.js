import Arweave from 'arweave'

// 👇 create an instance of the arweave api object with default configuration pointing to the https://arweave.net gateway.
export const arweave = Arweave.init({})

export const APP_NAME = process.env.NEXT_ARWEAVE_APP_NAME || 'YOUR_APP_NAME'

export const createPostInfo = async (node) => {
  const ownerAddress = node.owner.address
  const height = node.block ? node.block.height : -1
  const timestamp = node.block ? parseInt(node.block.timestamp, 10) * 1000 : -1
  const postInfo = {
    txid: node.id,
    owner: ownerAddress,
    height: height,
    length: node.data.size,
    timestamp: timestamp,
  }

  postInfo.request = await arweave.api.get(`/${node.id}`, { timeout: 10000 })
  return postInfo
}

export const query = {
  query: `{
  transactions(
    first: 50,
    tags: [
      {
        name: "App-Name",
        values: ["${APP_NAME}"]
      },
      {
        name: "Content-Type",
        values: ["text/plain"]
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
