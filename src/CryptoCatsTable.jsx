import { useAccount, useWalletClient } from 'wagmi'
import { formatEther } from 'viem'
import { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-responsive'
import 'datatables.net-responsive-dt'

const CRYPTOCATS_ABI =[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"}],"name":"catNoLongerForSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"catIndexToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"releaseCatIndexUpperBound","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_releaseId","type":"uint32"},{"name":"catPrice","type":"uint256"}],"name":"updateCatReleasePrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getContractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"}],"name":"getCat","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"imageHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"}],"name":"getCatPrice","outputs":[{"name":"catPrice","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"attributeType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"},{"name":"minSalePriceInWei","type":"uint256"},{"name":"toAddress","type":"address"}],"name":"offerCatForSaleToAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupplyIsLocked","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"},{"name":"attrIndex","type":"uint256"},{"name":"attrValue","type":"string"}],"name":"setCatAttributeValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint32"}],"name":"catReleaseToPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_releaseId","type":"uint32"},{"name":"numberOfCatsAdded","type":"uint256"},{"name":"catPrice","type":"uint256"},{"name":"newImageHash","type":"string"}],"name":"releaseCats","outputs":[{"name":"newTotalSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"previousContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"}],"name":"getCatRelease","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"catsForSale","outputs":[{"name":"isForSale","type":"bool"},{"name":"catIndex","type":"uint256"},{"name":"seller","type":"address"},{"name":"minPrice","type":"uint256"},{"name":"sellOnlyTo","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allCatsAssigned","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractVersion","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"startIndex","type":"uint256"},{"name":"endIndex","type":"uint256"}],"name":"migrateCatOwnersFromPreviousContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"attributeIndex","type":"uint256"},{"name":"descriptionText","type":"string"}],"name":"setAttributeType","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"currentReleaseCeiling","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"},{"name":"catPrice","type":"uint256"}],"name":"setCatPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"}],"name":"getCatOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"}],"name":"buyCat","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"catIndex","type":"uint256"},{"name":"minSalePriceInWei","type":"uint256"}],"name":"offerCatForSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"catIndexToPriceException","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"catsRemainingToAssign","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"lockTotalSupply","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"catAttributes","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"catIndex","type":"uint256"}],"name":"CatTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"catIndex","type":"uint256"},{"indexed":false,"name":"minPrice","type":"uint256"},{"indexed":true,"name":"toAddress","type":"address"}],"name":"CatOffered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"catIndex","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"},{"indexed":true,"name":"toAddress","type":"address"}],"name":"CatBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"catIndex","type":"uint256"}],"name":"CatNoLongerForSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"catIndex","type":"uint256"}],"name":"Assign","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"newCatsAdded","type":"uint256"},{"indexed":false,"name":"totalSupply","type":"uint256"},{"indexed":false,"name":"catPrice","type":"uint256"},{"indexed":false,"name":"newImageHash","type":"string"}],"name":"ReleaseUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"releaseId","type":"uint32"},{"indexed":false,"name":"catPrice","type":"uint256"}],"name":"UpdateReleasePrice","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"attributeNumber","type":"uint256"},{"indexed":true,"name":"ownerAddress","type":"address"},{"indexed":false,"name":"oldValue","type":"bytes32"},{"indexed":false,"name":"newValue","type":"bytes32"}],"name":"UpdateAttribute","type":"event"}]

