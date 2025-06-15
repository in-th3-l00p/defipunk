import {
  ActivePoolAddressChanged as ActivePoolAddressChangedEvent,
  ActivePoolETHBalanceUpdated as ActivePoolETHBalanceUpdatedEvent,
  ActivePoolLUSDDebtUpdated as ActivePoolLUSDDebtUpdatedEvent,
  BorrowerOperationsAddressChanged as BorrowerOperationsAddressChangedEvent,
  DefaultPoolAddressChanged as DefaultPoolAddressChangedEvent,
  ETHBalanceUpdated as ETHBalanceUpdatedEvent,
  EtherSent as EtherSentEvent,
  LUSDBalanceUpdated as LUSDBalanceUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  StabilityPoolAddressChanged as StabilityPoolAddressChangedEvent,
  TroveManagerAddressChanged as TroveManagerAddressChangedEvent
} from "../generated/ActivePool/ActivePool"
import {
  ActivePoolAddressChanged,
  ActivePoolETHBalanceUpdated,
  ActivePoolLUSDDebtUpdated,
  BorrowerOperationsAddressChanged,
  DefaultPoolAddressChanged,
  ETHBalanceUpdated,
  EtherSent,
  LUSDBalanceUpdated,
  OwnershipTransferred,
  StabilityPoolAddressChanged,
  TroveManagerAddressChanged
} from "../generated/schema"

export function handleActivePoolAddressChanged(
  event: ActivePoolAddressChangedEvent
): void {
  let entity = new ActivePoolAddressChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newActivePoolAddress = event.params._newActivePoolAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleActivePoolETHBalanceUpdated(
  event: ActivePoolETHBalanceUpdatedEvent
): void {
  let entity = new ActivePoolETHBalanceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._ETH = event.params._ETH

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleActivePoolLUSDDebtUpdated(
  event: ActivePoolLUSDDebtUpdatedEvent
): void {
  let entity = new ActivePoolLUSDDebtUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._LUSDDebt = event.params._LUSDDebt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBorrowerOperationsAddressChanged(
  event: BorrowerOperationsAddressChangedEvent
): void {
  let entity = new BorrowerOperationsAddressChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newBorrowerOperationsAddress =
    event.params._newBorrowerOperationsAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDefaultPoolAddressChanged(
  event: DefaultPoolAddressChangedEvent
): void {
  let entity = new DefaultPoolAddressChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newDefaultPoolAddress = event.params._newDefaultPoolAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleETHBalanceUpdated(event: ETHBalanceUpdatedEvent): void {
  let entity = new ETHBalanceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newBalance = event.params._newBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEtherSent(event: EtherSentEvent): void {
  let entity = new EtherSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._to = event.params._to
  entity._amount = event.params._amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLUSDBalanceUpdated(event: LUSDBalanceUpdatedEvent): void {
  let entity = new LUSDBalanceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newBalance = event.params._newBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStabilityPoolAddressChanged(
  event: StabilityPoolAddressChangedEvent
): void {
  let entity = new StabilityPoolAddressChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newStabilityPoolAddress = event.params._newStabilityPoolAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTroveManagerAddressChanged(
  event: TroveManagerAddressChangedEvent
): void {
  let entity = new TroveManagerAddressChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newTroveManagerAddress = event.params._newTroveManagerAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
