<template>
  <section class="next">
    <router-link :to="to">
      <h2 class="t-h2">
        <slot name="title"></slot>
      </h2>
    </router-link>
    <p><slot name="text"></slot></p>
  </section>
</template>

<script>
export default {
  name: 'Next',
  props: {
    to: { type: String, default: '/' }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.next
  background: #000
  color: #fff

  width: 100vw
  height: 100vh
  padding-right: mix(1, 1)

  display: flex
  flex-direction: column
  justify-content: center
  align-items: flex-end

  text-align: right
</style>