const MARKET_V2_ABI = [
  {
    "inputs": [{"internalType": "uint256","name": "catIndex","type": "uint256"}],
    "name": "bid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256","name": "catIndex","type": "uint256"},
      {"internalType": "uint256","name": "minPrice","type": "uint256"}
    ],
    "name": "acceptBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export default function CryptoCatsTable({ cats, contractAddress, bidContractAddress }) {
  const { address, isConnected } = useAccount()
  const containerRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const walletClient = useWalletClient()
  const visibleCats = cats.filter((cat) => {
    if (filter === 'my' && isConnected) {
      return cat.owner?.id?.toLowerCase() === address?.toLowerCase()
    }
    return true
  })

  useEffect(() => {
    if (!containerRef.current || visibleCats.length === 0) return

    const tableId = 'cats-datatable'
    const container = containerRef.current

    // Nettoyage avant re-render
    $(container).empty()

    // Création manuelle de la table HTML
    const table = $(`
      <table id="${tableId}" class="nes-table is-bordered is-centered display" style="width: 95%; margin: 0 auto;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Price</th>
            <th>Best Bid</th>
            <th>Owner</th>
            <th>Best Bidder</th>
            <th>Last Sale</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${visibleCats.map((cat) => {
            const isMine =
              isConnected && cat.owner?.id?.toLowerCase() === address?.toLowerCase()
            const shortOwner = shortAddr(cat.owner?.id)
            const shortBidder = cat.activeBid?.bidder?.id
              ? shortAddr(cat.activeBid.bidder.id)
              : '—'

            return `
              <tr class="${isMine ? 'is-owned' : ''}">
                <td>
                  <span style="display:none;">${cat.id.toString().padStart(4, '0')}</span>
                  #${cat.id}
                </td>
                <td><img src="crypto-cats-images/${cat.id}.png" alt="Cat ${cat.id}" class="cat-image" style="width:48px; image-rendering: pixelated;" /></td>
                <td>${cat.price != 0 ? fmtEth(cat.price) : '—'}</td>
                <td>${cat.activeBid ? fmtEth(cat.activeBid.amount) : '—'}</td>
                <td>${shortOwner}</td>
                <td>${shortBidder}</td>
                <td>${cat.lastSale ? fmtEth(cat.lastSale) : '—'}</td>
                <td>
                ${renderActionButtonHTML(cat, address)}
                </td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `)

    $(container).append(table)
    $(container).off('click')
// Ajout des listeners d'action
$(container).on('click', '.buy-cat', async function () {
    const catId = $(this).data('cat-id')
    const cat = cats.find(c => c.id == catId)
    if (!cat) return
    try {
      await buyCat(cat.id, cat.price, walletClient.data, contractAddress)
    } catch (err) {
      alert("Transaction failed: " + err.message)
    }
  })
  
  $(container).on('click', '.put-on-sale', async function () {
    const catId = $(this).data('cat-id')
    try {
      await putOnSale(catId, walletClient.data, contractAddress)
    } catch (err) {
      alert("Failed to list for sale: " + err.message)
    }
  })
  
  $(container).on('click', '.update-price', async function () {
    const catId = $(this).data('cat-id')
    try {
      await updatePrice(catId, walletClient.data, contractAddress)
    } catch (err) {
      alert("Failed to update price: " + err.message)
    }
  })
  
  $(container).on('click', '.remove-sale', async function () {
    const catId = $(this).data('cat-id')
    try {
      await removeFromSale(catId, walletClient.data, contractAddress)
    } catch (err) {
      alert("Failed to remove from sale: " + err.message)
    }
  })
  
  $(container).on('click', '.accept-bid', async function () {
    const catId = $(this).data('cat-id')
    try {
      await acceptBid(catId, walletClient.data, bidContractAddress)
    } catch (err) {
      alert("Failed to accept bid: " + err.message)
    }
  })
  
  $(container).on('click', '.bid-on-cat', async function () {
    const catId = $(this).data('cat-id')
    try {
      await bidOnCat(catId, walletClient.data, bidContractAddress)
    } catch (err) {
      alert("Failed to bid: " + err.message)
    }
  })
  
    // Initialiser DataTables
    $(`#${tableId}`).DataTable({
      order: [[0, 'asc']],
      pageLength: 1000,
      lengthChange: false,
      paging:false,
      responsive:true,
    })

    // Cleanup on unmount
    return () => {
      $(`#${tableId}`).DataTable().destroy()
    }
  }, [visibleCats, isConnected, address, filter])

  return (
    <section className="nes-container with-title" style={{ padding: '1rem', margin: '1rem auto', maxWidth: 1200 }}>
      <h2 className="title">All 625 CryptoCats from {contractAddress}</h2>

      {isConnected && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            <input
              type="radio"
              className="nes-radio"
              name="view-filter"
              value="all"
              checked={filter === 'all'}
              onChange={() => setFilter('all')}
            />
            <span style={{ marginLeft: '0.5rem' }}>All Cats</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="view-filter"
              value="my"
              checked={filter === 'my'}
              onChange={() => setFilter('my')}
            />
            <span style={{ marginLeft: '0.5rem' }}>My Cats</span>
          </label>
        </div>
      )}

      {/* Table montée manuellement */}
      <div className="nes-table-responsive" style={{ overflowX: 'auto' }}>
        <div ref={containerRef} />
      </div>
    </section>
  )
}

