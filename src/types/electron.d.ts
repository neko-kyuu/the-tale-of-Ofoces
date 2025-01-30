interface ElectronAPI {
  saveFile: (data: { filePath: string, content: string }) => Promise<{ success: boolean, error?: string }>;
  readJsonFile: (filePath: string) => Promise<{ success: boolean, data?: any, error?: string }>;
  updateCharacter: (data: { 
    filePath: string, 
    characterId: number, 
    value: any
  }) => Promise<{ success: boolean, error?: string }>;
  test: () => void;
}

interface Window {
  electronAPI: ElectronAPI;
} 