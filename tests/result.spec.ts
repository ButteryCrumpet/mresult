import * as Result from "../src/index"

describe("result", () => {

  test("creates Ok", () => {
    expect(Result.isOk(Result.Ok("value"))).toBe(true)
    expect(Result.isErr(Result.Ok("value"))).toBe(false)
  })

  test("creates Err", () => {
    expect(Result.isErr(Result.Err("message"))).toBe(true)
    expect(Result.isOk(Result.Err("message"))).toBe(false)
  })

})