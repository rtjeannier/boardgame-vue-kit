/**
 * Draft cards — generic fantasy-flavored set. No game-mechanical
 * complexity; each card has a name, a keyword, a points value, and
 * flavor text. The game picks 20 of these for a 4-player × 5-card
 * draft.
 */

export type Suit = 'sword' | 'shield' | 'bow' | 'potion' | 'crown' | 'coin';

export interface DraftCard {
  id: number;
  name: string;
  suit: Suit;
  points: number;
  keyword: string;
  flavor: string;
}

const SUIT_COLORS: Record<Suit, string> = {
  sword:  '#e74c3c',
  shield: '#3498db',
  bow:    '#27ae60',
  potion: '#9b59b6',
  crown:  '#f1c40f',
  coin:   '#e67e22',
};

export function colorFor(suit: Suit): string {
  return SUIT_COLORS[suit];
}

/** The full deck — 24 cards. A 4-player game draws 20. */
export const DECK: DraftCard[] = [
  { id: 1,  name: 'Ironbrand',   suit: 'sword',  points: 3, keyword: '+1 combat',        flavor: 'Forged by the last smith of the Iron Court.' },
  { id: 2,  name: 'Nightedge',   suit: 'sword',  points: 4, keyword: '+2 combat',        flavor: 'It hums when enemies are near.' },
  { id: 3,  name: 'Rustblade',   suit: 'sword',  points: 2, keyword: '+1 combat',        flavor: 'Dull, but steady.' },
  { id: 4,  name: 'Stormward',   suit: 'shield', points: 3, keyword: '−1 damage taken',  flavor: 'Humming faintly in thunder.' },
  { id: 5,  name: 'Oak Bulwark', suit: 'shield', points: 2, keyword: '−1 damage taken',  flavor: 'Carved from a thousand-year oak.' },
  { id: 6,  name: 'Mirror Wall', suit: 'shield', points: 4, keyword: 'reflect once',     flavor: 'Silver and silent.' },
  { id: 7,  name: 'Longbow',     suit: 'bow',    points: 3, keyword: '+1 ranged',        flavor: 'Strung with ashfall sinew.' },
  { id: 8,  name: 'Moonarc',     suit: 'bow',    points: 4, keyword: '+2 ranged',        flavor: 'Crescent-shaped. Pulls itself taut.' },
  { id: 9,  name: 'Hunter\'s Notch', suit: 'bow', points: 2, keyword: '+1 ranged',       flavor: 'A bow from the Wolfmother\'s hand.' },
  { id: 10, name: 'Blood Vial',  suit: 'potion', points: 2, keyword: 'heal 2',           flavor: 'Do not ask the source.' },
  { id: 11, name: 'Soul Draft',  suit: 'potion', points: 4, keyword: 'revive once',      flavor: 'Brewed at the edge of sleep.' },
  { id: 12, name: 'Moss Tea',    suit: 'potion', points: 1, keyword: 'heal 1',           flavor: 'Bitter, but effective.' },
  { id: 13, name: 'Crown of Ash',suit: 'crown',  points: 5, keyword: 'lead 2 armies',    flavor: 'It weighs more than gold.' },
  { id: 14, name: 'Thorn Diadem',suit: 'crown',  points: 3, keyword: 'lead 1 army',      flavor: 'Draws blood from its wearer.' },
  { id: 15, name: 'Pauper King', suit: 'crown',  points: 2, keyword: 'bonus at 0 gold',  flavor: 'You\'ll thank it on the way down.' },
  { id: 16, name: 'Mint Purse',  suit: 'coin',   points: 2, keyword: '+2 gold',          flavor: 'Never seems to empty.' },
  { id: 17, name: 'Counting House', suit: 'coin',points: 3, keyword: '+3 gold',          flavor: 'Staffed by tired ghosts.' },
  { id: 18, name: 'Lucky Copper',suit: 'coin',   points: 1, keyword: '+1 gold',          flavor: 'Dented on one side.' },
  { id: 19, name: 'Duelist',     suit: 'sword',  points: 3, keyword: '+1 combat',        flavor: 'Chooses their ground.' },
  { id: 20, name: 'Pavise',      suit: 'shield', points: 3, keyword: '−1 damage taken',  flavor: 'Heavy but reassuring.' },
  { id: 21, name: 'Sharpeye',    suit: 'bow',    points: 3, keyword: '+1 ranged',        flavor: 'Counts breath instead of arrows.' },
  { id: 22, name: 'Ebb Philter', suit: 'potion', points: 3, keyword: 'heal 3',           flavor: 'Tastes of salt and sleep.' },
  { id: 23, name: 'Starwrought Tiara', suit: 'crown', points: 4, keyword: 'lead 2 armies', flavor: 'A constellation held still.' },
  { id: 24, name: 'War Chest',   suit: 'coin',   points: 4, keyword: '+4 gold',          flavor: 'Clatters reassuringly.' },
];

/** Shuffle via Fisher-Yates with an optional seed (poor-man's RNG). */
export function shuffled<T>(items: T[], seed = Date.now()): T[] {
  const out = [...items];
  let rng = seed;
  for (let i = out.length - 1; i > 0; i--) {
    rng = (rng * 9301 + 49297) % 233280;
    const j = Math.floor((rng / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
