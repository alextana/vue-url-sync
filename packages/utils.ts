// Improved type definitions
export type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue }
type Primitive = string | number | boolean | null | undefined
type StateValue = JsonValue

// Browser detection
const isBrowser = typeof window !== 'undefined'

// URL and Query Parameter handling
export const getQueryParams = (): URLSearchParams | null => {
  return isBrowser ? new URLSearchParams(window.location.search) : null
}

export const updateUrl = (params: URLSearchParams) => {
  if (!isBrowser) return

  const queryString = params.toString()
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname
  window.history.replaceState({}, '', newUrl)
}

// Value encoding/decoding
export const encode = (value: unknown): string => {
  try {
    const stringified = JSON.stringify(value)
    return isBrowser
      ? btoa(stringified)
      : Buffer.from(stringified).toString('base64')
  } catch {
    return ''
  }
}

export const decode = (encoded: string): unknown => {
  try {
    const decoded = isBrowser
      ? atob(encoded)
      : Buffer.from(encoded, 'base64').toString()
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

// Type guard
export const isJsonValue = (value: unknown): value is JsonValue => {
  try {
    return !!JSON.stringify(value)
  } catch {
    return false
  }
}

export const serializeParam = (value: StateValue): string => {
  if (value === null || value === undefined) return ''
  return encode(value)
}

export const parseQueryParam = <T extends StateValue>(
  value: string | null | undefined,
  fallback?: T
): T => {
  if (!value) return fallback as T

  try {
    const decoded = decode(value)
    return decoded as T
  } catch {
    return fallback as T
  }
}

// Parameter name handling
const paramNameMap = new Map<string, string>()

const generateParamHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36).slice(0, 4)
}

export const encodeParamName = (param: string): string => {
  const existing = paramNameMap.get(param)
  if (existing) return existing

  const encoded = generateParamHash(param)
  paramNameMap.set(param, encoded)
  return encoded
}

// State management
type RefSetter<T = unknown> = (value: T) => void

interface StateRegistry {
  initialValues: Map<string, StateValue>
  activeRefs: Map<string, RefSetter>
}

const stateRegistry: StateRegistry = {
  initialValues: new Map(),
  activeRefs: new Map(),
}

export const storeInitialValue = (param: string, value: StateValue) => {
  stateRegistry.initialValues.set(param, value)
}

export const getInitialValue = (param: string) => {
  return stateRegistry.initialValues.get(param)
}

export const registerRef = (param: string, setter: RefSetter) => {
  stateRegistry.activeRefs.set(param, setter)
}

export const unregisterRef = (param: string) => {
  stateRegistry.activeRefs.delete(param)
}

export const getActiveRefs = () => {
  return Array.from(stateRegistry.activeRefs.entries())
}
