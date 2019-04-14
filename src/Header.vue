<template>
  <header class="header">
    <div class="container u-flex u-aic u-jcsb">
      <router-link class="t-ttu" to="/">Nick Adams</router-link>
      <button class="menu-btn">
        <span class="menu-btn__circle"></span>
        <span class="menu-btn__circle"></span>
        <span class="menu-btn__circle"></span>
        <span class="menu-btn__circle"></span>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="sass" scoped>
.header
  position: fixed
  top: 6%
  left: 0

  width: 100%

.menu-btn
  display: flex
  flex-wrap: wrap

  width: 16px
  margin-left: -4px
  margin-top: -4px

.menu-btn__circle
  background: var(--color-1)
  border-radius: 50%

  width: 4px
  height: 4px
  margin-left: 4px
  margin-top: 4px
</style>
