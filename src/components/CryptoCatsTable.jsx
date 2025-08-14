// --- CryptoCatsTable.jsx ---
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import './CryptoCatsTable.css' // Ajoute ici ton style NES

export default function CryptoCatsTable({ cats }) {
  const { address, isConnected } = useAccount()

  return (
    <section className="nes-container with-title">
      <h2 className="title">All 625 CryptoCats</h2>
      <div className="nes-table-responsive">
        <table className="nes-table is-bordered is-centered" style={{ width: '100%' }}>
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
            {cats.map((cat) => {
              const isMine =
                isConnected && cat.owner?.id?.toLowerCase() === address?.toLowerCase()
              return (
                <tr key={cat.id} className={isMine ? 'is-owned' : ''}>
                  <td>#{cat.id}</td>
                  <td>
                    <img
                      src={`crypto-cats-images/${cat.id}.png`}
                      alt={`Cat ${cat.id}`}
                      className="cat-image"
                      style={{ width: 48, imageRendering: 'pixelated' }}
                    />
                  </td>
                  <td>{fmtEth(cat.price)}</td>
                  <td>{cat.activeBid ? fmtEth(cat.activeBid.amount) : '—'}</td>
                  <td>{shortAddr(cat.owner?.id)}</td>
                  <td>
                    {cat.activeBid?.bidder?.id ? shortAddr(cat.activeBid.bidder.id) : '—'}
                  </td>
                  <td>{cat.lastSale ? fmtEth(cat.lastSale) : '—'}</td>
                  <td>
                    {cat.status === 'FOR_SALE' ? (
                      <button className="nes-btn is-success">Buy</button>
                    ) : cat.activeBid ? (
                      <button className="nes-btn is-warning">Bid</button>
                    ) : (
                      <button className="nes-btn is-disabled">N/A</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
