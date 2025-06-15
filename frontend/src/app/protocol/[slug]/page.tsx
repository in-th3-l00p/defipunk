'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ExternalLink, Github, Globe, Twitter } from 'lucide-react'
import { defiLlama, Protocol } from '../../../services/defiLlama'
import { DeFiPunkProtocol, transformProtocolToDefipunk, ProtocolStatus, getDeFiScanUrl } from '../../../utils/defipunkScore'

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

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function ProtocolPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [protocol, setProtocol] = useState<DeFiPunkProtocol | null>(null)
  const [rawProtocol, setRawProtocol] = useState<Protocol | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProtocol() {
      try {
        setLoading(true)
        const apiData = await defiLlama.getProtocolsWithCache()
        const foundProtocol = apiData.find(p => p.slug === slug)
        
        if (!foundProtocol) {
          setError('Protocol not found')
          return
        }
        
        setRawProtocol(foundProtocol)
        setProtocol(transformProtocolToDefipunk(foundProtocol))
      } catch (err) {
        setError('Failed to fetch protocol data')
        console.error('Error fetching protocol:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProtocol()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading protocol details...</p>
        </div>
      </div>
    )
  }

  if (error || !protocol || !rawProtocol) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">{error || 'Protocol not found'}</p>
          <Link 
            href="/"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Protocols
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to all protocols
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            {protocol.logo && (
              <Image
                src={protocol.logo}
                alt={`${protocol.name} logo`}
                width={64}
                height={64}
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                {protocol.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                {protocol.category} Protocol
              </p>
            </div>
          </div>

          {/* Status and Score */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className={classNames(
                statuses[protocol.status],
                'inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset'
              )}
            >
              DeFiPunk Score: {protocol.alignmentScore}/100
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              TVL: {formatTvl(protocol.tvl)}
            </span>
            {protocol.change_1d !== 0 && (
              <span className={`text-sm ${protocol.change_1d > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {protocol.change_1d > 0 ? '+' : ''}{protocol.change_1d.toFixed(2)}% (24h)
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          {/* Protocol Info Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Protocol Information
            </h2>
            
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {rawProtocol.url && (
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500 dark:text-gray-400 w-32">
                        Website
                      </td>
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        <a
                          href={rawProtocol.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Globe className="mr-1 h-4 w-4" />
                          {rawProtocol.url}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  )}
                  
                  {rawProtocol.twitter && (
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Twitter
                      </td>
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        <a
                          href={`https://twitter.com/${rawProtocol.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Twitter className="mr-1 h-4 w-4" />
                          @{rawProtocol.twitter}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  )}
                  
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      DeFiLlama
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      <a
                        href={`https://defillama.com/protocol/${rawProtocol.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View on DeFiLlama
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      DeFiScan
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      <a
                        href={getDeFiScanUrl(rawProtocol.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View detailed analysis on DeFiScan
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Chains
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      <div className="flex flex-wrap gap-1">
                        {rawProtocol.chains.slice(0, 5).map((chain) => (
                          <span
                            key={chain}
                            className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200"
                          >
                            {chain}
                          </span>
                        ))}
                        {rawProtocol.chains.length > 5 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{rawProtocol.chains.length - 5} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Listed
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {formatDate(rawProtocol.listedAt)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Description */}
          {rawProtocol.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {rawProtocol.description}
              </p>
            </div>
          )}

          {/* DeFiPunk Scoring */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              DeFiPunk Alignment Analysis
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Overall Score: {protocol.alignmentScore}/100
                </span>
                <span
                  className={classNames(
                    statuses[protocol.status],
                    'inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset'
                  )}
                >
                  {protocol.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This score reflects how well the protocol aligns with cypherpunk values: decentralization, 
                open source development, self-custody, privacy, immutability, and permissionless access.
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  <strong>For detailed decentralization analysis and security assessment, visit:</strong>
                </p>
                <a
                  href={getDeFiScanUrl(rawProtocol.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  DeFiScan.info - Complete Protocol Analysis
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            See all Protocols
          </Link>
        </div>
      </div>
    </div>
  )
} 