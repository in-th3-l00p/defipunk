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
        <div className="text-center">
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
          <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>📊 {protocols.length} protocols analyzed</span>
            <span>•</span>
            <span>🔄 Updated in real-time</span>
            <span>•</span>
            <span>⚡ Powered by DeFiLlama</span>
          </div>
        </div>

        {/* Protocols List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
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
