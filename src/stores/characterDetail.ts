import { defineStore } from 'pinia'

interface FileContent {
  type: string
  id: string
  title: string
  path?: string
  displayType?: string
  referenceId?: string
}

export const useCharacterDetailStore = defineStore('characterDetail', {
  state: () => ({
    currentChar: null as any | null,
    currentFile: null as FileContent | null,
    currentContentType: null as string | null,
  }),
  
  actions: {
    showCharacter(char) {
      this.currentChar = char
    },
    
    hideCharacter() {
      this.currentChar = null
      this.currentFile = null
      this.currentContentType = null
    },
    
    showFile(file: FileContent) {
      console.log('showFile', file)
      this.currentFile = file
      this.currentContentType = file.displayType ?? file.type
    },
    
    closeFile() {
      this.currentFile = null
      this.currentContentType = null
    }
  }
})