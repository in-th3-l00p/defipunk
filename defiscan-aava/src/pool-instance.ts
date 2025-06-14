import {
  BackUnbacked as BackUnbackedEvent,
  Borrow as BorrowEvent,
  DeficitCovered as DeficitCoveredEvent,
  DeficitCreated as DeficitCreatedEvent,
  FlashLoan as FlashLoanEvent,
  IsolationModeTotalDebtUpdated as IsolationModeTotalDebtUpdatedEvent,
  LiquidationCall as LiquidationCallEvent,
  MintUnbacked as MintUnbackedEvent,
  MintedToTreasury as MintedToTreasuryEvent,
  Repay as RepayEvent,
  ReserveDataUpdated as ReserveDataUpdatedEvent,
  ReserveDataUpdated1 as ReserveDataUpdated1Event,
  ReserveUsedAsCollateralDisabled as ReserveUsedAsCollateralDisabledEvent,
  ReserveUsedAsCollateralEnabled as ReserveUsedAsCollateralEnabledEvent,
  Supply as SupplyEvent,
  UserEModeSet as UserEModeSetEvent,
  Withdraw as WithdrawEvent
} from "../generated/PoolInstance/PoolInstance"
import {
  BackUnbacked,
  Borrow,
  DeficitCovered,
  DeficitCreated,
  FlashLoan,
  IsolationModeTotalDebtUpdated,
  LiquidationCall,
  MintUnbacked,
  MintedToTreasury,
  Repay,
  ReserveDataUpdated,
  ReserveDataUpdated1,
  ReserveUsedAsCollateralDisabled,
  ReserveUsedAsCollateralEnabled,
  Supply,
  UserEModeSet,
  Withdraw
} from "../generated/schema"

export function handleBackUnbacked(event: BackUnbackedEvent): void {
  let entity = new BackUnbacked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.backer = event.params.backer
  entity.amount = event.params.amount
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBorrow(event: BorrowEvent): void {
  let entity = new Borrow(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.onBehalfOf = event.params.onBehalfOf
  entity.amount = event.params.amount
  entity.interestRateMode = event.params.interestRateMode
  entity.borrowRate = event.params.borrowRate
  entity.referralCode = event.params.referralCode

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeficitCovered(event: DeficitCoveredEvent): void {
  let entity = new DeficitCovered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.caller = event.params.caller
  entity.amountCovered = event.params.amountCovered

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeficitCreated(event: DeficitCreatedEvent): void {
  let entity = new DeficitCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.debtAsset = event.params.debtAsset
  entity.amountCreated = event.params.amountCreated

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFlashLoan(event: FlashLoanEvent): void {
  let entity = new FlashLoan(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.target = event.params.target
  entity.initiator = event.params.initiator
  entity.asset = event.params.asset
  entity.amount = event.params.amount
  entity.interestRateMode = event.params.interestRateMode
  entity.premium = event.params.premium
  entity.referralCode = event.params.referralCode

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIsolationModeTotalDebtUpdated(
  event: IsolationModeTotalDebtUpdatedEvent
): void {
  let entity = new IsolationModeTotalDebtUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.asset = event.params.asset
  entity.totalDebt = event.params.totalDebt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLiquidationCall(event: LiquidationCallEvent): void {
  let entity = new LiquidationCall(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collateralAsset = event.params.collateralAsset
  entity.debtAsset = event.params.debtAsset
  entity.user = event.params.user
  entity.debtToCover = event.params.debtToCover
  entity.liquidatedCollateralAmount = event.params.liquidatedCollateralAmount
  entity.liquidator = event.params.liquidator
  entity.receiveAToken = event.params.receiveAToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMintUnbacked(event: MintUnbackedEvent): void {
  let entity = new MintUnbacked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.onBehalfOf = event.params.onBehalfOf
  entity.amount = event.params.amount
  entity.referralCode = event.params.referralCode

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMintedToTreasury(event: MintedToTreasuryEvent): void {
  let entity = new MintedToTreasury(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.amountMinted = event.params.amountMinted

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRepay(event: RepayEvent): void {
  let entity = new Repay(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.repayer = event.params.repayer
  entity.amount = event.params.amount
  entity.useATokens = event.params.useATokens

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReserveDataUpdated(event: ReserveDataUpdatedEvent): void {
  let entity = new ReserveDataUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.liquidityRate = event.params.liquidityRate
  entity.stableBorrowRate = event.params.stableBorrowRate
  entity.variableBorrowRate = event.params.variableBorrowRate
  entity.liquidityIndex = event.params.liquidityIndex
  entity.variableBorrowIndex = event.params.variableBorrowIndex

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReserveDataUpdated1(
  event: ReserveDataUpdated1Event
): void {
  let entity = new ReserveDataUpdated1(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.liquidityRate = event.params.liquidityRate
  entity.stableBorrowRate = event.params.stableBorrowRate
  entity.variableBorrowRate = event.params.variableBorrowRate
  entity.liquidityIndex = event.params.liquidityIndex
  entity.variableBorrowIndex = event.params.variableBorrowIndex

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReserveUsedAsCollateralDisabled(
  event: ReserveUsedAsCollateralDisabledEvent
): void {
  let entity = new ReserveUsedAsCollateralDisabled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReserveUsedAsCollateralEnabled(
  event: ReserveUsedAsCollateralEnabledEvent
): void {
  let entity = new ReserveUsedAsCollateralEnabled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSupply(event: SupplyEvent): void {
  let entity = new Supply(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.onBehalfOf = event.params.onBehalfOf
  entity.amount = event.params.amount
  entity.referralCode = event.params.referralCode

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserEModeSet(event: UserEModeSetEvent): void {
  let entity = new UserEModeSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.categoryId = event.params.categoryId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
