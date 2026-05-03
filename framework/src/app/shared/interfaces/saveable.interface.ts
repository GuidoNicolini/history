export interface ISaveable {
  saveKey: string;
  exportState(): any;
  importState(state: any): void;
}
