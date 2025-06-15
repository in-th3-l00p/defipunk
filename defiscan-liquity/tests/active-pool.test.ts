import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ActivePoolAddressChanged } from "../generated/schema"
import { ActivePoolAddressChanged as ActivePoolAddressChangedEvent } from "../generated/ActivePool/ActivePool"
import { handleActivePoolAddressChanged } from "../src/active-pool"
import { createActivePoolAddressChangedEvent } from "./active-pool-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _newActivePoolAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newActivePoolAddressChangedEvent = createActivePoolAddressChangedEvent(
      _newActivePoolAddress
    )
    handleActivePoolAddressChanged(newActivePoolAddressChangedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ActivePoolAddressChanged created and stored", () => {
    assert.entityCount("ActivePoolAddressChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ActivePoolAddressChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_newActivePoolAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
