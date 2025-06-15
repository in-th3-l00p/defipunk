import { Protocol } from '../services/defiLlama';

export type ProtocolStatus = 'High Score' | 'Medium Score' | 'Low Score';

export interface DeFiPunkProtocol {
  id: string;
  name: string;
  href: string;
  status: ProtocolStatus;
  alignmentScore: number;
  category: string;
  tvl: number;
  logo: string;
  change_1d: number;
  chains: string[];
  description: string;
}

// DeFiPunk scoring criteria weights
const SCORING_WEIGHTS = {
  decentralization: 0.25,
  openSource: 0.20,
  selfCustody: 0.20,
  privacy: 0.15,
  immutability: 0.10,
  permissionless: 0.10,
};

// Known protocol characteristics (this would ideally come from a database or API)
const PROTOCOL_CHARACTERISTICS: Record<string, {
  decentralization: number;
  openSource: number;
  selfCustody: number;
  privacy: number;
  immutability: number;
  permissionless: number;
}> = {
  'uniswap': {
    decentralization: 90,
    openSource: 100,
    selfCustody: 100,
    privacy: 30,
    immutability: 95,
    permissionless: 100,
  },
  'aave': {
    decentralization: 85,
    openSource: 100,
    selfCustody: 100,
    privacy: 25,
    immutability: 90,
    permissionless: 95,
  },
  'compound': {
    decentralization: 80,
    openSource: 100,
    selfCustody: 100,
    privacy: 20,
    immutability: 85,
    permissionless: 90,
  },
  'curve': {
    decentralization: 85,
    openSource: 100,
    selfCustody: 100,
    privacy: 30,
    immutability: 90,
    permissionless: 95,
  },
  'makerdao': {
    decentralization: 75,
    openSource: 100,
    selfCustody: 100,
    privacy: 25,
    immutability: 80,
    permissionless: 85,
  },
  'tornado-cash': {
    decentralization: 95,
    openSource: 100,
    selfCustody: 100,
    privacy: 100,
    immutability: 100,
    permissionless: 100,
  },
  'default': {
    decentralization: 50,
    openSource: 70,
    selfCustody: 80,
    privacy: 20,
    immutability: 60,
    permissionless: 70,
  }
};

function calculateAlignmentScore(protocolSlug: string): number {
  const characteristics = PROTOCOL_CHARACTERISTICS[protocolSlug.toLowerCase()] || PROTOCOL_CHARACTERISTICS['default'];
  
  const score = 
    (characteristics.decentralization * SCORING_WEIGHTS.decentralization) +
    (characteristics.openSource * SCORING_WEIGHTS.openSource) +
    (characteristics.selfCustody * SCORING_WEIGHTS.selfCustody) +
    (characteristics.privacy * SCORING_WEIGHTS.privacy) +
    (characteristics.immutability * SCORING_WEIGHTS.immutability) +
    (characteristics.permissionless * SCORING_WEIGHTS.permissionless);
  
  return Math.round(score);
}

function getStatusFromScore(score: number): ProtocolStatus {
  if (score >= 80) return 'High Score';
  if (score >= 60) return 'Medium Score';
  return 'Low Score';
}

export function transformProtocolToDefipunk(protocol: Protocol): DeFiPunkProtocol {
  const alignmentScore = calculateAlignmentScore(protocol.slug);
  const status = getStatusFromScore(alignmentScore);
  
  return {
    id: protocol.id,
    name: protocol.name,
    href: `/protocol/${protocol.slug}`,
    status,
    alignmentScore,
    category: protocol.category,
    tvl: protocol.tvl,
    logo: protocol.logo,
    change_1d: protocol.change_1d,
    chains: protocol.chains,
    description: protocol.description,
  };
}

export function filterAndSortProtocols(protocols: Protocol[]): DeFiPunkProtocol[] {
  return protocols
    .filter(protocol => 
      // Filter out CEX and other non-DeFi protocols
      !['CEX', 'Chain'].includes(protocol.category) &&
      protocol.tvl > 1000000 // Only protocols with > $1M TVL
    )
    .map(transformProtocolToDefipunk)
    .sort((a, b) => b.alignmentScore - a.alignmentScore) // Sort by alignment score descending
    .slice(0, 50); // Top 50 protocols
} 