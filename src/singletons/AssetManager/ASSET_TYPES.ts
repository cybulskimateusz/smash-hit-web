import * as THREE from 'three';

export interface TextureMaps { 
    map: THREE.Texture | null;
    displacementMap: THREE.Texture | null;
    roughnessMap: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    metalnessMap: THREE.Texture | null;
}

export type TextureMapsName = 'metal_plate'

export type TextureMapsRegistry = Map<TextureMapsName, TextureMaps>