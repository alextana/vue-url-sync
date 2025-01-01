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

// URL state management
const resetUrlParam = (param: string): void => {
  const queryParams = utils.getQueryParams()
  if (!queryParams) return

  queryParams.delete(utils.encodeParamName(param))
  utils.updateUrl(queryParams)
}

const useQueryRefHook = <K extends string, T extends JsonValue>(
  param: K,
  initialState?: T
): QueryRefReturn<K, T> => {
  // Initialize
  const encodedParam = utils.encodeParamName(param)
  utils.storeInitialValue(param, initialState)

  // State setup
  const queryParams = utils.getQueryParams()
  const state = ref<T>(
    utils.parseQueryParam(queryParams?.get(encodedParam), initialState)
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

      const serializedValue = utils.serializeParam(newValue)
      serializedValue
        ? queryParams.set(encodedParam, serializedValue)
        : queryParams.delete(encodedParam)

      utils.updateUrl(queryParams)
    },
  })

  return {
    [param]: trackedValue,
    reset: () => {
      resetUrlParam(param)
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
