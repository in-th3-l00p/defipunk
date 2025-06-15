import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GovernorTransferred,
  RewardClaimed
} from "../generated/CometRewards/CometRewards"

export function createGovernorTransferredEvent(
  oldGovernor: Address,
  newGovernor: Address
): GovernorTransferred {
  let governorTransferredEvent = changetype<GovernorTransferred>(newMockEvent())

  governorTransferredEvent.parameters = new Array()

  governorTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "oldGovernor",
      ethereum.Value.fromAddress(oldGovernor)
    )
  )
  governorTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "newGovernor",
      ethereum.Value.fromAddress(newGovernor)
    )
  )

  return governorTransferredEvent
}

export function createRewardClaimedEvent(
  src: Address,
  recipient: Address,
  token: Address,
  amount: BigInt
): RewardClaimed {
  let rewardClaimedEvent = changetype<RewardClaimed>(newMockEvent())

  rewardClaimedEvent.parameters = new Array()

  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return rewardClaimedEvent
}
