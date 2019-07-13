<template>
  <main class="u-ovxh">
    <article class="case" v-if="project">
      <h1 class="case__title t-h3">{{ project.title }}</h1>
      <p>{{ project.subtitle }}</p>

      <img
        class="case__img"
        :src="project.cover.fields.file.url"
        :alt="project.cover.fields.title"
      />

      <!-- client role date -->

      <section :style="[{ 'min-height': `${asideHeight}px` }]">
        <aside ref="aside">
          <b>Client</b>
          <p>{{ project.client }}</p>
          <b>Role</b>
          <p>{{ project.role }}</p>
          <b>Date</b>
          <p>{{ project.date }}</p>
          <template v-if="project.awards">
            <b>Awards</b>
            <p>{{ awards }}</p>
          </template>
        </aside>

        <ul class="case__content">
          <li
            v-for="(item, i) in content"
            :key="i + item.nodeType"
            :class="{
              case__text: isText(item),
              case__box: isBox(item),
              case__row: isRow(item)
            }"
          >
            <p v-if="isText(item)" v-html="render(item)"></p>

            <img
              class="case__img"
              v-if="isImage(item)"
              :src="item.data.target.fields.file.url"
              :alt="item.data.target.fields.title"
            />

            <CaseBox
              v-if="isBox(item)"
              :content="item.data.target.fields"
              :color="boxColor"
            />

            <CaseRow
              v-if="isRow(item)"
              :content="item.data.target.fields"
              :color="boxColor"
            />
          </li>
        </ul>
      </section>

      <ul class="case__footer">
        <li class="u-flex">
          <div class="case__footer-col">
            <b>Team</b>
          </div>
          <div class="case__footer-col">
            <ul>
              <li v-for="(item, i) in project.team" :key="i + project.slug">
                {{ item }}
              </li>
            </ul>
          </div>
        </li>
        <li class="u-flex">
          <div class="case__footer-col">
            <b>Content</b>
          </div>
          <div class="case__footer-col">
            <ul>
              <li
                v-for="(item, i) in project.contentAuthors"
                :key="i + project.slug"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </li>
        <li class="u-flex">
          <div class="case__footer-col">
            <b>Etalon</b>
          </div>

          <div class="case__footer-col">
            <a :href="`https://${project.etalon}`" target="_blank">
              {{ project.etalon }}
            </a>
          </div>
        </li>
      </ul>
    </article>
  </main>
</template>

<script>
import CaseRow from '@/CaseRow'
import CaseBox from '@/CaseBox'
import loop from '@/scripts/loop'

import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
const contentful = require('contentful')

