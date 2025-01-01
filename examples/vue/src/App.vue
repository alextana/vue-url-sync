<script setup lang="ts">
import { useQueryRef, resetAll } from '../../../packages/useQueryRef'

const { count, reset } = useQueryRef('count', 0)
const { test, reset: resetTest } = useQueryRef('test', 'hey!!')
const { someObject } = useQueryRef('someObject', { a: 1 })
</script>

<template>
  <div>hello world {{ count }}</div>
  <button @click="() => count++">Increment {{ count }}</button>
  <button @click="() => reset()">Reset!!</button>
  <hr></hr>
  <div>Test is {{ test }}</div>
  <button @click="() => resetTest()">Reset test!!</button>
  <hr></hr>
  Set an object <button @click="() => someObject = { a: 1, b: 2, c: 3 }">Set object</button>
    {{ someObject }}
  <hr></hr>
  Reset all <button @click="() => resetAll()">Reset all</button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
