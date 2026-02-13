abstract class View {
  protected abstract _view: HTMLElement;
  public get view() { return this._view; }

  static createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attributes: Partial<HTMLElementTagNameMap[K]>,
  ): HTMLElementTagNameMap[K] {
    return Object.assign(document.createElement(tag), attributes);
  }
}

export default View;