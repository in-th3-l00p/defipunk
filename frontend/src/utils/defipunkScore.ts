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
// 
// LIQUITY V1 ANALYSIS (Based on DeFiScan Stage 2 Assessment):
// - Website: https://www.liquity.org
// - Twitter: https://x.com/LiquityProtocol  
// - GitHub: https://github.com/liquity
// - Chain: Ethereum Mainnet
// - Stage: Stage 2 (Low centralization risk across all dimensions)
// - Key Features:
//   * Interest-free loans against ETH collateral (110% minimum ratio)
//   * LUSD stablecoin (USD pegged)
//   * Stability Pool mechanism for liquidations
//   * Completely immutable - all permissions renounced (0x0 owners)
//   * Multiple independent frontends available
//   * Robust oracle fallback system (Chainlink primary, Tellor fallback, "last good price")
// - Contracts: 17 core contracts all with renounced permissions
// - Oracle Dependencies: Chainlink (primary) + Tellor (fallback) + last good price mechanism
//
// AAVE V3 ANALYSIS (Based on DeFiScan Stage 0 Assessment):
// - Website: https://aave.com
// - Twitter: https://x.com/aave
// - GitHub: https://github.com/aave-dao/aave-v3-origin
// - Chain: Ethereum Mainnet
// - Stage: Stage 0 (High centralization risk across upgradeability, autonomy, exit window)
// - Key Features:
//   * Lending protocol for ERC20 assets with collateralized borrowing
//   * Native stablecoin GHO with 1:1 USDC/USDT backing
//   * Multi-chain governance via a.DI cross-chain messaging
//   * Fully upgradeable contracts through Aave Governance
//   * Emergency Admin multisig can pause markets and disable liquidation grace period
// - Major Risks:
//   * High Upgradeability Risk: All core contracts fully upgradeable, Emergency Admin not security council
//   * High Autonomy Risk: Chainlink oracle dependency with no fallback mechanisms
//   * High Exit Window Risk: Emergency Admin powers not protected by exit windows
//   * Potential for controlled liquidations during market downturns via Emergency Admin
// - Governance: AAVE token holders vote, 7-day exit window for Level 2, 1-day for Level 1
// - Oracle: Chainlink feeds with limited validation, no fallback oracles instantiated
//
// MORPHO BLUE ANALYSIS (Based on DeFiScan Stage 1 Assessment):
// - Website: https://morpho.org/
// - Twitter: https://x.com/MorphoLabs
// - GitHub: https://github.com/morpho-org
// - Chain: Ethereum Mainnet
// - Stage: Stage 1 (Medium centralization risk in upgradeability, autonomy, exit window)
// - Key Features:
//   * Permissionless lending market creation with isolated markets
//   * Each market: 1 collateral, 1 loan asset, LLTV, IRM, oracle
//   * Morpho Vaults for managed lending strategies by third-party curators
//   * Core protocol is non-upgradeable and immutable
//   * Minimal governance scope without direct protocol control
// - Risks:
//   * Medium Upgradeability Risk: MORPHO token upgradeable, can impact rewards
//   * Medium Autonomy Risk: 35%+ markets use Chainlink oracles (centralized dependency)
//   * Medium Exit Window Risk: MORPHO token permissions not protected by governance
//   * Chainlink dependency affects 30%+ of TVL, could freeze funds on oracle failure
// - Governance: morpho.eth multisig controls fee switch, LTV tiers, IRMs for new markets only
// - Oracle: Permissionless choice by market creators, but heavy Chainlink dependency
// - Accessibility: Multiple interfaces (app.morpho.org, fallback, self-hosted, third-party)
//
// COMPOUND V3 ANALYSIS (Based on DeFiScan Stage 0 Assessment):
// - Website: https://compound.finance/
// - Twitter: https://x.com/compoundfinance
// - GitHub: https://github.com/compound-finance/compound-protocol
// - Chain: Ethereum Mainnet
// - Stage: Stage 0 (High centralization risk across upgradeability, autonomy, exit window)
// - Key Features:
//   * Lending protocol with base asset liquidity (USDC, WETH, USDT, wstETH, USDS)
//   * Each base asset represents isolated lending market
//   * Multiple collateral assets supported per market
//   * COMP token governance system for parameter updates
// - Major Risks:
//   * High Upgradeability Risk: Fully upgradeable protocol (Governance + Comet contracts)
//   * High Autonomy Risk: Chainlink oracle dependency with no validation or fallback
//   * High Exit Window Risk: 2-day delay insufficient, guardians not security councils
//   * ProposalGuardian can censor proposals, PauseGuardian can freeze markets
//   * Guardian multisigs don't meet security council requirements
// - Governance: COMP holders vote (25k COMP to propose, 400k votes minimum, 3-day voting, 2-day delay)
// - Oracle: Chainlink feeds with no validation or fallback mechanisms
// - Accessibility: Open source frontend but depends on centralized backend (v3-api.compound.finance)
//
// SKY LENDING ANALYSIS (Based on DeFiScan Stage 0 Assessment):
// - Website: https://sky.money/
// - Twitter: https://x.com/SkyEcosystem
// - GitHub: https://github.com/makerdao (protocol code)
// - Chain: Ethereum Mainnet
// - Stage: Stage 0 (High centralization risk across upgradeability, autonomy, exit window)
// - Key Features:
//   * Stablecoin protocol for minting USDS through Collateralized Debt Positions
//   * Built on Maker protocol, replaces DAI with 1:1 DAI<->USDS conversion
//   * sUSDS yield-bearing staking token for USDS holders
//   * Multi-collateral CDP system with various crypto assets
// - Major Risks:
//   * High Upgradeability Risk: USDS/sUSDS fully upgradeable, critical parameters mutable
//   * High Autonomy Risk: Direct USDC dependency (>50% backing possible), Chronicle oracle
//   * High Exit Window Risk: 18-hour minimum delay insufficient, emergency powers bypass delays
//   * USDS directly pegged to USDC (centralized) instead of USD
//   * Emergency Shutdown Module can irreversibly shutdown protocol (500k MKR threshold)
// - Governance: MKR/SKY token holders, continuous approval system, 18-hour minimum delay
// - Oracle: Chronicle price feeds with 1-hour delay, governance can freeze prices
// - Dependencies: Circle USDC (1:1 minting), Chronicle oracles (medium centralization risk)
// - Accessibility: Closed-source frontend, but multiple third-party interfaces available
//
// DYAD ANALYSIS (Based on DeFiScan Stage 0 Assessment):
// - Website: https://dyadstable.xyz
// - Twitter: https://x.com/0xDYAD
// - GitHub: https://github.com/DyadStablecoin
// - Chain: Ethereum Mainnet
// - Stage: Stage 0 (High centralization risk across upgradeability, autonomy, exit window)
// - Key Features:
//   * Interest-free stablecoin minting against collateral (ETH, stETH, TBTC, sUSDe)
//   * 150% minimum collateralization ratio with liquidation mechanism
//   * Excess collateral value tokenized for additional backing utility
//   * Single interface with open source frontend code
// - Major Risks:
//   * Extreme Upgradeability Risk: VaultManagerV4 upgradeable, enables arbitrary DYAD minting
//   * High Autonomy Risk: Immutable Chainlink oracles with no fallback or sanity checks
//   * High Exit Window Risk: No timelock protection, immediate upgrades possible
//   * Team multisig (2/3) can remove vaults and freeze collateral permanently
//   * Oracle failure freezes specific collateral types with no recovery mechanism
// - Governance: Team multisig 0xDeD796De6a14E255487191963dEe436c45995813 (2/3, non-public signers)
// - Oracle: Immutable Chainlink feeds for WETH, stETH, TBTC, sUSDe (no replacement possible)
// - Critical Flaw: If Chainlink feed discontinued, corresponding collateral permanently lost
// - Accessibility: Single interface but open source frontend allows self-hosting
//
const PROTOCOL_CHARACTERISTICS: Record<string, {
  decentralization: number;
  openSource: number;
  selfCustody: number;
  privacy: number;
  immutability: number;
  permissionless: number;
}> = {
  'liquity-v1': {
    decentralization: 98, // Stage 2 - Fully immutable, no governance, all permissions renounced
    openSource: 100, // Fully open source on GitHub: https://github.com/liquity
    selfCustody: 100, // Non-custodial borrowing protocol, users control their collateral
    privacy: 45, // Basic privacy (no KYC), but transactions are on-chain and traceable
    immutability: 100, // Completely immutable - no upgrades possible, all permissions renounced
    permissionless: 100, // Fully permissionless access, multiple independent frontends available
  },
  'morpho-blue': {
    decentralization: 70, // Stage 1 - Medium centralization risk in upgradeability, autonomy, exit window
    openSource: 100, // Fully open source on GitHub: https://github.com/morpho-org
    selfCustody: 100, // Non-custodial lending protocol, users control their assets
    privacy: 30, // Basic privacy (no KYC), but transactions are on-chain and traceable
    immutability: 75, // Medium upgradeability risk - MORPHO token upgradeable, core protocol immutable
    permissionless: 95, // Permissionless market creation, minimal governance scope
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
    decentralization: 40, // Stage 0 - High centralization risk across upgradeability, autonomy, exit window
    openSource: 100, // Fully open source on GitHub: https://github.com/aave-dao/aave-v3-origin
    selfCustody: 100, // Non-custodial lending protocol, users control their assets
    privacy: 25, // Basic privacy (no KYC), but transactions are on-chain and traceable
    immutability: 20, // High upgradeability risk - fully upgradeable contracts, Emergency Admin powers
    permissionless: 85, // Generally permissionless but Emergency Admin can pause markets
  },
  'compound-v3': {
    decentralization: 35, // Stage 0 - High centralization risk across upgradeability, autonomy, exit window
    openSource: 100, // Fully open source on GitHub: https://github.com/compound-finance/compound-protocol
    selfCustody: 100, // Non-custodial lending protocol, users control their assets
    privacy: 20, // Basic privacy (no KYC), but transactions are on-chain and traceable
    immutability: 15, // High upgradeability risk - fully upgradeable protocol, guardian powers
    permissionless: 75, // Generally permissionless but PauseGuardian can freeze markets
  },
  'dyad': {
    decentralization: 25, // Stage 0 - High centralization risk across upgradeability, autonomy, exit window
    openSource: 95, // Fully open source on GitHub: https://github.com/DyadStablecoin
    selfCustody: 90, // Generally non-custodial but multisig can freeze collateral by removing vaults
    privacy: 30, // Basic privacy (no KYC), but transactions are on-chain and traceable
    immutability: 5, // Extreme upgradeability risk - VaultManager upgradeable, arbitrary DYAD minting possible
    permissionless: 60, // Generally permissionless but multisig can remove vaults and freeze collateral
  },
  'sky-lending': {
    decentralization: 30, // Stage 0 - High centralization risk across upgradeability, autonomy, exit window
    openSource: 90, // GitHub available but main frontend not open source
    selfCustody: 100, // Non-custodial CDP protocol, users control their collateral
    privacy: 25, // Basic privacy (no KYC), but transactions are on-chain and traceable
    immutability: 10, // High upgradeability risk - USDS/sUSDS upgradeable, emergency powers
    permissionless: 70, // Generally permissionless but governance can pause contracts, emergency shutdown
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