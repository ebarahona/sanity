import {
  DEFAULT_SUPPORTED_STYLES,
  DEFAULT_SUPPORTED_DECORATORS,
  DEFAULT_SUPPORTED_ANNOTATIONS
} from '../constants'


function resolveEnabledStyles(blockType) {
  const styleField = blockType.fields.find(btField => btField.name === 'style')
  if (!styleField) {
    throw new Error("A field with name 'style' is not defined in the block type (required).")
  }
  const textStyles = styleField.type.options.list
    && styleField.type.options.list.filter(style => style.value)
  if (!textStyles || textStyles.length === 0) {
    throw new Error('The style fields need at least one style '
      + "defined. I.e: {title: 'Normal', value: 'normal'}.")
  }
  return textStyles
}

function resolveEnabledAnnotationTypes(spanType) {
  return spanType.annotations.map(annotation => {
    return {
      title: annotation.title,
      value: annotation.name
    }
  })
}

function resolveEnabledDecorators(spanType) {
  return spanType.decorators
}

export default function blockContentTypeToOptions(blockContentType) {
  if (!blockContentType) {
    throw new Error("Parameter 'blockContentType' required")
  }
  const blockType = blockContentType.of.find(field => field.name === 'block')
  if (!blockType) {
    throw new Error("'block' type is not defined in this schema (required).")
  }
  const spanType = blockType.fields.find(field => field.name === 'spans')
    .type.of.find(ofType => ofType.name === 'span')
  return {
    styles: resolveEnabledStyles(blockType),
    decorators: resolveEnabledDecorators(spanType),
    annotations: resolveEnabledAnnotationTypes(spanType)
  }
}
