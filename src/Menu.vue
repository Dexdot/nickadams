<template>
  <transition name="menu">
    <section class="menu" v-show="active">
      <div class="menu__overlay"></div>

      <nav class="menu__nav">
        <ul>
          <li><router-link class="t-h2" to="/">Index</router-link></li>
          <li><router-link class="t-h2" to="/about">About</router-link></li>
          <li><router-link class="t-h2" to="/vision">Vision</router-link></li>
          <li><router-link class="t-h2" to="/">Black</router-link></li>
        </ul>
      </nav>
    </section>
  </transition>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

/* ENTER */
.menu-enter
  pointer-events: none

  .menu__nav li
    opacity: 0
    transform: translateY(16px)

  .menu__overlay
    transform: translateY(101%)


.menu-enter-to
  pointer-events: auto

  .menu__overlay,
  .menu__nav li
    opacity: 1
    transform: translateY(0%)


.menu-enter-active
  transition: 1s ease-in-out

  .menu__overlay
    transition: 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)

@for $i from 1 through 6
  .menu-enter-active .menu__nav li:nth-child(#{$i})
    transition: 0.4s ease (#{$i*0.05s + 0.4s})


/* LEAVE */
.menu-leave
  pointer-events: auto

  .menu__nav li
    opacity: 1

  .menu__overlay,
  .menu__nav li
    transform: translateY(0%)

.menu-leave-to
  pointer-events: none

  .menu__nav li
    opacity: 0

  .menu__overlay
    transform: translateY(101%)

.menu-leave-active
  transition: 1s ease-in-out

  .menu__overlay
    transition: 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)

@for $i from 1 through 6
  .menu-leave-active .menu__nav li:nth-child(#{$i})
    transition: 0.4s ease (#{$i*0.05s})

.menu
  z-index: 1
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0

  width: 100vw
  height: 100vh


// Overlay
.menu__overlay
  background: #000
  position: absolute
  top: 0
  left: 0
  width: 100vw
  height: 100vh

.menu__nav
  z-index: 1
  position: absolute
  top: 50%
  right: calc(#{var(--unit)} + #{mix(1)})
  transform: translateY(-50%)

  text-align: right

.page .menu__nav /deep/ a
  &,
  &:visited,
  &:active,
  &:focus
    color: #fff
</style>
