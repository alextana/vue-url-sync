# use-query-ref

A lightweight utility for syncing state with URL query parameters in Vue applications.

## Features

- 🔄 Bi-directional sync between state and URL query parameters
- 🔐 Optional base64 parameter obfuscation
- 🎯 Type-safe parameter handling
- 🔍 Automatic parameter name hashing
- 💾 State persistence across page reloads
- ↩️ Individual and global state reset capabilities
- 🌐 Browser and SSR compatible

## Installation

```bash
npm install use-query-ref
```

## Usage

```vue
import { useQueryRef, resetAll } from 'use-query-ref' // Basic counter example
const { count } = useQueryRef('count', 0) // With obfuscation disabled const {
value, reset } = useQueryRef('value', 'initial', { obfuscate: false }) //
Complex objects const { state } = useQueryRef('state', { foo: 'bar' }) // Reset
individual state reset() // Reset all query parameters resetAll()
```

## API

### useQueryRef(key, defaultValue, options?)

- `key`: Parameter name in the URL
- `defaultValue`: Initial value if parameter is not present
- `options`: Configuration object
  - `obfuscate`: Boolean to enable/disable parameter obfuscation (default: true)

### resetAll()

Resets all query parameters to their default values.

## Type Safety

The library includes full TypeScript support and will infer the correct types from your default values.

## License

MIT

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
