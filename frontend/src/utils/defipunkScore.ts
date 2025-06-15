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

// Global filter list - only these protocols will be shown
export const ALLOWED_PROTOCOLS = [
  'liquity-v1', 
  'morpho-blue',
  'aave-v3',
  'compound-v3',
  'dyad',
  'sky-lending',
  'makerdao' // Include makerdao for compatibility
];

// Mapping from DeFiLlama slugs to DeFiScan slugs
export const DEFISCAN_SLUG_MAPPING: Record<string, string> = {
  'liquity-v1': 'liquity',
  'morpho-blue': 'morpho',
  'aave-v3': 'aave-v3',
  'compound-v3': 'compound-v3',
  'dyad': 'dyad',
  'sky-lending': 'sky',
  'makerdao': 'makerdao'
};

// Helper function to get DeFiScan URL
export function getDeFiScanUrl(defiLlamaSlug: string): string {
  const defiscanSlug = DEFISCAN_SLUG_MAPPING[defiLlamaSlug.toLowerCase()] || defiLlamaSlug;
  return `https://www.defiscan.info/protocols/${defiscanSlug}`;
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
  'liquity-v1': {
    decentralization: 95,
    openSource: 100,
    selfCustody: 100,
    privacy: 40,
    immutability: 100,
    permissionless: 100,
  },
  'morpho-blue': {
    decentralization: 80,
    openSource: 100,
    selfCustody: 100,
    privacy: 30,
    immutability: 85,
    permissionless: 90,
  },
  'morpho-aave': {
    decentralization: 80,
    openSource: 100,
    selfCustody: 100,
    privacy: 30,
    immutability: 85,
    permissionless: 90,
  },
  'morpho-aavev3': {
    decentralization: 80,
    openSource: 100,
    selfCustody: 100,
    privacy: 30,
    immutability: 85,
    permissionless: 90,
  },
  'aave-v3': {
    decentralization: 85,
    openSource: 100,
    selfCustody: 100,
    privacy: 25,
    immutability: 90,
    permissionless: 95,
  },
  'compound-v3': {
    decentralization: 80,
    openSource: 100,
    selfCustody: 100,
    privacy: 20,
    immutability: 85,
    permissionless: 90,
  },
  'dyad': {
    decentralization: 75,
    openSource: 95,
    selfCustody: 100,
    privacy: 30,
    immutability: 80,
    permissionless: 85,
  },
  'sky-lending': {
    decentralization: 75,
    openSource: 100,
    selfCustody: 100,
    privacy: 25,
    immutability: 80,
    permissionless: 85,
  },
  'makerdao': {
    decentralization: 75,
    openSource: 100,
    selfCustody: 100,
    privacy: 25,
    immutability: 80,
    permissionless: 85,
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
    .filter(protocol => {
      // Only include protocols that are in our allowed list
      const isAllowed = ALLOWED_PROTOCOLS.includes(protocol.slug.toLowerCase());
      
      // Additional filters
      const isValidCategory = !['CEX', 'Chain'].includes(protocol.category);
      const hasMinimumTvl = protocol.tvl > 0; // Allow any TVL for our curated list
      
      return isAllowed && isValidCategory && hasMinimumTvl;
    })
    .map(transformProtocolToDefipunk)
    .sort((a, b) => b.alignmentScore - a.alignmentScore); // Sort by alignment score descending
} 