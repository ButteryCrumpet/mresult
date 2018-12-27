/**
 * Implementation of Result<T, E> (Ok<T> | Err<E>)
 * draws heavily from Elm's implementation
 *
 * Use to manage errors and other points of failure
 * in the program
 * 
 * @module MResult
 * @author Simon Leigh
*/


/**
 * Result type
 * A Result<T, E> will be either an OK<T> or Err<E>
 */
export type Result<T, E> = Ok<T> | Err<E>


/**
 * Ok<T> type
 * Represents the overcoming of a point of possible failure
 */
type Ok<T> = ["ok", T]


/**
 * Err<E> type
 * Represents a failure
 */
type Err<E> = ["err", E]


/**
 * Helper function to generate an Ok<T>
 */
type makeOk = <T>(value: T) => Ok<T>
export const Ok: makeOk
 = value => ["ok", value]


/**
 * Helper function to generate an Err<E>
 */
type makeErr = <E>(message: E) => Err<E>
export const Err: makeErr
  = message => ["err", message]


/**
 * Check if a Result<T, E> is an Ok<T>
 */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result[0] === "ok"


/**
 * Check if a Result<T, E> is an Err<E>
 */
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => result[0] === "err"


/**
 * Maps Result<T, E> to a Result<U, E> using passed in function
 * returns Err<E> if passed result is an Err
 */
type map = <U, T, E>(fn: (val: T) => U) => (result: Result<T, E>) => Result<U, E>
export const map: map
  = fn => result => isOk(result) ? Ok(fn(result[1])) : result
 
  
/**
 * Maps Result<T, E> to a Result<T, U> using passed in function
 * returns the Ok<T> as is if passed result is an OK
 */
type mapErr = <U, T, E>(fn: (val: E) => U) => (result: Result<T, E>) => Result<T, U>
export const mapErr: mapErr
  = fn => result => isErr(result) ? Err(fn(result[1])) : result


/**
 * Chain operations on a Result<T, E> that may also return a Result
 * short circuits and returns None if passed Result is an Err
 */
type andThen = <U, T, E>(fn: (val: T) => Result<U, E>) => (result: Result<T, E>) => Result<U, E>
export const andThen: andThen
  = fn => result => isOk(result) ? fn(result[1]) : result


/**
 * Return the value: T of a Result<T, E> if Ok<T> or the default
 * if it is an Err<E>
 */
type withDefault = <T, E>(def: T) => (result: Result<T, E>) => T
export const withDefault: withDefault
  = d => r => isOk(r) ? r[1] : d


/**
 * Unwrap an Ok<T> returning the value contained inside the Result
 */
type value = <T>(ok: Ok<T>) => T
export const value: value
  = ok => ok[1]


/**
 * Unwrap an Err<T> returning the value contained inside the Result
 */
type message = <T>(err: Err<T>) => T
export const message: message
  = e => e[1]
