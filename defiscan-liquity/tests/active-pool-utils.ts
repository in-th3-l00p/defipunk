import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/ActivePool/ActivePool"

export function createActivePoolAddressChangedEvent(
  _newActivePoolAddress: Address
): ActivePoolAddressChanged {
  let activePoolAddressChangedEvent =
    changetype<ActivePoolAddressChanged>(newMockEvent())

  activePoolAddressChangedEvent.parameters = new Array()

  activePoolAddressChangedEvent.parameters.push(
    new ethereum.EventParam(
      "_newActivePoolAddress",
      ethereum.Value.fromAddress(_newActivePoolAddress)
    )
  )

  return activePoolAddressChangedEvent
}

export function createActivePoolETHBalanceUpdatedEvent(
  _ETH: BigInt
): ActivePoolETHBalanceUpdated {
  let activePoolEthBalanceUpdatedEvent =
    changetype<ActivePoolETHBalanceUpdated>(newMockEvent())

  activePoolEthBalanceUpdatedEvent.parameters = new Array()

  activePoolEthBalanceUpdatedEvent.parameters.push(
    new ethereum.EventParam("_ETH", ethereum.Value.fromUnsignedBigInt(_ETH))
  )

  return activePoolEthBalanceUpdatedEvent
}

export function createActivePoolLUSDDebtUpdatedEvent(
  _LUSDDebt: BigInt
): ActivePoolLUSDDebtUpdated {
  let activePoolLusdDebtUpdatedEvent =
    changetype<ActivePoolLUSDDebtUpdated>(newMockEvent())

  activePoolLusdDebtUpdatedEvent.parameters = new Array()

  activePoolLusdDebtUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "_LUSDDebt",
      ethereum.Value.fromUnsignedBigInt(_LUSDDebt)
    )
  )

  return activePoolLusdDebtUpdatedEvent
}

export function createBorrowerOperationsAddressChangedEvent(
  _newBorrowerOperationsAddress: Address
): BorrowerOperationsAddressChanged {
  let borrowerOperationsAddressChangedEvent =
    changetype<BorrowerOperationsAddressChanged>(newMockEvent())

  borrowerOperationsAddressChangedEvent.parameters = new Array()

  borrowerOperationsAddressChangedEvent.parameters.push(
    new ethereum.EventParam(
      "_newBorrowerOperationsAddress",
      ethereum.Value.fromAddress(_newBorrowerOperationsAddress)
    )
  )

  return borrowerOperationsAddressChangedEvent
}

export function createDefaultPoolAddressChangedEvent(
  _newDefaultPoolAddress: Address
): DefaultPoolAddressChanged {
  let defaultPoolAddressChangedEvent =
    changetype<DefaultPoolAddressChanged>(newMockEvent())

  defaultPoolAddressChangedEvent.parameters = new Array()

  defaultPoolAddressChangedEvent.parameters.push(
    new ethereum.EventParam(
      "_newDefaultPoolAddress",
      ethereum.Value.fromAddress(_newDefaultPoolAddress)
    )
  )

  return defaultPoolAddressChangedEvent
}

export function createETHBalanceUpdatedEvent(
  _newBalance: BigInt
): ETHBalanceUpdated {
  let ethBalanceUpdatedEvent = changetype<ETHBalanceUpdated>(newMockEvent())

  ethBalanceUpdatedEvent.parameters = new Array()

  ethBalanceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "_newBalance",
      ethereum.Value.fromUnsignedBigInt(_newBalance)
    )
  )

  return ethBalanceUpdatedEvent
}

export function createEtherSentEvent(_to: Address, _amount: BigInt): EtherSent {
  let etherSentEvent = changetype<EtherSent>(newMockEvent())

  etherSentEvent.parameters = new Array()

  etherSentEvent.parameters.push(
    new ethereum.EventParam("_to", ethereum.Value.fromAddress(_to))
  )
  etherSentEvent.parameters.push(
    new ethereum.EventParam(
      "_amount",
      ethereum.Value.fromUnsignedBigInt(_amount)
    )
  )

  return etherSentEvent
}

export function createLUSDBalanceUpdatedEvent(
  _newBalance: BigInt
): LUSDBalanceUpdated {
  let lusdBalanceUpdatedEvent = changetype<LUSDBalanceUpdated>(newMockEvent())

  lusdBalanceUpdatedEvent.parameters = new Array()

  lusdBalanceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "_newBalance",
      ethereum.Value.fromUnsignedBigInt(_newBalance)
    )
  )

  return lusdBalanceUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createStabilityPoolAddressChangedEvent(
  _newStabilityPoolAddress: Address
): StabilityPoolAddressChanged {
  let stabilityPoolAddressChangedEvent =
    changetype<StabilityPoolAddressChanged>(newMockEvent())

  stabilityPoolAddressChangedEvent.parameters = new Array()

  stabilityPoolAddressChangedEvent.parameters.push(
    new ethereum.EventParam(
      "_newStabilityPoolAddress",
      ethereum.Value.fromAddress(_newStabilityPoolAddress)
    )
  )

  return stabilityPoolAddressChangedEvent
}

export function createTroveManagerAddressChangedEvent(
  _newTroveManagerAddress: Address
): TroveManagerAddressChanged {
  let troveManagerAddressChangedEvent =
    changetype<TroveManagerAddressChanged>(newMockEvent())

  troveManagerAddressChangedEvent.parameters = new Array()

  troveManagerAddressChangedEvent.parameters.push(
    new ethereum.EventParam(
      "_newTroveManagerAddress",
      ethereum.Value.fromAddress(_newTroveManagerAddress)
    )
  )

  return troveManagerAddressChangedEvent
}
