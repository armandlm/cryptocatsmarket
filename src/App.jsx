import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { appKit } from './main'
import CryptoCatsTable from './CryptoCatsTable.jsx'

const SUBGRAPHS = {
  v1: {
    name: 'CryptoCats v1',
    endpoint: 'https://api.studio.thegraph.com/query/118528/crypto-cats-0-x-19-c/version/latest',
    contractAddress: '0x19c320b43744254ebdBcb1F1BD0e2a3dc08E01dc',
    bidcContractAddress: '0x952224e9cba38b9f330fceba40a7afd88cb87df4',
  },
  v2: {
    name: 'CryptoCats v2',
    endpoint: 'https://api.studio.thegraph.com/query/118528/crypto-cats-0-x-950/version/latest',
    contractAddress: '0x950dEAD1111C90bFb96c64d2C5399cDe76b1F950',
    bidcContractAddress: '0x6A41E46598418ea70e32789241F5891F86efb808',
  },
}

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
  const { data: balance } = useBalance({ address, query: { enabled: isConnected } })

  const [version, setVersion] = useState('v1')
  const [cats, setCats] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const currentGraph = SUBGRAPHS[version]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(currentGraph.endpoint, {
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
    }

    fetchData()
  }, [currentGraph])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <div className="container">
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>


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
        <section className="nes-container with-title" style={{ marginBottom: '0.5rem' }}>
        <h2 className="title">Contract version</h2>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ marginRight: '1rem' }}>
              <input
                type="radio"
                className="nes-radio"
                name="version"
                value="v1"
                checked={version === 'v1'}
                onChange={() => setVersion('v1')}
              />
              <span style={{ marginLeft: '0.5rem' }}>0x19c</span>
            </label>

            <label>
              <input
                type="radio"
                className="nes-radio"
                name="version"
                value="v2"
                checked={version === 'v2'}
                onChange={() => setVersion('v2')}
              />
              <span style={{ marginLeft: '0.5rem' }}>0x950</span>
            </label>
          </div>
        </section>
        <section className="nes-container with-title">
          <h2 className="title">Global Stats</h2>
          {loading ? (
            <p>Loading…</p>
          ) : error ? (
            <p className="nes-text is-error">{error}</p>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <p>{SUBGRAPHS[version].name}</p>
                <ul className="nes-list is-circle">
                  <li>Sales: {stats?.totalSales || 0}</li>
                  <li>Volume: {fmtEth(stats?.totalVolume)} ETH</li>
                  <li>Avg. Price: {fmtEth(stats?.averagePrice)} ETH</li>
                </ul>
              </div>
              <div>
                <p>Auctions</p>
                <ul className="nes-list is-circle">
                  <li>Won: {stats?.totalAuctionSales || 0}</li>
                  <li>Volume: {fmtEth(stats?.totalAuctionVolume)} ETH</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        <CryptoCatsTable
          cats={cats}
          contractAddress={currentGraph.contractAddress}
          bidContractAddress={currentGraph.bidcContractAddress}
        />
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
