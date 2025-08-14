import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '7ff0c925bd2bb616752801ac434b8712'
const networks = [mainnet]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
export const appKit = createAppKit({
  projectId,
  adapters: [wagmiAdapter],
  networks,
  metadata: {
    name: 'CryptoCats Market',
    description: 'CryptoCats',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png']
  }
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
