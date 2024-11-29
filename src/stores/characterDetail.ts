import { defineStore } from 'pinia'

export const useCharacterDetailStore = defineStore('characterDetail', {
  state: () => ({
    currentChar: null as any | null,
    currentFile: null as any | null,
  }),
  
  actions: {
    showCharacter(char) {
      this.currentChar = char
    },
    
    hideCharacter() {
      this.currentChar = null
      this.currentFile = null
    },
    
    showFile(file: any) {
      this.currentFile = file
    },
    
    closeFile() {
      this.currentFile = null
    }
  }
})