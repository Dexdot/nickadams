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

      <ul class="case__content">
        <li v-for="(item, i) in content" :key="i + item.nodeType">
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
    boxColor: '#DDDDDD'
  }),
  created() {
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
      })
  },
  methods: {
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

.case__content > li >
  h2, h3,
  ul, ol,
  a, p
    width: column-spans(4)
    margin-left: column-spans(4)

// Paragraph
.case p
  margin-bottom: 24px

// Images
.case__img
  display: block
  width: 100vw
  height: auto
  margin: 6.3% 0 6.3% calc(-1 * #{mix(2)} - #{var(--unit)})

// Footer
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
  background: var(--color-1)
  opacity: 0.1

.case__footer-col:first-child
  margin-right: gutters(1)

.case__footer-col
  width: column-spans(4)

.case__footer-col b
  +tt(m)
</style>
