class Entity {
  private static nextId = 0;
  public readonly id: number;
  private components = new Map<EntityComponentType<unknown>, unknown>();

  constructor() {
    this.id = Entity.nextId++;
  }

  add<T extends object>(component: T): this {
    this.components.set(component.constructor as EntityComponentType<T>, component);
    return this;
  }

  get<T>(type: EntityComponentType<T>): T | undefined {
    return this.components.get(type) as T;
  }

  has<T>(type: EntityComponentType<T>): boolean {
    return this.components.has(type);
  }

  remove<T>(type: EntityComponentType<T>): void {
    this.components.delete(type);
  }
}

export default Entity;