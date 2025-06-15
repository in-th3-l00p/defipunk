'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { defiLlama } from '../services/defiLlama'
import { DeFiPunkProtocol, ProtocolStatus, filterAndSortProtocols } from '../utils/defipunkScore'
import Image from 'next/image'

const statuses: Record<ProtocolStatus, string> = {
  'High Score': 'text-green-700 bg-green-50 ring-green-600/20',
  'Medium Score': 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
  'Low Score': 'text-red-700 bg-red-50 ring-red-600/20',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function formatTvl(tvl: number): string {
  if (tvl >= 1e9) {
    return `$${(tvl / 1e9).toFixed(2)}B`
  } else if (tvl >= 1e6) {
    return `$${(tvl / 1e6).toFixed(2)}M`
  } else if (tvl >= 1e3) {
    return `$${(tvl / 1e3).toFixed(2)}K`
  }
  return `$${tvl.toFixed(2)}`
}

export default function Home() {
  const [protocols, setProtocols] = useState<DeFiPunkProtocol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProtocols() {
      try {
        setLoading(true)
        const apiData = await defiLlama.getProtocolsWithCache()
        const defipunkProtocols = filterAndSortProtocols(apiData)
        setProtocols(defipunkProtocols)
      } catch (err) {
        setError('Failed to fetch protocols. Please try again later.')
        console.error('Error fetching protocols:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProtocols()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading DeFiPunk protocols...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            DeFiPunk Subgraph
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The Cypherpunk Scorecard for DeFi. We quantify how each protocol aligns with key cypherpunk values—privacy integrations, decentralization, FLOSS licensing, self-custody, and immutable execution.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Featuring curated protocols from DeFiScan.info analysis: Liquity, Morpho, Aave v3, Compound v3, Dyad, and Sky.
          </p>
          <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>📊 {protocols.length} curated protocols</span>
            <span>•</span>
            <span>🔄 Updated in real-time</span>
            <span>•</span>
            <span>⚡ Powered by DeFiLlama</span>
            <span>•</span>
            <span>🛡️ Analyzed by DeFiScan</span>
          </div>
          
          <div className="mt-8 flex justify-center">
            <a
              href="/chat"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              🤖 Ask DeFiPunk AI
            </a>
          </div>
        </div>

        {/* Information Sections */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* DeFiScan Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🛡️</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  What is DeFiScan?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Decentralization analysis framework
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <strong>DeFiScan</strong> is a comprehensive framework that formalizes the decentralization stages of DeFi protocols, 
                enabling verifiable assessment of maturity and risks in DeFi technology.
              </p>
              <div className="space-y-2">
                <p><strong>Stage 0 - Full Training Wheels:</strong> Centralized control with basic transparency</p>
                <p><strong>Stage 1 - Limited Training Wheels:</strong> Reduced centralization risks with security councils</p>
                <p><strong>Stage 2 - No Training Wheels:</strong> Fully autonomous with minimal centralization risks</p>
              </div>
              <p>
                DeFiScan analyzes five key dimensions: <strong>Chain</strong> (underlying blockchain), 
                <strong>Upgradeability</strong> (permission risks), <strong>Autonomy</strong> (external dependencies), 
                <strong>Exit Window</strong> (user protection), and <strong>Accessibility</strong> (interface availability).
              </p>
              <div className="mt-4">
                <a
                  href="https://www.defiscan.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Visit DeFiScan.info →
                </a>
              </div>
            </div>
          </div>

          {/* The Graph Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  What is The Graph?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Decentralized blockchain data indexing
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <strong>The Graph</strong> is a decentralized protocol for indexing and querying blockchain data across 90+ networks, 
                making blockchain data easily accessible for developers without complex infrastructure.
              </p>
              <div className="space-y-2">
                <p><strong>Subgraphs:</strong> Open APIs to query blockchain data created by anyone</p>
                <p><strong>Substreams:</strong> High-performance real-time data streams</p>
                <p><strong>Token API:</strong> Instant access to standardized token data</p>
              </div>
              <p>
                The Graph solves the challenge of querying blockchain data by providing a globally distributed network 
                of indexers who process smart contract events and serve organized data through GraphQL APIs.
              </p>
              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  • 1.27+ trillion queries served • 75K+ projects • 99.99%+ uptime
                </p>
                <a
                  href="https://thegraph.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                >
                  Learn about The Graph →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How DeFiPunk Subgraph Works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">DeFiScan Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We analyze protocols using DeFiScan's rigorous framework, examining decentralization across 5 key dimensions
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Data Integration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Real-time protocol data from DeFiLlama and on-chain analytics from The Graph subgraphs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cypherpunk Scoring</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Weighted scoring system that quantifies alignment with cypherpunk values of privacy, decentralization, and autonomy
              </p>
            </div>
          </div>
        </div>

        {/* Protocols List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Curated DeFi Protocols
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Click any protocol to view detailed analysis, DeFiScan ratings, and live subgraph data
            </p>
          </div>
          <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-700">
            {protocols.map((protocol) => (
              <li key={protocol.id} className="flex items-center justify-between gap-x-6 py-5 px-6">
                <div className="flex items-center gap-x-4 min-w-0">
                  {protocol.logo && (
                    <Image
                      src={protocol.logo}
                      alt={`${protocol.name} logo`}
                      width={40}
                      height={40}
                      className="rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{protocol.name}</p>
                      <p
                        className={classNames(
                          statuses[protocol.status],
                          'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                        )}
                      >
                        {protocol.status}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <p className="whitespace-nowrap">
                        Alignment Score: {protocol.alignmentScore}
                      </p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle r={1} cx={1} cy={1} />
                      </svg>
                      <p className="truncate">Category: {protocol.category}</p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle r={1} cx={1} cy={1} />
                      </svg>
                      <p className="truncate">TVL: {formatTvl(protocol.tvl)}</p>
                      {protocol.change_1d !== 0 && (
                        <>
                          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                            <circle r={1} cx={1} cy={1} />
                          </svg>
                          <p className={`truncate ${protocol.change_1d > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {protocol.change_1d > 0 ? '+' : ''}{protocol.change_1d.toFixed(2)}%
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <a
                    href={protocol.href}
                    className="hidden rounded-md bg-white dark:bg-gray-700 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:block"
                  >
                    View details<span className="sr-only">, {protocol.name}</span>
                  </a>
                  <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white dark:bg-gray-700 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <MenuItem>
                        <a
                          href={protocol.href}
                          className="block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          View<span className="sr-only">, {protocol.name}</span>
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Analyze<span className="sr-only">, {protocol.name}</span>
                        </a>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
