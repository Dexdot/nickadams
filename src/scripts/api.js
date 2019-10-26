const contentful = require('contentful')

// Get keys
const space = process.env.VUE_APP_SPACE_ID
const accessToken = process.env.VUE_APP_ACCESS_TOKEN

// Client instance
const client = contentful.createClient({ accessToken, space })

const handleCases = fields => {
  const cases = []

  fields.list.forEach(v => {
    const proj = { ...v.fields }

    // Set content type
    proj.covers.forEach(cover => {
      cover.fields.type = cover.fields.file.contentType.split('/')[0]
    })

    cases.push(proj)
  })

  return cases
}

export const fetchCases = ctx => {
  client.getEntries({ include: 2 }).then(response => {
    response.items.forEach(v => {
      // Cases BLACK
      if (v.fields.name === 'black') {
        const cases = handleCases(v.fields)
        ctx.$store.dispatch('setCases', { black: true, cases })
      }
      // Cases MAIN
      if (v.fields.name === 'main') {
        const cases = handleCases(v.fields)
        ctx.$store.dispatch('setCases', { black: false, cases })
      }
    })
  })
}

export const fetchCase = slug =>
  new Promise(resolve => {
    // Get black
    client
      .getEntries({
        content_type: 'case',
        'fields.slug': slug
      })
      .then(({ items }) => {
        resolve(items[0] ? items[0].fields : null)
      })
  })

export const fetchVision = () =>
  new Promise(resolve => {
    client
      .getEntries({
        content_type: 'vision'
      })
      .then(({ items }) => {
        resolve(items[0] ? items[0].fields : null)
      })
  })

export const fetchInspire = () =>
  new Promise(resolve => {
    // Get inspire
    client
      .getEntries({
        content_type: 'inspireBlock'
      })
      .then(({ items }) => {
        resolve(items)
      })
  })