export default {
  name: 'Case',
  components: {
    CaseRow,
    CaseBox
  },
  data: () => ({
    project: null,
    content: null,
    boxColor: '#DDDDDD',
    asideHeight: 100
  }),
  computed: {
    awards() {
      const result = this.project.awards.reduce((sum, cur, i, arr) => {
        if (i === 1) return `${sum} / ${cur} / `
        if (i === arr.length - 1) return `${sum + cur}`
        return `${sum + cur} / `
      })
      return result
    }
  },
  created() {
    this.fetchCase()
    this.$emit('toggle-dark', false)
  },
  destroyed() {
    loop.remove(this.setAsideHeight.bind(this), 'setAsideHeight')
  },
  methods: {
    setAsideHeight() {
      if (this.$refs.aside) this.asideHeight = this.$refs.aside.offsetHeight
    },
    fetchCase() {
      // Get keys
      const { space, accessToken } = this.$store.getters

      // Client instance
      const client = contentful.createClient({ accessToken, space })

      // Get case by slug
      client
        .getEntries({
          content_type: 'case',
          'fields.slug': this.$route.params.id
        })
        .then(({ items }) => {
          // Project data
          this.project = items[0] ? items[0].fields : null

          // Rich content
          this.content = this.project.content.content

          // Box color
          if (this.project.boxColor) this.boxColor = this.project.boxColor

          loop.add(this.setAsideHeight.bind(this), 'setAsideHeight')
        })
    },
    render: item => documentToHtmlString(item),
    isText: item => item.nodeType === 'paragraph',
    isImage: item => item.nodeType === 'embedded-asset-block',
    isRow: item =>
      item.nodeType === 'embedded-entry-block' &&
      item.data.target.sys.contentType.sys.id === 'row',
    isBox: item =>
      item.nodeType === 'embedded-entry-block' &&
      item.data.target.sys.contentType.sys.id === 'box'
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

// Case
.case
  font-size: 18px
  line-height: 1.6

  margin-left: auto
  margin-right: auto
  width: column-spans(8)
  padding-top: 11.5%
  padding-bottom: 10.5%

  @media (max-width: 900px)
    width: column-spans(10)

  @media (max-width: 700px)
    width: 100%
    padding-left: var(--unit)
    padding-right: var(--unit)

    background: #fff
    padding-top: 33%
    padding-bottom: 35.8%

// Title
.case__title
  line-height: 1
  margin-bottom: 0.65em

// Team list
.case__team
  float: left

// Content
.case >
  h1, p
    width: column-spans(4)
    margin-left: column-spans(4)

    @media (max-width: 900px)
      width: column-spans(5)
      margin-left: column-spans(5)

    @media (max-width: 700px)
      margin-left: 0
      width: 100%

.case__content > li >
  h2, h3,
  ul, ol,
  a, p
    width: column-spans(4)
    margin-left: column-spans(4)

    @media (max-width: 900px)
      width: column-spans(5)
      margin-left: column-spans(5)

    @media (max-width: 700px)
      margin-left: 0
      width: 100%

.case__content /deep/ a > b
  position: relative

.case__content /deep/ a > b::before
  content: ''
  position: absolute
  bottom: -4px
  left: 0

  width: 100%
  height: 1px

  background: var(--color-text-lt)
  transform-origin: 100% 50%
  transition: $trs

.case__content /deep/ a:hover > b::before
  transform: scaleX(0)

.case__content /deep/ a
  &,
  &:visited,
  &:active,
  &:focus
    color: var(--color-text-lt)

.case__text + .case__box,
.case__text + .case__row
  margin-top: 8.3%

// Paragraph
.case p
  margin-bottom: 24px

// Images
.case__img
  display: block
  width: 100vw
  height: auto
  // margin: 6.3% 0 6.3% calc(-1 * #{mix(2)} - #{var(--unit)})
  margin: 10.4% 0 10.4% calc(-1 * #{mix(2)} - #{var(--unit)})

  @media (max-width: 900px)
    margin: 48px 0 48px calc(-1 * #{mix(1)} - #{var(--unit)})

  @media (max-width: 700px)
    object-fit: cover
    height: 100vh
    height: calc(var(--vh, 1vh) * 100)
    margin: 48px 0 48px calc(-1 * #{var(--unit)})

// Footer
.case__footer
  padding-top: 4%

.case__footer > li
  min-height: 7em
  padding-top: 1.8em
  padding-bottom: 1.4em

  position: relative

.case__footer > li::before
  content: ''
  position: absolute
  bottom: 0
  left: 0

  width: 100%
  height: 1px
  background: var(--color-text-lt)
  opacity: 0.1

.case__footer-col:first-child
  margin-right: gutters(1)

  @media (max-width: 900px)
    margin-right: 16px

  @media (max-width: 700px)
    margin-right: 0

.case__footer-col
  width: column-spans(4)

  @media (max-width: 900px)
    width: column-spans(5)

.case__footer-col:first-child
  @media (max-width: 700px)
    width: column-spans(3)

.case__footer-col:last-child
  @media (max-width: 700px)
    padding-left: 56px
    width: column-spans(9)
  @media (max-width: 360px)
    padding-left: 40px

.case__footer-col b
  +tt(m)


// Aside
aside
  max-width: 11em
  float: left

  @media (max-width: 900px)
    margin-bottom: 80px
    max-width: 80%
    float: unset

.case aside p
  margin-bottom: 32px
</style>
