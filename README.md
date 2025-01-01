# Vue url sync

Keep your Vue state automatically synchronized with URL parameters. No extra configuration needed - just use your reactive refs and let them sync with the URL automatically.

```ts
const { count } = useQueryRef('count', 0)

// When count changes:
count.value++ // URL updates to ?q=MQ==
count.value = 5 // URL updates to ?q=NQ==

// When URL changes:
// User visits ?q=MTA=
console.log(count.value) // outputs: 10
```

Your state is always in sync with the URL, making it perfect for:

- Sharing application state via URLs
- Maintaining state between page refreshes
- Building sharable filtered views
- Persisting form state

## Installation

```bash
npm install vue-url-sync
bun install vue-url-sync
yarn add vue-url-sync
```

## Usage

```typescript
import { useQueryRef, resetAll } from 'vue-url-sync'

// Basic usage
const { count } = useQueryRef('count', 0)

// With reset functionality
const { value, reset } = useQueryRef('value', 'initial')

// Complex objects
const { settings } = useQueryRef('settings', { theme: 'dark' })

// Reset all query parameters
resetAll()
```

## Features

- 🔄 Bidirectional sync between state and URL
- 🔐 Automatic parameter obfuscation
- 📦 SSR compatible
- 🎯 Type-safe
- 🧹 Automatic cleanup
- 🔍 URL parameter compression

## Parameter Obfuscation

By default, URL parameters are automatically obfuscated to keep your URLs clean and compact. For example:

```typescript
const { settings } = useQueryRef('settings', { theme: 'dark', fontSize: 14 })
```

Instead of having a URL like:

```
https://your-site.com?settings={"theme":"dark","fontSize":14}
```

The parameters are compressed and encoded to:

```
https://your-site.com?q=eyJ0IjoiZCIsImYiOjE0fQ
```

This helps:

- Keep URLs shorter and cleaner
- Reduce URL parameter size
- Maintain privacy by not exposing clear parameter names
- Prevent URL parameter tampering

The obfuscation is automatically reversed when reading parameters, so you always work with the original values in your code.

## SSR Compatibility

The composable is designed to work seamlessly in both client and server environments:

```typescript
import { useQueryRef } from 'vue-url-sync'

// Works on both server and client
const { count } = useQueryRef('count', 0)
```

### How it works:

- **Server Side**: During SSR, the composable reads URL parameters from the request URL, ensuring the initial state matches the URL without hydration mismatches
- **Client Side**: After hydration, it switches to using the browser's history API for real-time URL updates
- **No-JS Fallback**: Even without JavaScript, URLs remain functional as regular query parameters
- **Hydration Safe**: Prevents hydration warnings by ensuring server and client states match

This makes it ideal for:

- Server-rendered Vue applications (Nuxt, Vite SSR)
- Static Site Generation (SSG)
- Progressive enhancement scenarios

## License

MIT

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
