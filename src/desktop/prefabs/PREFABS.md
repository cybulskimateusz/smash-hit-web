# Prefabs

Factory functions that create pre-configured entities.

Each prefab assembles an entity with the right set of components and initial values.

- `/entities` contains functions to create and return `Entity`
- `/decorators` cotains side effects, items that don't need to be a part of ECS, eg. children of another ThreeJS.Object3D - if the object will be removed, children will be removed too.
