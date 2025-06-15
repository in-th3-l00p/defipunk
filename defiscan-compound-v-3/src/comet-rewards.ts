import {
  GovernorTransferred as GovernorTransferredEvent,
  RewardClaimed as RewardClaimedEvent,
} from "../generated/CometRewards/CometRewards"
import { GovernorTransferred, RewardClaimed } from "../generated/schema"

export function handleGovernorTransferred(
  event: GovernorTransferredEvent,
): void {
  let entity = new GovernorTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldGovernor = event.params.oldGovernor
  entity.newGovernor = event.params.newGovernor

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardClaimed(event: RewardClaimedEvent): void {
  let entity = new RewardClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.src = event.params.src
  entity.recipient = event.params.recipient
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
