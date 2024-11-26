import { defineStore } from 'pinia'
import type { Character } from '@/constants/characters'

export const useCharacterDetailStore = defineStore('characterDetail', {
  state: () => ({
    currentChar: null as Character | null,
    currentFile: null as any | null,
  }),
  
  actions: {
    showCharacter(char: Character) {
      this.currentChar = char
      console.log(this.currentChar)
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