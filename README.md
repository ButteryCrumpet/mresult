ResultTE
=======

# Description

A simple implementation of the Result type in Typescript. Useful for \
operations that may fail or cause errors. Enforces checking and handling \
of these errors.

# Documentation

The Result<T, E> type is a union of Ok<T> and Err<E>. Both hold and internal value \
and are monads, so can be mapped over using `Result.map` or `Result.mapErr` respectively. \
Use the helper functions `Result.Ok(value)` and `Result.Err(message)` to create a `Result`.

### Example

```typescript
import * as Result from "result-te"

const ok: Ok<string> = Result.Ok("ok")
const err: Err<string> = Result.Err("error")

```

Helper functions are available to determine if a result is an Ok or an Err. As well \
as the match function to give a more fluent, composable way of switching on an Err or \
Ok.

```typescript

if (Result.isOk(ok)) {
    // do something
}

if (Result.isErr(err)) {
    // do something
}

const output = match({
    Ok: (n: number) => `The number is: ${n}`,
    Err: (m: string) => `An error occured with message: "${m}"`
})(result)
// Result === OK(5) -> output === "The number is 5"
// Result === Err("oh dear") -> output === "An error occured with message: "oh dear""

// Return types on both Ok and Err cases must be the same
// Declaring the type the parameters for each case is recommended to avoid odd
// Typescript errors

```

## map and mapErr

The `isOk` and `isErr` helper functions are useful for the use of procedural control \
flow. However, in order to compose functions more easily and seamlessly, Results can \
be mapped using the `Result.map` and `Result.mapErr` functions can be used.

`Result.map` takes a map function of `T => U` for a `Result<T, E>`.
`Result.mapErr` takes a map function of `E => U` for a `Result<T, E>`.


If `Ok`, `Result.map` will return a `Result` with a value of the return of the map \
function applied to the value of the passed in `Result`. \
If `Err`, `Result.map` will return the `Err`.

Conversely `Result.mapErr` will return a new `Err<U>` if the passed in result is an \
`Err<T>`, else if the passed in result is an `Ok<T>` it will return the `Ok`.

### Example

```typescript

// Result.map
const doubleResult = Result.map((n: number) => n * 2)
const result = doubleResult(Result.Ok(5))
// result == Ok(10)

// Result.mapErr
const appendError = Result.map((err: string) => `The error was: ${err}`)
const result = appendError(Result.Err("some failure"))
// result == Err("The error was: some failure")

```

`Result.map` and `Result.mapErr` can be combined with `Result.andThen` to
compose functions fluently.

## andThen

`Result.andThen` us used to chain together operations that have a possibility \
of failing. It type signature is as follows:

```typescript
type andThen = (fn: (x: T) => Result<U, S>) => (r: Result<T, E>) => Result<U, S>
```

If `r` is `Err` it will return an `Err<E>` else it will pass the value inside \
`r` to the function `fn` and return a `Result<U,S>` (either `Ok<U>` or `Err<S>`)

### Example

```typescript
import { andThen } from Result

const parseNumber = (str: string) => {
    const n = parseInt(str, 10)
    return !isNaN(n)
        ? Ok(n)
        : Err("String to number parse error")

}

const validateMonthNum = (n: number) => {
    return n <= 12 && n >= 1
        ? Ok(n)
        : Err("Number must be between 1 and 12")
}

const month = andThen(validateMonth)(parseNumber(5)) // Ok(5)
const parseError = andThen(validateMonth)(parseNumber("error")) // Err("String to number parse error")
const validationError = andThen(validateMonth)(parseNumber(20)) // Err("Number must be between 1 and 12")

```

## value and message

As Typescript/ECMAScript does not have pattern matching two helper functions are \
available. One to extract the value from an `Ok` and one to extract the message from \
an `Err`.

```typescript

const value = Result.value(Result.Ok("value")) // "value"

const message = Result.value(Result.Err("message")) // "message"

```

Please note that if not using Typescript and therefore able to pass an `Ok` to \
`Result.message` or an `Err` to `Result.value` there is possibility for weirdness. \
As such in this case only use these helper functions after checking `isOk` or `isErr`