function shortAddr(a) {
  if (!a) return '—'
  return `${a.slice(0, 6)}…${a.slice(-4)}`
}

function fmtEth(v) {
  if (!v) return '0'
  try {
    return Number(formatEther(BigInt(v))).toFixed(4)
  } catch {
    return '0'
  }
}


function renderActionButtonHTML(cat, address) {
    const isMine = address && cat.owner?.id?.toLowerCase() === address.toLowerCase()
    const isForSale = cat.status === 'FOR_SALE'
    const hasBid = cat.activeBid
  
    const dataId = `data-cat-id="${cat.id}"`
  
    if (isMine) {
      if (hasBid) {
        return `<button class="nes-btn is-primary accept-bid" ${dataId}>Accept Bid</button>`
      } else if (isForSale) {
        return `
          <button class="nes-btn is-warning update-price" ${dataId}>Update Price</button>
          <button class="nes-btn is-error remove-sale" ${dataId}>Remove Sale</button>
        `
      } else {
        return `<button class="nes-btn is-success put-on-sale" ${dataId}>Put for Sale</button>`
      }
    } else {
      if (isForSale) {
        return `<button class="nes-btn is-success buy-cat" ${dataId}>Buy</button>`
      } else {
        return `<button class="nes-btn is-warning bid-on-cat" ${dataId}>Bid</button>`
      }
    }
  }


  async function buyCat(catId, price, walletClient, contractAddress) {
    await walletClient.writeContract({
      address: contractAddress,
      abi: CRYPTOCATS_ABI,
      functionName: 'buyCat',
      args: [BigInt(catId)],
      value: BigInt(price),
    })
    alert('Cat bought successfully!')
  }

  
  async function putOnSale(catId, walletClient, contractAddress) {
    const price = prompt('Price in ETH:')
    if (!price) return
    const minSalePriceInWei = BigInt(parseFloat(price) * 1e18)
    await walletClient.writeContract({
      address: contractAddress,
      abi: CRYPTOCATS_ABI,
      functionName: 'offerCatForSale',
      args: [BigInt(catId), minSalePriceInWei],
    })
    alert('Cat listed!')
  }
  
  async function updatePrice(catId, walletClient, contractAddress) {
    const newPrice = prompt('New price in ETH:')
    if (!newPrice) return
    const priceWei = BigInt(parseFloat(newPrice) * 1e18)
    await walletClient.writeContract({
      address: contractAddress,
      abi: CRYPTOCATS_ABI,
      functionName: 'setCatPrice',
      args: [BigInt(catId), priceWei],
    })
    alert('Price updated.')
  }
  
  async function removeFromSale(catId, walletClient, contractAddress) {
    await walletClient.writeContract({
      address: contractAddress,
      abi: CRYPTOCATS_ABI,
      functionName: 'catNoLongerForSale',
      args: [BigInt(catId)],
    })
    alert('Cat removed from sale.')
  }
  
  async function acceptBid(catId, walletClient, bidContractAddress) {
    const minPrice = prompt('Minimum price to accept (in ETH):')
    if (!minPrice) return
  
    const minPriceWei = BigInt(parseFloat(minPrice) * 1e18)
  
    try {
      await walletClient.writeContract({
        address: bidContractAddress,
        abi: MARKET_V2_ABI,
        functionName: 'acceptBid',
        args: [BigInt(catId), minPriceWei],
      })
      alert('Bid accepted!')
    } catch (err) {
      alert('Failed to accept bid: ' + err.message)
    }
  }
  
  async function bidOnCat(catId, walletClient, bidContractAddress) {
    const amount = prompt('Bid amount in ETH:')
    if (!amount) return
  
    const value = BigInt(parseFloat(amount) * 1e18)
  
    try {
      await walletClient.writeContract({
        address: bidContractAddress,
        abi: MARKET_V2_ABI,
        functionName: 'bid',
        args: [BigInt(catId)],
        value,
      })
      alert('Bid placed successfully!')
    } catch (err) {
      alert('Failed to place bid: ' + err.message)
    }
  }
  