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
    events?: number[]
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
    events?: number[]
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

// 事件实体
interface Event extends BaseEntity {
  type: CONTENT_TYPES.EVENT
  title: string
  tags: string[]
}

// 导出类型
export type {
  BaseEntity,
  CharacterReference,
  Character,
  Document,
  Gallery,
  Ebook,
  Event
}

// 声明常量的类型
export type Characters = Character[]
export type Documents = Document[]
export type Gallerys = Gallery[]
export type Ebooks = Ebook[]
export type Events = Event[]

// 标准实体类型（不包括Character）
export type StandardEntityType = Document | Gallery | Ebook | Event

// 实体关系图
export interface EntityGraph {
  // key 是实体类型_id, 如documents_1
  [key: string]: {
    entity: StandardEntityType
    references: {
      // key 是实体类型，值是相关实体的 id 数组
      [type: string]: number[]
    }
  }
} 