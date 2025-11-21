/// <reference types="vite/client" />
/// <reference types="@types/three" />

declare module '*.glb' {
  const content: string
  export default content
}

declare module '*.gltf' {
  const content: string
  export default content
}

declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}
