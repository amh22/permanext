import Arweave from 'arweave'

// 👇 create an instance of the arweave api object with default configuration pointing to the https://arweave.net gateway.
export const arweave = Arweave.init({})

export const APP_NAME = process.env.NEXT_PUBLIC_ARWEAVE_APP_NAME || 'YOUR_APP_NAME'

// convert the node objects to nice objects to work with. The node object
export const createFileInfo = (node) => {
  // console.log('running createFileInfo')
  const ownerAddress = node.owner.address
  const height = node.block ? node.block.height : -1
  const timestamp = node.block ? parseInt(node.block.timestamp, 10) * 1000 : -1
  const tags = node.tags
  const fileInfo = {
    txid: node.id,
    owner: ownerAddress,
    height: height,
    length: node.data.size,
    timestamp: timestamp,
    tags: tags,
    request: null,
  }
  // ============= get the file 'data' =============
  // 👇 adding a request property to the fileInfo instance we're initialising, and then assigned the 'promise' returned by arweave.api.get(). This will give us the transaction's file 'fileData' that we'll need to display the images in our frontend

  if (fileInfo.length > 0) {
    fileInfo.request = arweave.api.get(`/${node.id}`, { timeout: 10000 }).catch(() => {
      fileInfo.error = 'Timeout loading data'
    })
  } else {
    fileInfo.error = 'Error, there is no image file'
  }

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
