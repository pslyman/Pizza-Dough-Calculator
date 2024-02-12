export interface recipeType {
  approach: string;
  thicknessFactor: number | null;

  doughWeight: number | null;
  numberOfBalls: number | null;
  shape: string;
  pizzaSize: number | null;

  panWidth: number | null;
  panLength: number | null;

  pizzaSizeTop: number | null;
  panWidthTop: number | null;
  panLengthTop: number | null;
  panHeight: number | null;

  deepDish: boolean;
  doughHeight: number | null;
  yeast: string;
  yeastAmount: number | null;

  stuffed: boolean;
  hydration: number | null;

  salt: string;
  saltAmount: number | null;
  residueAmount: number | null;

  preferment: string;
  prefermentAmount: number | null;
  prefermentWaterAmount: number | null;
  prefermentYeastAmount: number | null;
  prefermentFlourAmount: number | null;

  slopedSides: boolean;

  stuffedAmount: number | null;
  title: string;
  notes: string;

  useMetric: boolean;

  flourId: number;
  flours: splitIngredientConfig[];
  floursAsJSON: string;

  waterId: number;
  waters: splitIngredientConfig[];
  watersAsJSON: string;

  addedIngredient: addedIngredientsType[];

  isLoaded?: boolean;
  sortId?: number;

  // for backward compatability
  isTemporary?: boolean;

  // for forward compatability
  nutritionSlices?: number;
}

export interface splitIngredientConfig {
  id: number;
  name: string;
  percent: number;
  isPreferment: boolean;
}

export interface addedIngredientsType {
  value: string;
  description: string;
  ratio: number;
  key: string;
  note: string | null;
  dropsInTsp: number | null;
  amount: number | null;
}

export interface tableConfigType {
  precision: number;
  precisionString: string;
  show: tableConfigShownOptions;
}

export interface tableConfigShownOptions {
  cups: boolean;
  drops: boolean;
  grams: boolean;
  kilograms: boolean;
  milliliters: boolean;
  notes: boolean;
  ounces: boolean;
  pounds: boolean;
  tablespoons: boolean;
  teaspoons: boolean;
  title: boolean;
}
