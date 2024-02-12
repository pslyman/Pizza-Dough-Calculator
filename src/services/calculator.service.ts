import { Injectable } from "@angular/core";
import * as _ from "lodash";
import {
  addedIngredientsType,
  recipeType,
} from "../interfaces/recipe.interface";

@Injectable()
export class Calculator {
  isEnoughData: boolean;
  recipeToCalculate: recipeType;

  flour: Conversions;
  water: Conversions;
  salt: Conversions;
  yeast: Conversions;
  total: Conversions;
  ball: Conversions;
  innerBall: Conversions;
  outerBall: Conversions;

  prefermentFlour: Conversions;
  prefermentWater: Conversions;
  prefermentYeast: Conversions;
  prefermentTotal: Conversions;

  totalFlour: Conversions;
  totalWater: Conversions;
  totalYeast: Conversions;

  additions: Conversions[];
  drops: boolean;

  byWeight: boolean;
  thicknessFactor: number;
  isStuffed: boolean;
  isRound: boolean;
  isDeepDish: boolean;
  bottomDiameter: number;
  topDiameter: number;
  panWidth: number;
  panLength: number;
  panWidthTop: number;
  panLengthTop: number;
  panHeight: number;
  doughHeight: number;
  hasSlopedSides: boolean;
  useMetric: boolean;

  doughBalls = 0;
  bowlResidue = 0;
  yeastName = "";
  slices = 4;
  useStoredSlices = false;
  minimalNutritionDisplay = true;

  nutritionFacts = {
    weight: 0,
    calories: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    carbs: 0,
    fiber: 0,
    sugar: 0,
    protein: 0,
  };

