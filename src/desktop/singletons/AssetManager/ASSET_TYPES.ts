import * as THREE from 'three';

export interface TextureMaps { 
    emissiveMap: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    map?: THREE.Texture | null;
    displacementMap?: THREE.Texture | null;
    roughnessMap?: THREE.Texture | null;
    metalnessMap?: THREE.Texture | null;
}

export type TextureMapsName = 'walls_texture'

export type TextureMapsRegistry = Map<TextureMapsName, TextureMaps>