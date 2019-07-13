<template>
  <header :class="['header', { dark }]">
    <div class="container u-flex u-aic u-jcsb">
      <router-link class="t-ttu" to="/">Nick Adams</router-link>
      <button
        :class="['menu-btn', { active: isHeaderActive }]"
        @click="$emit('menu-btn-click')"
      >
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
  name: 'Header',
  props: {
    dark: { type: Boolean, default: false },
    isHeaderActive: { type: Boolean, default: false }
  }
}
</script>

<style lang="sass" scoped>
.header
  z-index: 2
  position: fixed
  top: 6%
  left: 0

  width: 100vw

  @media (max-width: 500px)
    top: 32px

.menu-btn
  display: flex
  flex-wrap: wrap

  width: 16px
  margin-left: -4px
  margin-top: -4px

  transition: transform 0.25s ease-in-out, opacity 0.25s ease
  transform-origin: 50% 50%

.menu-btn:hover
  opacity: 0.3

.menu-btn.active
  transform: rotate(45deg)

.menu-btn__circle
  background: var(--color-text-lt)
  border-radius: 50%

  width: 4px
  height: 4px
  margin-left: 4px
  margin-top: 4px

.page .dark
  color: var(--color-text-dk)

  .menu-btn__circle
    background: var(--color-text-dk)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-dk)
</style>
