export type Operator = 'plus' | 'minus';
export type EffectType = 'hero-stat' | 'npc-stat' | 'item' | 'relation' | 'hour' | 'minute' | 'energy';

export interface EventoEffect {

  type: EffectType; // ¿Qué vamos a evaluar?
  target: string;      // ¿Cuál bandera, estadística o ítem?
  operator: Operator;  // ¿Cómo lo comparamos?
  value: any;          // ¿Contra qué valor?
}
