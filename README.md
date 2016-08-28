# foodprocessor

A react/mobx javascript app for displaying recipes. Recipes are loaded from a static JSON file, so no API server is needed. :)

## build

The demo site currently uses the _master_ branch, but for a *much* smaller build (with very few changes) you can look at the _preact_ branch.

## the recipe file

- Recipe files are in YAML format with the suffix `.recipe` - example file [here](https://github.com/pearofducks/foodprocessor/blob/master/applePie.recipe)
- A crystal-based YAML to JSON converter is included, by any sane YAML to JSON converter can be used
- `name`, `what`, and `how` are required blocks
- The `what` block:
  - will accept one layer of nesting - to specify groups/sections of ingredients
  - will automatically format text provided as `INGREDIENT - OPTIONAL_MODIFICATION: QUANTITY MEASURE` - e.g. `apples - thinly sliced: 6 c`
    - known measures for expansion can be seen [here](https://github.com/pearofducks/foodprocessor/blob/master/src/components.jsx#L131), unknown measure are simply passed on
- The `how` block is purely translated into Markdown
