<template>
  <main class="u-ovxh">
    <article
      class="case"
      v-if="project"
    >
      <h1 class="case__title t-h3">{{ project.title }}</h1>
      <p>{{ project.subtitle }}</p>

      <img
        class="case__cover"
        :src="project.cover.fields.file.url"
        :alt="project.cover.fields.title"
      >

      <ul class="case__team">
        <li
          v-for="(item, i) in project.team"
          :key="i + project.slug"
        >{{ item }}</li>
      </ul>

      <ul class="case__content">
        <li
          v-for="(item, i) in content"
          :key="i+item.nodeType"
        >
          <p
            v-if="isText(item)"
            v-html="render(item)"
          ></p>

          <img
            class="case__img"
            v-if="isImage(item)"
            :src="item.data.target.fields.file.url"
            :alt="item.data.target.fields.title"
          >

          <CaseBox
            v-if="isBox(item)"
            :content="item.data.target.fields"
          />

          <CaseRow
            v-if="isRow(item)"
            :content="item.data.target.fields"
          />
        </li>
      </ul>
    </article>
  </main>
</template>

<script>
import CaseRow from "@/CaseRow";
import CaseBox from "@/CaseBox";

import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
const contentful = require("contentful");

export default {
  name: "Case",
  components: {
    CaseRow,
    CaseBox
  },
  data: () => ({
    project: null,
    content: null
  }),
  created() {
    // Get keys
    const { space, accessToken } = this.$store.getters;

    // Client instance
    const client = contentful.createClient({ accessToken, space });

    // Get case by slug
    client
      .getEntries({
        content_type: "case",
        "fields.slug": this.$route.params.id
      })
      .then(({ items }) => {
        this.project = items[0] ? items[0].fields : null;
        this.content = this.project.content.content;
        // this.content.forEach(el => {
        //   if (el.nodeType === "embedded-entry-block") {
        //     console.log({ ...el.data.target.sys.contentType.sys });
        //   }
        // });
      });
  },
  methods: {
    render: item => documentToHtmlString(item),
    isText: item => item.nodeType === "paragraph",
    isImage: item => item.nodeType === "embedded-asset-block",
    isRow: item =>
      item.nodeType === "embedded-entry-block" &&
      item.data.target.sys.contentType.sys.id === "row",
    isBox: item =>
      item.nodeType === "embedded-entry-block" &&
      item.data.target.sys.contentType.sys.id === "box"
  }
};
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

// Cover
.case__cover
  margin: 6.3% 0

// Images
.case__cover,
.case__img
  display: block
  width: 100vw
  margin-left: calc(-1 * #{mix(2)} - #{var(--unit)})
  height: auto
</style>
