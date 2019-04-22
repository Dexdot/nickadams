<template>
  <div>
    <ul class="case-row u-flex">
      <li v-for="img in content.images" :key="img.fields.file.url">
        <div
          class="case-box"
          v-if="content.box"
          :style="{ backgroundColor: color }"
        >
          <img :src="img.fields.file.url" :alt="img.fields.title" />
        </div>

        <img v-else :src="img.fields.file.url" :alt="img.fields.title" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CaseRow',
  props: {
    content: Object,
    color: String
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.case-row
  margin-left: calc(#{gutters(1)} * -1)
  margin-bottom: gutters(1)

  @media (max-width: 900px)
    margin-left: -16px

  @media (max-width: 700px)
    width: 100vw
    flex-direction: column
    margin-left: calc(-1 * var(--unit))

.case-row li
  margin-left: gutters(1)

  @media (max-width: 900px)
    margin-left: 16px
.case-row li
  @media (max-width: 700px)
    margin-left: 0

.case-row li:not(:last-child)
  @media (max-width: 700px)
    margin-bottom: 16px

.case-box
  padding: 10.4% 12.7%

  @media (max-width: 700px)
    padding: 12.9% var(--unit)

.case-box img
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.15)

img
  display: block
  max-width: 100%
  height: auto
</style>
