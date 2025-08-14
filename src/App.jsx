import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { appKit } from './main'
import CryptoCatsTable from './CryptoCatsTable.jsx'

const GRAPH_API_URL = 'https://api.studio.thegraph.com/query/118528/crypto-cats-0-x-19-c/version/latest'
const CATS_QUERY = `{
  marketStats(id: "1") {
    totalSales totalVolume averagePrice totalAuctionSales totalAuctionVolume
  }
  cats(orderBy: id, orderDirection: asc, first: 625) {
    id
    owner { id }
    status
    price
    activeBid { amount bidder { id } }
  }
}`

export default function App() {
  const { address, isConnected } = useAccount()
  const [cats, setCats] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { data: balance } = useBalance({ address, query: { enabled: isConnected } })

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(GRAPH_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: CATS_QUERY })
        })
        const json = await res.json()
        if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error')
        setStats(json.data.marketStats)
        setCats(json.data.cats || [])
        setError('')
      } catch (err) {
        console.error(err)
        setError('Error loading data.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
    }}>
      <div className="container">
        <div className="header-actions">
          {!isConnected ? (
            <button className="nes-btn is-primary" onClick={() => appKit.open()}>Connect Wallet</button>
          ) : (
            <span className="nes-text is-success">
              Connected: {address?.slice(0, 6)}…{address?.slice(-4)} — {balance?.formatted.slice(0, 6)} {balance?.symbol}
            </span>
          )}
        </div>

        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <i className="nes-icon is-large cat"></i>
          <h1>CryptoCats Market</h1>
        </header>

        <section className="nes-container with-title">
          <h2 className="title">Global Stats</h2>
          {loading ? (
            <p>Loading…</p>
          ) : error ? (
            <p className="nes-text is-error">{error}</p>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <p>Market V1</p>
                <ul className="nes-list is-circle">
                  <li>Sales: {stats?.totalSales || 0}</li>
                  <li>Volume: {fmtEth(stats?.totalVolume)} ETH</li>
                  <li>Avg. Price: {fmtEth(stats?.averagePrice)} ETH</li>
                </ul>
              </div>
              <div>
                <p>Market V2 (Auctions)</p>
                <ul className="nes-list is-circle">
                  <li>Won: {stats?.totalAuctionSales || 0}</li>
                  <li>Volume: {fmtEth(stats?.totalAuctionVolume)} ETH</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        <CryptoCatsTable cats={cats} />
      </div>
    </div>
  )
}

function fmtEth(value) {
  if (!value) return '0.0000'
  try {
    return Number(formatEther(BigInt(value))).toFixed(4)
  } catch {
    return '0.0000'
  }
}
