import { CONTENT_TYPES } from "@/constants/types"

// 基础实体接口
interface BaseEntity {
  id: number
  type: CONTENT_TYPES
  path: string
  references?: {
    characters?: number[] | CharacterReference[]
    documents?: number[]
    gallerys?: number[]
    ebooks?: number[]
  }
}

// 角色关系引用
interface CharacterReference {
  id: number
  label: string
  edgeType: number
}

// 角色实体
interface Character extends BaseEntity {
  type: CONTENT_TYPES.CHARACTER
  name: string
  realm: number
  race: number
  background: number
  referencedBy?: {
    characters?: CharacterReference[]
    documents?: number[]
    gallerys?: number[]
    ebooks?: number[]
  }
}

// 文档实体
interface Document extends BaseEntity {
  type: CONTENT_TYPES.DOCUMENT
  title: string
  tags: string[]
}

// 画廊实体
interface Gallery extends BaseEntity {
  type: CONTENT_TYPES.GALLERY
  tags: string[]
  finishedDate: string
  version: number
}

// 电子书实体
interface Ebook extends BaseEntity {
  type: CONTENT_TYPES.EBOOK
//   folderPath: string
  tags: string[]
  finishedDate: string
  version: number
}

// 导出类型
export type {
  BaseEntity,
  CharacterReference,
  Character,
  Document,
  Gallery,
  Ebook
}

// 声明常量的类型
export type Characters = Character[]
export type Documents = Document[]
export type Gallerys = Gallery[]
export type Ebooks = Ebook[] 