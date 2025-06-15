'use client'

import { useEffect, useState } from 'react'
import { Activity, TrendingUp, Clock, Hash, Shield, Zap, Layers } from 'lucide-react'
import { subgraphService, LiquitySubgraphData, AaveSubgraphData, MorphoSubgraphData, ActivePoolETHBalanceUpdated } from '../services/subgraph'

interface SubgraphDataProps {
  protocolSlug: string
}

export default function SubgraphData({ protocolSlug }: SubgraphDataProps) {
  const [liquityData, setLiquityData] = useState<LiquitySubgraphData | null>(null)
  const [aaveData, setAaveData] = useState<AaveSubgraphData | null>(null)
  const [morphoData, setMorphoData] = useState<MorphoSubgraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubgraphData() {
      if (!['liquity-v1', 'aave-v3', 'morpho-blue'].includes(protocolSlug)) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        if (protocolSlug === 'liquity-v1') {
          const data = await subgraphService.getLiquityData()
          setLiquityData(data)
        } else if (protocolSlug === 'aave-v3') {
          const data = await subgraphService.getAaveData()
          setAaveData(data)
        } else if (protocolSlug === 'morpho-blue') {
          const data = await subgraphService.getMorphoData()
          setMorphoData(data)
        }
      } catch (err) {
        setError('Failed to fetch on-chain data')
        console.error('Subgraph error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubgraphData()
  }, [protocolSlug])

  if (!['liquity-v1', 'aave-v3', 'morpho-blue'].includes(protocolSlug)) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            On-Chain Analytics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time subgraph data coming soon for this protocol
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded mr-3"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || (!liquityData && !aaveData && !morphoData)) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-900 dark:text-red-400 mb-2">
            Unable to Load On-Chain Data
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">
            {error || 'Failed to fetch subgraph data'}
          </p>
        </div>
      </div>
    )
  }

  // Render Liquity data
  if (protocolSlug === 'liquity-v1' && liquityData) {
    const latestBalance = liquityData.activePoolETHBalanceUpdateds[0]
    const currentETH = latestBalance ? subgraphService.formatETH(latestBalance._ETH) : 'N/A'
    
    const trend = liquityData.activePoolETHBalanceUpdateds.length > 1 ? 
      parseFloat(liquityData.activePoolETHBalanceUpdateds[0]._ETH) > parseFloat(liquityData.activePoolETHBalanceUpdateds[1]._ETH) ? 'up' : 'down' : 'neutral'

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Live On-Chain Analytics
            </h3>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Powered by The Graph
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Active Pool Balance
              </h4>
              <TrendingUp className={`h-5 w-5 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {currentETH}
            </div>
            {latestBalance && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Updated {subgraphService.getTimeAgo(latestBalance.blockTimestamp)}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Activity
              </h4>
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {liquityData.activePoolETHBalanceUpdateds.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Balance updates tracked
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent ETH Balance Updates
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Live data from Liquity's Active Pool contract
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ETH Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Block
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {liquityData.activePoolETHBalanceUpdateds.slice(0, 5).map((update, index) => (
                  <tr key={update.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {subgraphService.formatETH(update._ETH)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        #{update.blockNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {subgraphService.getTimeAgo(update.blockTimestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {update.id.slice(0, 10)}...{update.id.slice(-8)}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Data sourced from{' '}
            <a 
              href="https://api.studio.thegraph.com/query/113928/defiscan-liquity/version/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              The Graph's Subgraph Studio
            </a>
            {' '}• Real-time blockchain indexing for true decentralization
          </p>
        </div>
      </div>
    )
  }

  // Render Aave v3 data
  if (protocolSlug === 'aave-v3' && aaveData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Live Protocol Analytics
            </h3>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Powered by The Graph
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Protocol Upgrades
              </h4>
              <Zap className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              {aaveData.upgradeds.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Implementation updates tracked
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Back/Unbacked Events
              </h4>
              <Activity className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {aaveData.backUnbackeds.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Reserve operations tracked
            </div>
          </div>
        </div>

        {/* Recent Upgrades */}
        {aaveData.upgradeds.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Protocol Upgrades
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Live data from Aave v3's upgrade events
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Implementation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Block
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Event ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {aaveData.upgradeds.slice(0, 5).map((upgrade, index) => (
                    <tr key={upgrade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900 dark:text-white">
                          {subgraphService.formatAddress(upgrade.implementation)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          #{upgrade.blockNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subgraphService.getTimeAgo(upgrade.blockTimestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Hash className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {upgrade.id.slice(0, 10)}...{upgrade.id.slice(-8)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Data sourced from{' '}
            <a 
              href="https://api.studio.thegraph.com/query/113928/defiscan-aave-v-3/version/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              The Graph's Subgraph Studio
            </a>
            {' '}• Real-time blockchain indexing for true decentralization
          </p>
        </div>
      </div>
    )
  }

  // Render Morpho data
  if (protocolSlug === 'morpho-blue' && morphoData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="h-6 w-6 text-teal-600 dark:text-teal-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Live Protocol Analytics
            </h3>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Powered by The Graph
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Protocol Upgrades
              </h4>
              <Zap className="h-5 w-5 text-teal-500" />
            </div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              {morphoData.upgradeds.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Implementation updates tracked
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Latest Upgrade
              </h4>
              <Clock className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {morphoData.upgradeds.length > 0 ? subgraphService.getTimeAgo(morphoData.upgradeds[0].blockTimestamp) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Most recent implementation
            </div>
          </div>
        </div>

        {/* Recent Upgrades */}
        {morphoData.upgradeds.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Protocol Upgrades
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Live data from Morpho's upgrade events
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Implementation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Block
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Event ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {morphoData.upgradeds.slice(0, 5).map((upgrade, index) => (
                    <tr key={upgrade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900 dark:text-white">
                          {subgraphService.formatAddress(upgrade.implementation)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          #{upgrade.blockNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subgraphService.getTimeAgo(upgrade.blockTimestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Hash className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {upgrade.id.slice(0, 10)}...{upgrade.id.slice(-8)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Data sourced from{' '}
            <a 
              href="https://api.studio.thegraph.com/query/113928/defiscan-morpho/version/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              The Graph's Subgraph Studio
            </a>
            {' '}• Real-time blockchain indexing for true decentralization
          </p>
        </div>
      </div>
    )
  }

  return null
} 