import * as Result from "../src/index"

describe("Result", () => {

  describe(".match", () => {

    const match = Result.match({
      Ok: (n: number) => `The number is ${n}`,
      Err: (m: string) => `An error occurred: ${m}`
    })

    test("matches on Ok", () => {
      expect(match(Result.Ok(5))).toBe("The number is 5")
    })

    test("matches on Err", () => {
      expect(match(Result.Err("oh dear"))).toBe("An error occurred: oh dear")
    })

  })

  describe(".map", () => {
    const doubleOk = Result.map((n: number) => n * 2)

    test("if Ok<T>; maps to an Ok<U>", () => {
      expect(doubleOk(Result.Ok(2))).toEqual(Result.Ok(4))
    })

    test("if Err; returns an equal Err", () => {
      expect(doubleOk(Result.Err(2))).toEqual(Result.Err(2))
    })
  })

  describe(".mapErr", () => {
    const appendMessage = Result.mapErr((m: string[]) => [...m, "error2"])

    test("if Err<T>; maps to an Err<U>", () => {
      expect(appendMessage(Result.Err(["error1"]))).toEqual(Result.Err(["error1", "error2"]))
    })

    test("if Ok; returns an equal Ok", () => {
      expect(appendMessage(Result.Ok(1))).toEqual(Result.Ok(1))      
    })
  })


  describe(".andThen", () => {
    const inputOk = Result.Ok("value")
    const failure = Result.Err("failure")
    const success = Result.Ok("success")
    const tryAndFail = Result.andThen((_) => failure)
    const tryAndSucceed = Result.andThen((_) => success)

    test("returns an Err if chained function 'fails'", () => {
      expect(tryAndFail(inputOk)).toEqual(failure)
    })

    test("returns Err<T> if original result is Err<T>", () => {
      expect(tryAndSucceed(failure)).toEqual(failure)
    })

    test("returns Ok if original Result is Ok and chained function 'passes'", () => {
      expect(tryAndSucceed(inputOk)).toEqual(success)
    })
  })

  describe(".withDefault", () => {
    const defaulter = Result.withDefault("default")

    test("if Ok<T>; returns T", () => {
      expect(defaulter(Result.Ok("not default"))).toBe("not default")
    })

    test("if Err; returns default", () => {
      expect(defaulter(Result.Err("error"))).toBe("default")
    })
  })
  
  describe("Extractor helper functions", () => {
    test("Result.value", () => {
      expect(Result.value(Result.Ok("value"))).toBe("value")
    })
  
    test("Result.message", () => {
      expect(Result.message(Result.Err("message"))).toBe("message")
    })
  })

  describe("Type checks", () => {

    test(".isOk", () => {
      expect(Result.isOk(Result.Ok("value"))).toBe(true)
      expect(Result.isErr(Result.Ok("value"))).toBe(false)
    })
  
    test(".isErr", () => {
      expect(Result.isErr(Result.Err("message"))).toBe(true)
      expect(Result.isOk(Result.Err("message"))).toBe(false)
    })
  })

})