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

// Aave v3 specific interfaces
export interface Upgraded {
  id: string;
  implementation: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface BackUnbacked {
  id: string;
  reserve: string;
  backer: string;
  amount: string;
}

export interface AaveSubgraphData {
  upgradeds: Upgraded[];
  backUnbackeds: BackUnbacked[];
}

// Morpho specific interfaces
export interface MorphoSubgraphData {
  upgradeds: Upgraded[];
}

// Compound v3 specific interfaces
export interface AdminChanged {
  id: string;
  previousAdmin: string;
  newAdmin: string;
  blockNumber: string;
}

export interface BeaconUpgraded {
  id: string;
  beacon: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface CompoundSubgraphData {
  adminChangeds: AdminChanged[];
  beaconUpgradeds: BeaconUpgraded[];
}

// Sky Lending specific interfaces
export interface Approval {
  id: string;
  src: string;
  guy: string;
  wad: string;
}

export interface LogNote {
  id: string;
  sig: string;
  usr: string;
  arg1: string;
}

export interface SkySubgraphData {
  approvals: Approval[];
  logNotes: LogNote[];
}

// Dyad specific interfaces
export interface DyadApproval {
  id: string;
  owner: string;
  spender: string;
  amount: string;
}

export interface Transfer {
  id: string;
  from: string;
  to: string;
  amount: string;
}

export interface DyadSubgraphData {
  approvals: DyadApproval[];
  transfers: Transfer[];
}

class SubgraphService {
  private configs: Record<string, SubgraphConfig> = {
    'liquity-v1': {
      url: 'https://api.studio.thegraph.com/query/113928/defiscan-liquity/version/latest',
      apiKey: '8fdc02506b8136ade45aa36eba213392'
    },
    'aave-v3': {
      url: 'https://api.studio.thegraph.com/query/113928/defiscan-aave-v-3/version/latest',
      apiKey: '8fdc02506b8136ade45aa36eba213392'
    },
    'morpho-blue': {
      url: 'https://api.studio.thegraph.com/query/113928/defiscan-morpho/version/latest',
      apiKey: '8fdc02506b8136ade45aa36eba213392'
    },
    'compound-v3': {
      url: 'https://api.studio.thegraph.com/query/113929/defiscan-compound-v-3/version/latest',
      apiKey: '07e6c18506441560cfded94af605566e'
    },
    'sky-lending': {
      url: 'https://api.studio.thegraph.com/query/113929/defiscan-sky/version/latest',
      apiKey: '07e6c18506441560cfded94af605566e'
    },
    'dyad': {
      url: 'https://api.studio.thegraph.com/query/113929/defiscan-dyad/version/latest',
      apiKey: '07e6c18506441560cfded94af605566e'
    }
  };

  private async query<T>(protocolSlug: string, query: string): Promise<T> {
    const config = this.configs[protocolSlug];
    if (!config) {
      throw new Error(`No subgraph configuration found for ${protocolSlug}`);
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Subgraph query failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  async getLiquityData(): Promise<LiquitySubgraphData> {
    const query = `
      {
        activePoolETHBalanceUpdateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
          id
          _ETH
          blockNumber
          blockTimestamp
        }
        activePoolAddressChangeds(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
          id
          _newActivePoolAddress
          blockNumber
          blockTimestamp
        }
      }
    `;

    return this.query<LiquitySubgraphData>('liquity-v1', query);
  }

  async getAaveData(): Promise<AaveSubgraphData> {
    const query = `
      {
        upgradeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
          id
          implementation
          blockNumber
          blockTimestamp
        }
        backUnbackeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
          id
          reserve
          backer
          amount
          fee
          blockNumber
          blockTimestamp
        }
      }
    `;

    return this.query<AaveSubgraphData>('aave-v3', query);
  }

  async getMorphoData(): Promise<MorphoSubgraphData> {
    const query = `
      {
        upgradeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
          id
          implementation
          blockNumber
          blockTimestamp
        }
      }
    `;

    return this.query<MorphoSubgraphData>('morpho-blue', query);
  }

  async getCompoundData(): Promise<CompoundSubgraphData> {
    const query = `
      {
        adminChangeds(first: 10, orderBy: blockNumber, orderDirection: desc) {
          id
          previousAdmin
          newAdmin
          blockNumber
        }
        beaconUpgradeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
          id
          beacon
          blockNumber
          blockTimestamp
        }
      }
    `;

    return this.query<CompoundSubgraphData>('compound-v3', query);
  }

  async getSkyData(): Promise<SkySubgraphData> {
    const query = `
      {
        approvals(first: 10, orderBy: id, orderDirection: desc) {
          id
          src
          guy
          wad
        }
        logNotes(first: 10, orderBy: id, orderDirection: desc) {
          id
          sig
          usr
          arg1
        }
      }
    `;

    return this.query<SkySubgraphData>('sky-lending', query);
  }

  async getDyadData(): Promise<DyadSubgraphData> {
    const query = `
      {
        approvals(first: 10, orderBy: id, orderDirection: desc) {
          id
          owner
          spender
          amount
        }
        transfers(first: 10, orderBy: id, orderDirection: desc) {
          id
          from
          to
          amount
        }
      }
    `;

    return this.query<DyadSubgraphData>('dyad', query);
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

  // Helper function to format token amounts (for Aave)
  formatTokenAmount(amount: string, decimals: number = 18): string {
    const value = parseFloat(amount) / Math.pow(10, decimals);
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return `${value.toFixed(4)}`;
  }

  // Helper function to format addresses
  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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