import * as Result from "../src/index"

describe("result", () => {

  test("Result.Ok", () => {
    expect(Result.isOk(Result.Ok("value"))).toBe(true)
    expect(Result.isErr(Result.Ok("value"))).toBe(false)
  })

  test("Result.Err", () => {
    expect(Result.isErr(Result.Err("message"))).toBe(true)
    expect(Result.isOk(Result.Err("message"))).toBe(false)
  })

  test("Result.map", () => {
    const doubleOk = Result.map((n: number) => n * 2)
    expect(doubleOk(Result.Ok(2))).toEqual(Result.Ok(4))
    expect(doubleOk(Result.Err(2))).toEqual(Result.Err(2))
  })

  test("Result.mapErr", () => {
    const appendMessage = Result.mapErr((m: string[]) => [...m, "error2"])
    expect(appendMessage(Result.Err(["error1"]))).toEqual(Result.Err(["error1", "error2"]))
    expect(appendMessage(Result.Ok(1))).toEqual(Result.Ok(1))
  })

  test("Result.andThen", () => {
    const inputOk = Result.Ok("value")
    const failure = Result.Err("failure")
    const success = Result.Ok("success")
    const tryAndFail = Result.andThen((_) => failure)
    const tryAndSucceed = Result.andThen((_) => success)
    expect(tryAndFail(inputOk)).toEqual(failure)
    expect(tryAndSucceed(inputOk)).toEqual(success)
    expect(tryAndSucceed(failure)).toEqual(failure)
  })

})