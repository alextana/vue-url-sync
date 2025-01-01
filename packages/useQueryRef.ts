import { ref, computed, onUnmounted, Ref, ComputedRef } from 'vue'
import type { JsonValue } from './utils'
import * as utils from './utils'

// Improved type definitions
type QueryRefValue<T> = ComputedRef<T>

type QueryRefReturn<K extends string, T extends JsonValue> = {
  [P in K]: QueryRefValue<T>
} & {
  reset: () => void
}

// Add configuration type
interface QueryRefConfig {
  obfuscate?: boolean
}

// Default configuration
const defaultConfig: QueryRefConfig = {
  obfuscate: true,
}

// URL state management
const resetUrlParam = (
  param: string,
  config: QueryRefConfig = defaultConfig
): void => {
  const queryParams = utils.getQueryParams()
  if (!queryParams) return

  const paramName = config.obfuscate ? utils.encodeParamName(param) : param
  queryParams.delete(paramName)
  utils.updateUrl(queryParams)
}

const useQueryRefHook = <K extends string, T extends JsonValue>(
  param: K,
  initialState?: T,
  config: QueryRefConfig = defaultConfig
): QueryRefReturn<K, T> => {
  // Initialize with optional encoding
  const paramName = config.obfuscate ? utils.encodeParamName(param) : param
  utils.storeInitialValue(param, initialState)

  // State setup
  const queryParams = utils.getQueryParams()
  const state = ref<T>(
    utils.parseQueryParam(
      queryParams?.get(paramName) ?? null,
      initialState,
      config.obfuscate
    )
  ) as Ref<T>

  // Register ref for global state management
  utils.registerRef(param, (value: unknown) => {
    if (utils.isJsonValue(value)) {
      state.value = value as T
    }
  })

  onUnmounted(() => {
    utils.unregisterRef(param)
  })

  // Create computed property with URL sync
  const trackedValue = computed({
    get: () => state.value,
    set: (newValue) => {
      state.value = newValue

      const queryParams = utils.getQueryParams()
      if (!queryParams) return

      const serializedValue = utils.serializeParam(newValue, config.obfuscate)
      serializedValue
        ? queryParams.set(paramName, serializedValue)
        : queryParams.delete(paramName)

      utils.updateUrl(queryParams)
    },
  })

  return {
    [param]: trackedValue,
    reset: () => {
      resetUrlParam(param, config)
      state.value = initialState as T
    },
  } as QueryRefReturn<K, T>
}

// Global reset functionality
const resetAllQueryRefs = () => {
  utils.updateUrl(new URLSearchParams())

  utils.getActiveRefs().forEach(([param, setter]) => {
    const initialValue = utils.getInitialValue(param)
    if (setter && initialValue !== undefined) {
      setter(initialValue)
    }
  })
}

export const useQueryRef = useQueryRefHook
export const resetAll = resetAllQueryRefs
