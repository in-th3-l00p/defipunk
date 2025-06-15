# DeFiPunk Subgraph

A cypherpunk scorecard for DeFi protocols that quantifies alignment with cypherpunk values through comprehensive analysis of decentralization, open source development, self-custody, privacy, immutability, and permissionless access.

## Features

- **Protocol Analysis**: Curated analysis of 6 major DeFi protocols (Liquity, Morpho, Aave v3, Compound v3, Sky, Dyad)
- **DeFiPunk Scoring**: 0-100 alignment scores based on cypherpunk values
- **Live Data**: Real-time TVL and metrics from DeFiLlama API
- **Subgraph Analytics**: On-chain analytics powered by The Graph
- **DeFiScan Integration**: Stage ratings and detailed security analysis
- **AI Assistant**: Chat with DeFiPunk AI for protocol insights and comparisons

## Setup

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required for AI Chat functionality
OPENAI_API_KEY=your_openai_api_key_here
```

### Installation

First, install dependencies and run the development server:

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Main Features

1. **Protocol List**: View all curated protocols with DeFiPunk scores and live TVL data
2. **Protocol Details**: Click any protocol to see detailed analysis, DeFiScan ratings, and live subgraph data
3. **AI Chat**: Click "Ask DeFiPunk AI" to chat with an AI assistant about protocol security and cypherpunk alignment

### DeFiPunk Scoring Criteria

- **Decentralization (25%)**: Governance structure, admin controls, multisig dependencies
- **Open Source (20%)**: Code availability, transparency, auditability  
- **Self-Custody (20%)**: Non-custodial design, user control over assets
- **Privacy (15%)**: KYC requirements, transaction privacy, anonymity
- **Immutability (10%)**: Upgradeability risks, contract immutability
- **Permissionless (10%)**: Access restrictions, censorship resistance

### Supported Protocols

- **Liquity v1** (91/100, Stage 2): Fully immutable lending protocol
- **Morpho Blue** (79/100, Stage 1): Permissionless lending markets
- **Aave v3** (58/100, Stage 0): Upgradeable lending with governance
- **Compound v3** (54/100, Stage 0): Guardian-controlled lending
- **Sky Lending** (49/100, Stage 0): USDC-dependent CDP system
- **Dyad** (44/100, Stage 0): Team-controlled stablecoin protocol

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
