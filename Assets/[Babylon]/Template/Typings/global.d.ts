declare global {
  interface Window {
    ///////////////////////////////////////
    // Babylon Scene Loader Window Hooks //
    ///////////////////////////////////////
    state: any
    scene: any
    // @ts-ignore
    loadScene: (sceneFile: string, queryString: string = null) => void
    // @ts-ignore
    updateStatus: (status: string, details: string, state: number) => void
    // @ts-ignore
    updateProgress: (progress: number) => void
    // @ts-ignore
    showGameLoading: (show:boolean, duration:number) => void
    // @ts-ignore
    loadSceneComplete: () => void
    // @ts-ignore
    socketConnect:(connection:string) => any
  }
} export {}
