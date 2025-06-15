// The Graph Subgraph Studio Service
export interface SubgraphConfig {
  url: string;
  apiKey: string;
}

export interface ActivePoolETHBalanceUpdated {
  id: string;
  _ETH: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface ActivePoolAddressChanged {
  id: string;
  _newActivePoolAddress: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface LiquitySubgraphData {
  activePoolAddressChangeds: ActivePoolAddressChanged[];
  activePoolETHBalanceUpdateds: ActivePoolETHBalanceUpdated[];
}

class SubgraphService {
  private configs: Record<string, SubgraphConfig> = {
    'liquity-v1': {
      url: 'https://api.studio.thegraph.com/query/113928/defiscan-liquity/version/latest',
      apiKey: '8fdc02506b8136ade45aa36eba213392'
    }
  };

  private async query<T>(protocol: string, query: string): Promise<T> {
    const config = this.configs[protocol];
    if (!config) {
      throw new Error(`No subgraph configuration found for protocol: ${protocol}`);
    }

    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result.data;
    } catch (error) {
      console.error(`Error querying subgraph for ${protocol}:`, error);
      throw error;
    }
  }

  async getLiquityData(): Promise<LiquitySubgraphData> {
    const query = `
      {
        activePoolAddressChangeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
          id
          _newActivePoolAddress
          blockNumber
          blockTimestamp
        }
        activePoolETHBalanceUpdateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
          id
          _ETH
          blockNumber
          blockTimestamp
        }
      }
    `;

    return this.query<LiquitySubgraphData>('liquity-v1', query);
  }

  // Helper function to format ETH values
  formatETH(weiValue: string): string {
    const eth = parseFloat(weiValue) / 1e18;
    if (eth >= 1000000) {
      return `${(eth / 1000000).toFixed(2)}M ETH`;
    } else if (eth >= 1000) {
      return `${(eth / 1000).toFixed(2)}K ETH`;
    }
    return `${eth.toFixed(4)} ETH`;
  }

  // Helper function to format timestamps
  formatTimestamp(timestamp: string): string {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  }

  // Helper function to get time ago
  getTimeAgo(timestamp: string): string {
    const now = Date.now();
    const eventTime = parseInt(timestamp) * 1000;
    const diffMs = now - eventTime;
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  }
}

export const subgraphService = new SubgraphService(); 