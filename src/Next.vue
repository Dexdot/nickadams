<template>
  <section :class="['next', { light: isLight }]">
    <div class="next-container">
      <router-link :to="to">
        <h2 class="t-h2">
          <slot name="title"></slot>
        </h2>
      </router-link>
      <p><slot name="text"></slot></p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Next',
  props: {
    to: { type: String, default: '/' },
    isLight: { type: Boolean, default: false }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.next
  background: #000
  color: #fff

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: #fff !important

.next.light
  color: var(--color-text-lt)
  background: var(--color-bg-lt)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-lt) !important


.next
  width: 100vw
  height: 100vh
  padding-right: mix(1, 1)

  display: flex
  flex-direction: column
  justify-content: center
  align-items: flex-end

  text-align: right

  @media (max-width: 500px)
    padding-right: var(--unit)

.next-container h2
  display: block
  margin-bottom: 8px

  @media (max-width: 500px)
    font-size: 36px

  @media (max-width: 360px)
    font-size: 30px

.next-container p
  margin-left: auto
  max-width: 29em
  opacity: 0.4

  @media (max-width: 500px)
    max-width: 70%
</style>
