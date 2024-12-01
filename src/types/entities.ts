import { CONTENT_TYPES } from "@/constants/types"

// 基础实体接口
interface BaseEntity {
  id: number
  type: CONTENT_TYPES
  path: string, //如果没有static资源则置空
  references?: {
    characters?: number[] | CharacterReference[]
    documents?: number[]
    gallerys?: number[]
    ebooks?: number[]
    events?: number[]
    locations?: number[]
    medias?: number[]
    notes?: number[]
    locationPoints?: number[]
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
}

// 位置点坐标
// interface LocationPointXY {
//   name: string
//   description: string
//   coordinates: [number, number]
// }

// 地图实体
interface Location extends BaseEntity {
    type: CONTENT_TYPES.LOCATION
    title: string
    description: string
    finishedDate: string
    // locations: LocationPointXY[]
}

// 位置点实体
interface LocationPoint extends BaseEntity {
  type: CONTENT_TYPES.LOCATION_POINT
  pointType: 'city' | 'academy' | 'mansion' | 'other'
  title: string
  description: string
  coordinates: [number, number]
  parentId: number // 所属地图的id
}

// 音媒实体
interface Media extends BaseEntity {
    type: CONTENT_TYPES.MEDIA
    title: string
}

// 备忘录（杂项）实体
interface Note extends BaseEntity {
    type: CONTENT_TYPES.NOTE
    title: string
    tags: string[]
    noteType: "document" | "gallery"
    noteCategory: "character" | "settings"

}

// 导出类型
export type {
  BaseEntity,
  CharacterReference,
  Character,
  Document,
  Gallery,
  Ebook,
  Event,
  Location,
  Media,
  Note,
  LocationPoint
}

// 声明常量的类型
export type Characters = Character[]
export type Documents = Document[]
export type Gallerys = Gallery[]
export type Ebooks = Ebook[]
export type Events = Event[]
export type Locations = Location[]
export type Medias = Media[]
export type Notes = Note[]
export type LocationPoints = LocationPoint[]
// 标准实体类型（不包括Character）
export type StandardEntityType = Document | Gallery | Ebook | Event | Location | Media | Note | LocationPoint

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