import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { defiLlama } from '../../../services/defiLlama'
import { filterAndSortProtocols } from '../../../utils/defipunkScore'
import { subgraphService } from '../../../services/subgraph'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// System prompt with all our protocol data
const SYSTEM_PROMPT = `You are DeFiPunk AI, an expert assistant for the DeFiPunk Subgraph application - a cypherpunk scorecard for DeFi protocols. You have comprehensive knowledge about 6 curated DeFi protocols and their alignment with cypherpunk values.

## Your Knowledge Base:

### LIQUITY V1 (DeFiPunk Score: 91/100 - Stage 2)
- Website: https://www.liquity.org
- Twitter: https://x.com/LiquityProtocol
- GitHub: https://github.com/liquity
- Stage 2 (Low centralization risk across all dimensions)
- Interest-free loans against ETH collateral (110% minimum ratio)
- LUSD stablecoin (USD pegged)
- Completely immutable - all permissions renounced (0x0 owners)
- Multiple independent frontends available
- Robust oracle fallback system (Chainlink primary, Tellor fallback, "last good price")
- 17 core contracts all with renounced permissions

### AAVE V3 (DeFiPunk Score: 58/100 - Stage 0)
- Website: https://aave.com
- Twitter: https://x.com/aave
- GitHub: https://github.com/aave-dao/aave-v3-origin
- Stage 0 (High centralization risk across upgradeability, autonomy, exit window)
- Lending protocol for ERC20 assets with collateralized borrowing
- Native stablecoin GHO with 1:1 USDC/USDT backing
- Fully upgradeable contracts through Aave Governance
- Emergency Admin multisig can pause markets and disable liquidation grace period
- High upgradeability, autonomy, and exit window risks

### MORPHO BLUE (DeFiPunk Score: 79/100 - Stage 1)
- Website: https://morpho.org/
- Twitter: https://x.com/MorphoLabs
- GitHub: https://github.com/morpho-org
- Stage 1 (Medium centralization risk in upgradeability, autonomy, exit window)
- Permissionless lending market creation with isolated markets
- Core protocol is non-upgradeable and immutable
- MORPHO token upgradeable, can impact rewards
- 35%+ markets use Chainlink oracles (centralized dependency)

### COMPOUND V3 (DeFiPunk Score: 54/100 - Stage 0)
- Website: https://compound.finance/
- Twitter: https://x.com/compoundfinance
- GitHub: https://github.com/compound-finance/compound-protocol
- Stage 0 (High centralization risk across upgradeability, autonomy, exit window)
- Lending protocol with base asset liquidity (USDC, WETH, USDT, wstETH, USDS)
- Fully upgradeable protocol (Governance + Comet contracts)
- ProposalGuardian can censor proposals, PauseGuardian can freeze markets
- Guardian multisigs don't meet security council requirements

### SKY LENDING (DeFiPunk Score: 49/100 - Stage 0)
- Website: https://sky.money/
- Twitter: https://x.com/SkyEcosystem
- GitHub: https://github.com/makerdao
- Stage 0 (High centralization risk across upgradeability, autonomy, exit window)
- Stablecoin protocol for minting USDS through Collateralized Debt Positions
- Built on Maker protocol, replaces DAI with 1:1 DAI<->USDS conversion
- USDS directly pegged to USDC (centralized) instead of USD
- Emergency Shutdown Module can irreversibly shutdown protocol

### DYAD (DeFiPunk Score: 44/100 - Stage 0)
- Website: https://dyadstable.xyz
- Twitter: https://x.com/0xDYAD
- GitHub: https://github.com/DyadStablecoin
- Stage 0 (High centralization risk across upgradeability, autonomy, exit window)
- Interest-free stablecoin minting against collateral (ETH, stETH, TBTC, sUSDe)
- VaultManagerV4 upgradeable, enables arbitrary DYAD minting
- Team multisig (2/3) can remove vaults and freeze collateral permanently
- Critical flaw: If Chainlink feed discontinued, corresponding collateral permanently lost

## DeFiPunk Scoring Criteria:
- Decentralization (25%): Governance structure, admin controls, multisig dependencies
- Open Source (20%): Code availability, transparency, auditability
- Self-Custody (20%): Non-custodial design, user control over assets
- Privacy (15%): KYC requirements, transaction privacy, anonymity
- Immutability (10%): Upgradeability risks, contract immutability
- Permissionless (10%): Access restrictions, censorship resistance

## Your Role:
- Answer questions about protocol security, decentralization, and cypherpunk alignment
- Explain DeFiScan stage ratings and what they mean
- Compare protocols across different dimensions
- Provide insights about on-chain analytics and subgraph data
- Help users understand risks and benefits of each protocol
- Always cite specific data points and scores when relevant

Be helpful, accurate, and focus on the cypherpunk values of privacy, decentralization, and trustlessness.`

export async function POST(req: NextRequest) {
  try {
    const { message, protocolSlug } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Fetch current protocol data
    let contextData = ''
    
    try {
      const protocols = await defiLlama.getProtocolsWithCache()
      const defipunkProtocols = filterAndSortProtocols(protocols)
      
      contextData += `\n## Current Protocol Data (Live from DeFiLlama):\n`
      defipunkProtocols.forEach(protocol => {
        contextData += `- ${protocol.name}: TVL $${(protocol.tvl / 1e6).toFixed(2)}M, 24h change: ${protocol.change_1d.toFixed(2)}%, Category: ${protocol.category}\n`
      })

      // If specific protocol requested, get subgraph data
      if (protocolSlug) {
        try {
          let subgraphData: any = null
          
          switch (protocolSlug) {
            case 'liquity-v1':
              subgraphData = await subgraphService.getLiquityData()
              break
            case 'aave-v3':
              subgraphData = await subgraphService.getAaveData()
              break
            case 'morpho-blue':
              subgraphData = await subgraphService.getMorphoData()
              break
            case 'compound-v3':
              subgraphData = await subgraphService.getCompoundData()
              break
            case 'sky-lending':
              subgraphData = await subgraphService.getSkyData()
              break
            case 'dyad':
              subgraphData = await subgraphService.getDyadData()
              break
          }
          
          if (subgraphData && Object.keys(subgraphData).length > 0) {
            contextData += `\n## Live Subgraph Data for ${protocolSlug}:\n`
            contextData += JSON.stringify(subgraphData, null, 2)
          }
        } catch (error) {
          console.log('Subgraph data not available for', protocolSlug)
        }
      }
    } catch (error) {
      console.error('Error fetching context data:', error)
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT + contextData
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 