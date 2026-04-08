export type Operator = '==' | '>' | '<' | '>=' | '<=' | '!=' | 'between';
export type ConditionType = 'flag' | 'stat-hero' | 'item' | 'time' | 'day' | 'stat-npc' | 'cd';

export interface GameCondition {
  type: ConditionType; // ¿Qué vamos a evaluar?
  target: string;      // ¿Cuál bandera, estadística o ítem?
  operator: Operator;  // ¿Cómo lo comparamos?
  value: any;          // ¿Contra qué valor?
}