  // First number is the serving size in grams
  nutritionDefinitions = {
    template: [
      0, 0 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    flour: [
      30, 110 /*kcal*/, 1 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 22 /*carbs*/, 3 /*fiber*/, 0 /*sugar*/, 4 /*protein*/,
    ],
    salt: [
      1.2, 0 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      480 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Instant Dry Yeast": [
      100, 390 /*kcal*/, 6 /*fat*/, 2 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      75 /*sodium (mg)*/, 33 /*carbs*/, 27 /*fiber*/, 0 /*sugar*/,
      50 /*protein*/,
    ],
    "Active Dry Yeast": [
      0.79378665, 0 /*kcal*/, 0 /*fat*/, 4 /*s-fat*/, 0 /*t-fat*/,
      20 /*chol (mg)*/, 0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/,
      15 /*sugar*/, 0 /*protein*/,
    ],
    "Cake Yeast": [
      100, 105 /*kcal*/, 1.9 /*fat*/, 0.243 /*s-fat*/, 0 /*t-fat*/,
      0 /*chol (mg)*/, 30 /*sodium (mg)*/, 18.1 /*carbs*/, 8.1 /*fiber*/,
      0 /*sugar*/, 8.4 /*protein*/,
    ],
    "Olive Oil": [
      14, 120 /*kcal*/, 14 /*fat*/, 2 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    Sugar: [
      8, 30 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 8 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Diastatic Malt Powder": [
      100, 250 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 100 /*carbs*/, 0 /*fiber*/, 50 /*sugar*/,
      0 /*protein*/,
    ],
    "Baker's Non-Fat Dry Milk": [
      24, 90 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      100 /*sodium (mg)*/, 13 /*carbs*/, 1 /*fiber*/, 11 /*sugar*/,
      8 /*protein*/,
    ],
    "Baking Powder": [
      0.6, 0 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      60 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Baking Soda": [
      0.5669905, 0 /*kcal*/, 0 /*fat*/, 150 /*s-fat*/, 0 /*t-fat*/,
      0 /*chol (mg)*/, 150 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/,
      0 /*sugar*/, 0 /*protein*/,
    ],
    "Butter/Margarine": [
      15, 100 /*kcal*/, 11 /*fat*/, 7 /*s-fat*/, 0 /*t-fat*/, 30 /*chol (mg)*/,
      90 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Buttermilk, dry": [
      23, 80 /*kcal*/, 1 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 4 /*chol (mg)*/,
      166 /*sodium (mg)*/, 13 /*carbs*/, 0 /*fiber*/, 12 /*sugar*/,
      5 /*protein*/,
    ],
    "Buttermilk, fresh (lowfat)": [
      240, 120 /*kcal*/, 2.5 /*fat*/, 2 /*s-fat*/, 0 /*t-fat*/,
      15 /*chol (mg)*/, 380 /*sodium (mg)*/, 15 /*carbs*/, 0 /*fiber*/,
      11 /*sugar*/, 10 /*protein*/,
    ],
    "Canola Oil": [
      14, 120 /*kcal*/, 14 /*fat*/, 1 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Citric Acid": [
      1, 0 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Clarified Butter (Ghee)": [
      14, 130 /*kcal*/, 14 /*fat*/, 9 /*s-fat*/, 0 /*t-fat*/, 30 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Corn Flour": [
      30, 110 /*kcal*/, 1 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 23 /*carbs*/, 2 /*fiber*/, 1 /*sugar*/, 2 /*protein*/,
    ],
    "Corn Oil": [
      14, 120 /*kcal*/, 14 /*fat*/, 2 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Corn Syrup": [
      30, 120 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      30 /*sodium (mg)*/, 30 /*carbs*/, 0 /*fiber*/, 10 /*sugar*/,
      0 /*protein*/,
    ],
    Cornmeal: [
      27, 90 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 21 /*carbs*/, 1 /*fiber*/, 0 /*sugar*/, 2 /*protein*/,
    ],
    "Cream of Tartar": [
      3, 5 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Dry Non-Fat Milk (Carnation's)": [
      23, 80 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 5 /*chol (mg)*/,
      125 /*sodium (mg)*/, 12 /*carbs*/, 0 /*fiber*/, 12 /*sugar*/,
      8 /*protein*/,
    ],
    "Egg Whites (fresh, raw)": [
      46, 25 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      80 /*sodium (mg)*/, 1 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 5 /*protein*/,
    ],
    "Eggs (large, fresh, raw)": [
      50, 70 /*kcal*/, 5 /*fat*/, 1.5 /*s-fat*/, 0 /*t-fat*/, 185 /*chol (mg)*/,
      70 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 6 /*protein*/,
    ],
    Honey: [
      21.25, 60 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 17 /*carbs*/, 0 /*fiber*/, 17 /*sugar*/, 0 /*protein*/,
    ],
    Lard: [
      13, 120 /*kcal*/, 13 /*fat*/, 5 /*s-fat*/, 0 /*t-fat*/, 10 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Malted Milk Powder (Carnation's)": [
      21, 90 /*kcal*/, 1.5 /*fat*/, 1 /*s-fat*/, 0 /*t-fat*/, 5 /*chol (mg)*/,
      100 /*sodium (mg)*/, 16 /*carbs*/, 0 /*fiber*/, 12 /*sugar*/,
      2 /*protein*/,
    ],
    "Maple Syrup (pure)": [
      30, 110 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 26 /*carbs*/, 0 /*fiber*/, 26 /*sugar*/, 0 /*protein*/,
    ],
    "Milk (fresh)": [
      240, 130 /*kcal*/, 5 /*fat*/, 2.7 /*s-fat*/, 0 /*t-fat*/,
      20 /*chol (mg)*/, 130 /*sodium (mg)*/, 12 /*carbs*/, 0 /*fiber*/,
      12 /*sugar*/, 8 /*protein*/,
    ],
    Molasses: [
      15, 60 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 20 /*chol (mg)*/,
      20 /*sodium (mg)*/, 16 /*carbs*/, 0 /*fiber*/, 14 /*sugar*/,
      0 /*protein*/,
    ],
    "Non-Diastatic Barley Malt Syrup": [
      100, 310 /*kcal*/, 2 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      10 /*sodium (mg)*/, 79 /*carbs*/, 17 /*fiber*/, 2 /*sugar*/,
      11 /*protein*/,
    ],
    "Potato Flour": [
      45, 160 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 38 /*carbs*/, 3 /*fiber*/, 0 /*sugar*/, 3 /*protein*/,
    ],
    "Rice Flour": [
      40, 145 /*kcal*/, 1 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      1 /*sodium (mg)*/, 32 /*carbs*/, 1 /*fiber*/, 0 /*sugar*/, 2 /*protein*/,
    ],
    "White Whole Wheat": [
      30, 100 /*kcal*/, 0.5 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 23 /*carbs*/, 4 /*fiber*/, 0 /*sugar*/, 4 /*protein*/,
    ],
    "Whole Wheat": [
      30, 100 /*kcal*/, 0.5 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 21 /*carbs*/, 3 /*fiber*/, 0 /*sugar*/, 4 /*protein*/,
    ],
    "PZ-44": [
      0, 0 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ], // Unknown
    "Rye Flour": [
      30, 110 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 23 /*carbs*/, 3 /*fiber*/, 0 /*sugar*/, 4 /*protein*/,
    ],
    Semolina: [
      45, 160 /*kcal*/, 1 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 33 /*carbs*/, 1 /*fiber*/, 0 /*sugar*/, 6 /*protein*/,
    ],
    Shortening: [
      12, 110 /*kcal*/, 12 /*fat*/, 3 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    "Soy Flour": [
      100, 350 /*kcal*/, 1 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      20 /*sodium (mg)*/, 40 /*carbs*/, 18 /*fiber*/, 7 /*sugar*/,
      49 /*protein*/,
    ],
    "Sweet Dried Dairy Whey": [
      100, 356.14 /*kcal*/, 0.58 /*fat*/, 0.34 /*s-fat*/, 0.04 /*t-fat*/,
      27.15 /*chol (mg)*/, 698.5 /*sodium (mg)*/, 75.7 /*carbs*/, 0 /*fiber*/,
      71 /*sugar*/, 12.03 /*protein*/,
    ],
    "Vegetable (Soybean) Oil": [
      14, 120 /*kcal*/, 14 /*fat*/, 2 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    Vinegar: [
      0, 0 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ], // No nutritional value
    "Vital Wheat Gluten": [
      30, 110 /*kcal*/, 1.5 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 4 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 23 /*protein*/,
    ],
    WRISE: [
      12, 110 /*kcal*/, 12 /*fat*/, 3 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      1200 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/,
      0 /*protein*/,
    ], // Assumed to be 50/50 mix (by weight) of Baking Powder and Shortening
    "Yellow Food Coloring": [
      0, 0 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ], // No nutritional value
  };

  ix = {
    weight: 0,
    calories: 1,
    totalFat: 2,
    saturatedFat: 3,
    transFat: 4,
    cholesterol: 5,
    sodium: 6,
    carbs: 7,
    fiber: 8,
    sugar: 9,
    protein: 10,
  };

  constructor() {
    this.flour = new Conversions("Flour", 0, 0);
    this.water = new Conversions("Water", 0, 0);
    this.salt = new Conversions("", 0, 0);
    this.yeast = new Conversions("", 0, 0);
    this.total = new Conversions("Total", 0, 0);
    this.ball = new Conversions("Single Ball", 0, 0);
    this.innerBall = new Conversions("Single Inner Ball", 0, 0);
    this.outerBall = new Conversions("Single Outer Ball", 0, 0);

    this.prefermentFlour = new Conversions("Flour", 0, 0);
    this.prefermentWater = new Conversions("Water", 0, 0);
    this.prefermentYeast = new Conversions("Yeast", 0, 0);
    this.prefermentTotal = new Conversions("Total", 0, 0);

    this.totalFlour = new Conversions("Flour", 0, 0);
    this.totalWater = new Conversions("Water", 0, 0);
    this.totalYeast = new Conversions("Yeast", 0, 0);

    this.isEnoughData;
    this.recipeToCalculate;
  }

  update(
    useMetric: boolean,
    byWeight: boolean,
    isRound: boolean,
    prefermentType: string,
    prefermentPercent: number,
    prefermentYeastPercent: number,
    prefermentWaterPercent: number,
    prefermentFlourPercent: number,
    yeastName: string,
    yeastPercent: number,
    yeastDensity: number,
    saltName: string,
    saltPercent: number,
    saltDensity: number,
    thicknessFactor: number,
    hydrationPercent: number,
    bottomDiameter: number,
    topDiameter: number,
    weight: number,
    doughBalls: number,
    panWidth: number,
    panLength: number,
    panWidthTop: number,
    panLengthTop: number,
    panHeight: number,
    doughHeight: number,
    bowlResidue: number,
    isDeepDish: boolean,
    hasSlopedSides: boolean,
    isStuffed: boolean,
    stuffedAmount: number,
    addedIngredient: addedIngredientsType[],
    slices: number | null
  ) {
    this.byWeight = byWeight;
    this.isStuffed = isStuffed;
    this.isDeepDish = isDeepDish;
    this.isRound = isRound;
    this.bottomDiameter = bottomDiameter;
    this.topDiameter = topDiameter;
    this.panHeight = panHeight;
    this.panLength = panLength;
    this.panLengthTop = panLengthTop;
    this.panWidth = panWidth;
    this.panWidthTop = panWidthTop;
    this.doughHeight = doughHeight;
    this.hasSlopedSides = hasSlopedSides;
    this.doughBalls = doughBalls;
    this.yeastName = yeastName;
    this.slices = slices || null;

    if (useMetric) {
      bottomDiameter /= Constants.CentimetersInInch;
      topDiameter /= Constants.CentimetersInInch;
      panLength /= Constants.CentimetersInInch;
      panLengthTop /= Constants.CentimetersInInch;
      panWidth /= Constants.CentimetersInInch;
      panWidthTop /= Constants.CentimetersInInch;
      panHeight /= Constants.CentimetersInInch;
      doughHeight /= Constants.CentimetersInInch;
    }

    if (!yeastName) {
      yeastPercent = 0;
      prefermentYeastPercent = 0;
    }

    bowlResidue = 1 + bowlResidue / 100;
    this.bowlResidue = bowlResidue;

    let circleArea = (radius: number) => {
      return Math.PI * Math.pow(radius, 2);
    };
    let trapezoidArea = (top: number, bottom: number, height: number) => {
      return ((top + bottom) / 2) * height;
    };
    let circum = (diameter: number) => {
      return Math.PI * diameter;
    };
    let rads = (angle) => {
      return angle * (Math.PI / 180);
    };
    let hypot = (a: number, b: number) => {
      return Math.sqrt(a * a + b * b);
    };
    let getMiddleSize = (bottom: number, delta: number) => {
      let c = hypot(panHeight, delta);
      let bottomAngle = 90 - (Math.asin(panHeight / c) * 180) / Math.PI;
      let inc =
        (doughHeight / Math.sin(rads(90))) * Math.sin(rads(bottomAngle));

      return bottom + inc + inc;
    };

    let factor = 0;

    if (byWeight) {
      factor = useMetric ? weight / Constants.GramsInOunce : weight;
    } else {
      let bottomRadius = bottomDiameter / 2;
      let bottomArea = isRound
        ? circleArea(bottomRadius)
        : panLength * panWidth;
      let sidesArea = 0;

      if (isDeepDish) {
        if (hasSlopedSides) {
          if (isRound) {
            let bottomRadius = bottomDiameter / 2;
            let topRadius = topDiameter / 2;
            let middleDiameter = getMiddleSize(
              bottomDiameter,
              topRadius - bottomRadius
            );
            let middleRadius = middleDiameter / 2;
            sidesArea = Math.PI * (bottomRadius + middleRadius) * doughHeight;
          } else {
            let middleLength = getMiddleSize(
              panLength,
              panLengthTop - panLength
            );
            let middleWidth = getMiddleSize(panWidth, panWidthTop - panWidth);
            let sideA = trapezoidArea(middleLength, panLength, doughHeight);
            let sideB = trapezoidArea(middleWidth, panWidth, doughHeight);
            sidesArea = sideA + sideA + sideB + sideB;
          }
        } else {
          sidesArea = isRound
            ? circum(bottomDiameter) * doughHeight
            : (panLength + panLength + panWidth + panWidth) * doughHeight;
        }
      }

      factor = (bottomArea + sidesArea) * thicknessFactor;
    }

    factor *= bowlResidue;

    if (isStuffed) factor *= 1 + stuffedAmount / 100;

    this.isStuffed = isStuffed;
    this.thicknessFactor = thicknessFactor;

    let addedPercentages = 0;
    if (addedIngredient) {
      addedPercentages = addedIngredient.reduce(
        (memo, item) => memo + item.amount,
        0
      );
    }

    let totalPercent =
      hydrationPercent + saltPercent + yeastPercent + 100 + addedPercentages;
    let flourOz = factor * doughBalls * (100 / totalPercent);
    let waterOz = (flourOz * hydrationPercent) / 100;
    let saltOz = (flourOz * saltPercent) / 100;
    let yeastOz = (flourOz * yeastPercent) / 100;

    // Compute additions
    this.additions = [];
    this.drops = false;

    if (addedIngredient) {
      for (var i = 0; i < addedIngredient.length; i++) {
        let item = addedIngredient[i];
        if (item.amount > 0) {
          let oz = (flourOz * item.amount) / 100;
          let conversions = new Conversions(
            item.description,
            oz,
            oz / item.ratio
          );
          conversions.updatePercent(item.amount);
          if (item.dropsInTsp) {
            conversions.drops = conversions.teaspoons * item.dropsInTsp;
            this.drops = true;
          }
          this.additions.push(conversions);
        }
      }
    }

    let addedOz = this.additions.reduce(
      (memo, item: Conversions) => memo + item.ounces,
      0
    );
    let totalOz = flourOz + waterOz + saltOz + yeastOz + addedOz;
    let ballOz = totalOz / bowlResidue / doughBalls;

    if (isStuffed) {
      let totalPercentage = stuffedAmount + 100;
      let innerBallOz = (ballOz / totalPercentage) * 100;
      let outerBallOz = (ballOz / totalPercentage) * stuffedAmount;
      this.innerBall.updateOunces(innerBallOz);
      this.outerBall.updateOunces(outerBallOz);
    }

    // Compute preferment
    let prefermentOz = 0;
    if (prefermentType === "tf") {
      // % of total flour
      prefermentOz = flourOz * (prefermentPercent / 100);
    } else if (prefermentType === "tw") {
      // % of total water
      prefermentOz = waterOz * (prefermentPercent / 100);
    } else if (prefermentType === "tdw") {
      // % of total dough weight
      prefermentOz = totalOz * (prefermentPercent / 100);
    }

    this.flour.updatePercent(100);
    this.totalFlour.updatePercent(100);
    this.water.updatePercent(hydrationPercent);
    this.totalWater.updatePercent(hydrationPercent);
    this.totalYeast.updatePercent(yeastPercent);
    this.salt.updatePercent(saltPercent);
    this.yeast.updatePercent(yeastPercent);
    this.total.updatePercent(totalPercent);

    this.flour.updateOunces(flourOz);
    this.totalFlour.updateOunces(flourOz);
    this.water.updateOunces(waterOz);
    this.totalWater.updateOunces(waterOz);
    this.totalYeast.updateOunces(yeastOz);
    this.salt.description = saltName;
    this.salt.updateOunces(saltOz);
    this.salt.updateTeaspoons(saltOz / saltDensity);
    this.yeast.description = yeastName;
    this.yeast.updateOunces(yeastOz);
    this.yeast.updateTeaspoons(yeastDensity ? yeastOz / yeastDensity : 0);
    this.prefermentTotal.updateOunces(prefermentOz);
    this.prefermentTotal.updatePercent(prefermentPercent);
    this.total.updateOunces(totalOz);
    this.ball.updateOunces(ballOz);

    if (prefermentType !== "none" && prefermentType !== "e") {
      this.prefermentWater.updatePercent(prefermentWaterPercent);
      this.prefermentWater.updateOunces(
        prefermentOz * (prefermentWaterPercent / 100)
      );

      this.prefermentYeast.updatePercent(prefermentYeastPercent);
      this.prefermentYeast.updateOunces(
        prefermentOz * (prefermentYeastPercent / 100)
      );

      this.prefermentFlour.updatePercent(100 - prefermentWaterPercent);
      this.prefermentFlour.updateOunces(
        prefermentOz -
          (this.prefermentWater.ounces + this.prefermentYeast.ounces)
      );

      this.water.updatePercent(
        Math.abs(
          this.water.percent -
            prefermentPercent * (this.prefermentWater.percent / 100)
        )
      );
      this.flour.updatePercent(
        Math.abs(
          this.flour.percent -
            prefermentPercent * (this.prefermentFlour.percent / 100)
        )
      );
      this.yeast.updatePercent(
        Math.abs(
          this.yeast.percent -
            prefermentPercent * (this.prefermentYeast.percent / 100)
        )
      );

      this.water.updateOunces(this.water.ounces - this.prefermentWater.ounces);
      this.flour.updateOunces(this.flour.ounces - this.prefermentFlour.ounces);
      this.yeast.updateOunces(this.yeast.ounces - this.prefermentYeast.ounces);
    } else if (prefermentType === "e") {
      this.prefermentWater.updatePercent(prefermentWaterPercent);
      this.prefermentWater.updateOunces(
        this.totalWater.ounces * (prefermentWaterPercent / 100)
      );

      this.prefermentYeast.updatePercent(prefermentYeastPercent);
      this.prefermentYeast.updateOunces(
        this.totalYeast.ounces * (prefermentYeastPercent / 100)
      );

      this.prefermentFlour.updatePercent(prefermentFlourPercent);
      this.prefermentFlour.updateOunces(
        this.totalFlour.ounces * (prefermentFlourPercent / 100)
      );

      this.prefermentTotal.updateOunces(
        this.prefermentWater.ounces +
          this.prefermentYeast.ounces +
          this.prefermentFlour.ounces
      );
      this.prefermentTotal.updatePercent(
        (this.prefermentTotal.ounces / this.total.ounces) * 100
      );

      prefermentPercent = this.prefermentTotal.ounces / this.total.ounces;

      this.water.updateOunces(
        this.totalWater.ounces - this.prefermentWater.ounces
      );
      this.flour.updateOunces(
        this.totalFlour.ounces - this.prefermentFlour.ounces
      );
      this.yeast.updateOunces(
        this.totalYeast.ounces - this.prefermentYeast.ounces
      );

      this.water.updatePercent(
        (this.water.ounces / this.totalWater.ounces) * 100
      );
      this.flour.updatePercent(
        (this.flour.ounces / this.totalFlour.ounces) * 100
      );
      this.yeast.updatePercent(
        (this.yeast.ounces / this.totalYeast.ounces) * 100
      );
    }

    this.calculateDefaultNumberOfSlices(
      isRound,
      bottomDiameter,
      panWidth,
      panLength
    );
    this.calculateNutrition();
  }

  unexpectedCalculateSlices(): void {
    this.calculateDefaultNumberOfSlices(
      this.isRound,
      this.bottomDiameter,
      this.panWidth,
      this.panLength
    );
    this.calculateNutrition();
  }

  calculateDefaultNumberOfSlices(isRound, bottomDiameter, panWidth, panLength) {
    if (this.useStoredSlices) {
      return;
    }

    if (isRound) {
      const area = Math.PI * Math.pow(bottomDiameter / 2, 2);

      if (bottomDiameter <= 6) {
        this.slices = 4;
      } else if (bottomDiameter <= 8) {
        this.slices = 6;
      } else if (bottomDiameter <= 10) {
        this.slices = 8;
      } else if (bottomDiameter <= 12) {
        this.slices = 10;
      } else if (bottomDiameter <= 16) {
        this.slices = 12;
      } else {
        this.slices = Math.floor(area / 14);
      }
    } else {
      this.slices = Math.round(panLength / 3 + panWidth / 3);
    }
  }

  calculateNutrition() {
    this.nutritionFacts.weight = this.ball.grams;
    this.nutritionDefinitions["totalFlour"] = this.nutritionDefinitions.flour;

    Object.keys(this.ix)
      .filter((x) => x !== "weight")
      .forEach((n) => {
        this.nutritionFacts[n] = this.getFacts(n);
      });
  }

  getFacts(metric: string) {
    let total = 0;
    const ingredientsToGather = ["totalFlour", "salt", "yeast"];

    ingredientsToGather.forEach((ingredient) => {
      let definition = this.nutritionDefinitions[ingredient];

      if (ingredient === "yeast") {
        definition = this.nutritionDefinitions[this.yeastName];
      }

      const grams = this[ingredient].grams;

      if (grams > 0) {
        total += this.getFact(
          grams / this.bowlResidue / this.doughBalls,
          definition,
          metric
        );
      }
    });

    this.additions.forEach((addition) => {
      let definition = this.nutritionDefinitions[addition.description];
      total += this.getFact(
        addition.grams / this.bowlResidue / this.doughBalls,
        definition,
        metric
      );
    });

    return total;
  }

  getFact(grams: number, definition: any, metric: string) {
    return (grams / definition[this.ix.weight]) * definition[this.ix[metric]];
  }
}

export class Constants {
  static GramsInOunce: number = 28.3495;
  static GramsInKilogram: number = 1000;
  static OuncesInPound: number = 16;
  static TeaspoonsInTablespoon: number = 3;
  static TablespoonsInCup: number = 16;
  static MillilitersInCup: number = 236.588;
  static CentimetersInInch: number = 2.54;
}

export class Conversions {
  description: string;
  percent: number;
  ounces: number;
  grams: number;
  kilograms: number;
  milliliters: number;
  pounds: number;
  teaspoons: number;
  tablespoons: number;
  cups: number;
  drops: number;

  constructor(description: string, ounces: number, teaspoons: number) {
    this.description = description;
    this.updateOunces(ounces);
    this.updateTeaspoons(teaspoons);
  }

  updatePercent(percent: number) {
    if (percent || percent === 0) {
      this.percent = parseFloat(percent.toFixed(5));
    }
  }

  updateOunces(ounces: number) {
    this.ounces = ounces;
    this.grams = ounces * Constants.GramsInOunce;
    this.kilograms = this.grams / Constants.GramsInKilogram;
    this.pounds = ounces / Constants.OuncesInPound;
  }

  updateTeaspoons(teaspoons: number) {
    this.teaspoons = teaspoons;
    this.tablespoons = teaspoons / Constants.TeaspoonsInTablespoon;
    this.cups = this.tablespoons / Constants.TablespoonsInCup;
    this.milliliters = this.cups * Constants.MillilitersInCup;
  }
}
