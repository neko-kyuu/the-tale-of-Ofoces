import { defineStore } from 'pinia'

export const useCharacterStore = defineStore('character', {
  state: () => ({
    characters: []
  }),
  
  actions: {
    addCharacter(character) {
      this.characters.push(character)
    },
    
    updateCharacter(index, updatedCharacter) {
      this.characters[index] = updatedCharacter
    },
    
    deleteCharacter(index) {
      this.characters.splice(index, 1)
    }
  }
}) 