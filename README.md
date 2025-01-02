# use-query-ref

Sync your Vue state with URL query parameters automatically. When your state changes, the URL updates. When the URL changes, your state updates.

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

### Basic Counter Example

```vue
<script setup>
import { useQueryRef } from 'use-query-ref'

// Initialize with default value 0
const { count } = useQueryRef('count', 0)
</script>

<template>
  <button @click="count++">Increment</button>
  <div>Count: {{ count }}</div>
</template>
```

When you click the button:

- State updates: `count = 1`
- URL automatically updates: `?count=1`
- Refresh the page, count stays at 1!

### Complex Objects

```vue
<script setup>
import { useQueryRef } from 'use-query-ref'

const { filters } = useQueryRef('filters', {
  category: 'books',
  minPrice: 10,
  inStock: true,
})
</script>

<template>
  <div>
    <select v-model="filters.category">
      <option value="books">Books</option>
      <option value="electronics">Electronics</option>
    </select>
    <input type="number" v-model="filters.minPrice" />
    <input type="checkbox" v-model="filters.inStock" />
  </div>
</template>
```

As you change filters:

- URL updates: `?filters=eyJjYXRlZ29yeSI6ImVsZWN0cm9uaWNzIiwibWluUHJpY2UiOjIwLCJpblN0b2NrIjp0cnVlfQ`
- Share this URL, and users get the exact same filters!

### Disable Obfuscation

```vue
const { value } = useQueryRef('search', '', { obfuscate: false })
```

Now the URL stays human-readable:

- Type "hello": URL becomes `?search=hello`
- Type "world": URL becomes `?search=world`

### Reset Functionality

```vue
const { filters, reset } = useQueryRef('filters', { sort: 'asc', page: 1 }) //
Reset individual state reset() // URL returns to default:
?filters=eyJzb3J0IjoiYXNjIiwicGFnZSI6MX0 // Reset all query parameters import {
resetAll } from 'use-query-ref' resetAll() // Clears all parameters from URL
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
