import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GovernorTransferred } from "../generated/schema"
import { GovernorTransferred as GovernorTransferredEvent } from "../generated/CometRewards/CometRewards"
import { handleGovernorTransferred } from "../src/comet-rewards"
import { createGovernorTransferredEvent } from "./comet-rewards-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let oldGovernor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newGovernor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newGovernorTransferredEvent = createGovernorTransferredEvent(
      oldGovernor,
      newGovernor
    )
    handleGovernorTransferred(newGovernorTransferredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("GovernorTransferred created and stored", () => {
    assert.entityCount("GovernorTransferred", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GovernorTransferred",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "oldGovernor",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GovernorTransferred",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newGovernor",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
