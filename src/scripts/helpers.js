export const isImage = ({ fields }) =>
  fields.file.contentType.split('/')[0] === 'image'

export const isVideo = ({ fields }) =>
  fields.file.contentType.split('/')[0] === 'video'
