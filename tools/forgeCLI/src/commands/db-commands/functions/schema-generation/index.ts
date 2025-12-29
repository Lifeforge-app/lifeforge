// Schema generation functions - split for unit testing

export {
  convertFieldToZodSchema,
  generateCollectionSchema,
  stripCollectionIds
} from './field-converter'
export {
  generateMainSchemaContent,
  generateModuleSchemaContent
} from './content-generator'
export { buildModuleCollectionsMap } from './module-mapper'
export { processSchemaGeneration } from './schema-processor'
