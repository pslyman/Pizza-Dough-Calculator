# Pizza-Dough-Calculator

Regarding the [Pizza Dough Calculator and Pizza Dough Premium](https://www.products.porterlyman.com/PizzaApps) apps.

For now I haven't chosen to make the apps open source. Previously there were discussions, and I put word out to garner interest to see if anybody wanted to contribute to the project if I made it open source. At the time there was no interest, people wanted to use the apps but didn't care if it was FOSS. If you'd _like_ to contribute to the project, I'm not opposed to adding contributors. It doesn't contain secrets, it's just code. But for the time being it'll stay private to the public.

That being said, I would like to expose some of the formulas to the app. I have received permission (hence, no secrets) from one or both of the original formula creators to make this open source. At the very least I hope it is educational.

This is not a comprehensive guide to the app, but a brief overview of the formulas and how they are used. I will not be covering all of the code, but rather poignant snippets.

# Attributions

The original formulas were written by Michael Duarte and a pizzamaking.com forum user who goes by Peta-zza.

The [pizza.devlay.com](https://www.pizza.devlay.com) site was written by Anders Lyman.

My mobile apps adapt his work. While much of the code has changed (including the calculator service), they function identically in order to provide consistent results between the two.

# Overview

This repository contains the `calculator.service.ts` that calculates tables data from values, and `public-recipes.ts` which contains the apps' preloaded recipes. Interfaces are provided where relevant. This code doesn't function on its own, but are snippets from the app project (currently private).

The code operates using Javascript with Typescript within the Angular framework.

# Summary

- The starting point for all ingredients is in Ounces, which can be converted to Grams. 
- Weight is totalled, then broken down by the percentages the user provided.   
  - If "Dough Weight" is selected and then entered by the user, then this is easy
  - If Thickness Factor is used, that means the user wants their dough to fit certain dimensions. The Thickness Factor (or `factor`) determines the height of the dough. 
    - If "round", then the the area is calculated as an area of a cylinder. 
    - If "rectangular", then the area is calculated as a product of the length and width. 
    - If "sloped sides" is used, there are additional calculations. A base trapezoid is calculated on the dimensions, then the area is determined from there. 
    - If "stuffed", then the dough is split into two parts, `innerBall` and `outerBall` according to the percentages provided by the user (outer skin percentage, or `stuffedAmount`).
- Percentages are calculated against the flour. Each ingredient has a percentage, then there is a total percentage. 
- Using all the information from above, the weight can be determined. Either size or weight is needed, and the calculator can derive the information it needs from there.

# Context

Within the Calculator tab if the user inputs valid values, those values are assigned to variables within the `Calculator` service. 

# Constructor

The constructor within the Calculator class does some initialization, creating objects using the Conversions class constructor. At first they are initialized with 0 ounces (starting point for weight), and 0 teaspoons (starting point for volume). 

```
this.prefermentFlour = new Conversions("Flour", 0, 0);
this.prefermentWater = new Conversions("Water", 0, 0);
this.prefermentYeast = new Conversions("Yeast", 0, 0);
this.prefermentTotal = new Conversions("Total", 0, 0);
```

# The `update()` method
This is called from the Calculator tab to kick off the calculations. 

1. If using the metric system (grams), some quick conversions are done as part of the reassignment. Like so:

```
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
```

These constants, as they are named, are values that handle these conversions and never change. Here's the Constants class to which it refers:

```
export class Constants {
  static GramsInOunce: number = 28.3495;
  static GramsInKilogram: number = 1000;
  static OuncesInPound: number = 16;
  static TeaspoonsInTablespoon: number = 3;
  static TablespoonsInCup: number = 16;
  static MillilitersInCup: number = 236.588;
  static CentimetersInInch: number = 2.54;
}
```

2. Speaking of constant values, every pizza ingredient you can dream of is defined and contains nutrition information. 

```
nutritionDefinitions = {
    ...
    flour: [
      30, 110 /*kcal*/, 1 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      0 /*sodium (mg)*/, 22 /*carbs*/, 3 /*fiber*/, 0 /*sugar*/, 4 /*protein*/,
    ],
    salt: [
      1.2, 0 /*kcal*/, 0 /*fat*/, 0 /*s-fat*/, 0 /*t-fat*/, 0 /*chol (mg)*/,
      480 /*sodium (mg)*/, 0 /*carbs*/, 0 /*fiber*/, 0 /*sugar*/, 0 /*protein*/,
    ],
    ... 
    // etc
}
```

Additionally in `public-objects.ts`, additional ingredients are given metadata. This includes a `ratio` value which is used to calculate the weight density of the ingredient, or ounces per US tablespoon. 

3. Given that pizza can be circular, and not just rectangular, some functions are provided to calculate the weight of a pizza. The following methods are defined:

```
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

```
Quick explanation of these functions:
- `circleArea`: This function calculates the area of a circle given its radius.
- `trapezoidArea`: This function calculates the area of a trapezoid given the lengths of the top and bottom sides and the height.
- `circum`: This function calculates the circumference of a circle given its diameter.
- `rads`: This function converts an angle from degrees to radians.
- `hypot`: This function calculates the hypotenuse of a right triangle given the lengths of the other two sides.
- `getMiddleSize`: This function calculates the center diameter based on the bottom size and a delta. It uses the hypotenuse of a right triangle and trigonometric functions to calculate the result. The variable `panHeight` is the height of the pan lip, bottom to top. The variable `doughHeight` is the height of the dough within that pan. 
---

4. Additionally, pizza dough can be calculated by a given weight, or a given size. Weight is easy. Size however accounts for different kinds of pans, even those with sloped sides. A factor has to be generated. This factor acts as an anchor for the calculations, a constant value that all calculations are based on. 

Here's if it's done by weight:
```
factor = useMetric ? weight / Constants.GramsInOunce : weight;
```
If it's done by size (volume), it's a bit more complicated. 
```
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
```

Explanation:

- The radius of the bottom of the pan (`bottomRadius`) is calculated as half of the bottom diameter (`bottomDiameter`).
- The area of the bottom of the pan (`bottomArea`) is calculated. 
  - If the pan is round (`isRound` is true), the area is calculated using the `circleArea` function (pi * (bottomRadius ^ 2)) with `bottomRadius` as the argument. 
  - If the pan is rectangular (`isRound` is false), the area is calculated as the product of the pan's length (`panLength`) and width (`panWidth`).
- The factor is then calculated as the sum of the bottom area and the sides area times a `thicknessFactor`.

For more complicated areas involving deep dish or sloped pans, we do the following:
- If the pan is for deep dish (`isDeepDish` is true) *without* sloped sides, the area of the sides is calculated: 
  - If the pan is rectangular, the area of the sides is calculated by adding the four sides together and multiplying it by the `doughHeight`. 
  - If the pan is round, the area is calculated using the product of the `circum` function return value and the height of the dough (`doughHeight`). This gets the area of the dough as though it were a cylinder. 
- If the pan is for deep dish (`isDeepDish` is true) *with* sloped sides (`hasSlopedSides` is true), the calculation differs based on whether the pan is round or not:
  - For a round pan, the code calculates the lateral surface area of a frustum of a cone (a cone with the top cut off). This is calculated using the `getMiddleSize` function to get the middle diameter, then the `sidesArea` is calculated as the product of the middle diameter and the height of the dough times pi. 
  - For a rectangular pan, the area is calculated as the sum of the areas of four trapezoids (due to the a 4-way cross-section) using the `trapezoidArea` function. It can be described as getting the frustum of a rectangular pyramid.

5. If `bowlResidue` is used (the amount of dough that sticks to the bowl and is left behind), the factor is adjusted accordingly. 
```
factor *= bowlResidue;
```
6. If the dough will stuffed, the factor is adjusted accordingly. 
```
if (isStuffed) factor *= 1 + stuffedAmount / 100;
```
7. A total percentage of ingredients against the flour is added together (as well as assigned to their own variables for later). Say you had a recipe that was just 100 grams of flour and 100 grams of water, your total percentage would be 200%. All percentages are calculated against the flour. 

```
let totalPercent = hydrationPercent + saltPercent + yeastPercent + 100 + addedPercentages;
```
8. The total weight of the dough is added together, including any additional ingredients (done with a reducer). No code snippet needed for this one. 

9. If the dough is stuffed, the dough is split into two parts, `innerBall` and `outerBall` according to the percentages provided by the user (outer skin percentage, or `stuffedAmount`). No code snippet for this one. 

10. Every ingredient (if you remember, are objects with a Conversions class) now get their percentages and amounts updated, now that those values are known from steps 8 and 9.: 
```
    this.flour.updatePercent(100);
    this.totalFlour.updatePercent(100);
    this.water.updatePercent(hydrationPercent);
    this.totalWater.updatePercent(hydrationPercent)
    // etc
```
and 
```
    this.flour.updateOunces(flourOz);
    this.totalFlour.updateOunces(flourOz);
    this.water.updateOunces(waterOz);
    this.totalWater.updateOunces(waterOz);
    // etc
```

If prefermentation is being used, these percentages will be altered to account for the preferment / Poolish that will be cut from the whole. This code is extensive, but straightforward so I also won't include a snippet here.

# Nutrition

The Nutrition Facts information is generated by breaking each dough portion into servings (or "slices") and then calculating the nutrition information for each slice. 

`unexpectedCalculateSlices()`: This function calls `calculateDefaultNumberOfSlices()` with sizing parameters and then calls `calculateNutrition()` to calculate the nutrition information for the dough.

```
  unexpectedCalculateSlices(): void {
    this.calculateDefaultNumberOfSlices(
      this.isRound,
      this.bottomDiameter,
      this.panWidth,
      this.panLength
    );
    this.calculateNutrition();
  }
```

`calculateDefaultNumberOfSlices()`: This function calculates the default number of slices based on the shape and size of the dough. If the dough is round, it calculates the area and determines the number of slices based on the bottom diameter. If the dough is rectangular, it calculates the number of slices based on the pan length and width.

```
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
  ```

`calculateNutrition()`: This function calculates the nutrition facts for the food item. It first sets the weight of the food item and the total flour. Then, it iterates over the keys of `this.ix `(excluding 'weight') and calculates the nutrition facts for each metric using `getFacts()`.

Note: `metric` pulls from the nutrition definitions, which are defined at the top of the service. `ix` is used to determine the key for the correct metric.

  ```
  calculateNutrition() {
    this.nutritionFacts.weight = this.ball.grams;
    this.nutritionDefinitions["totalFlour"] = this.nutritionDefinitions.flour;

    Object.keys(this.ix)
      .filter((x) => x !== "weight")
      .forEach((n) => {
        this.nutritionFacts[n] = this.getFacts(n);
      });
  }
```

`getFacts()`: This function calculates the total nutrition facts for a given metric. It iterates over a list of ingredients (`totalFlour`, `salt`, `yeast`), and for each ingredient, it calculates the nutrition facts based on the grams of the ingredient, the nutrition definitions, and the metric. It does the same for additional ingredients. 

```
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
```

`getFact()`: This function calculates the nutrition facts for a given amount of grams, a nutrition definition, and a metric. It divides the grams by the weight in the definition and multiplies it by the metric in the definition.

```
  getFact(grams: number, definition: any, metric: string) {
    return (grams / definition[this.ix.weight]) * definition[this.ix[metric]];
  }
```

# Conclusion
At the end of everything, there is data available to render a recipe table with ingredients by weight, and the nutrition facts can be viewed. 

The calculator doesn't do anything that hasn't been done before. What sets it apart in practical use is that it's built for the home kitchen. While other proofing methods may require commercial yeast, this calculator is made for wild or natural yeast. Additionally, the Poolish (preferment) are cut from the whole and calculated against the weight of the flour. Beyond that, it's just math. 

Hope you enjoyed! 
