<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from "@/Header";

export default {
  name: "App",
  components: {
    Header
  }
};
</script>

<style lang="sass">
\:root
  --color-1: #1F2020
  --color-2: #EDECED

body
  color: var(--color-1)
  background: var(--color-2)
  transition: background 0.25s ease-in-out

a
  &,
  &:visited,
  &:active,
  &:focus
    color: var(--color-1)
</style>
