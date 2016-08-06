import React, { Component } from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import marked from 'marked';
import { recipeStore } from './stores';

@observer
export class Layout extends Component {
  componentDidMount() { recipeStore.loadRecipes(); } 
  render() {
    return (
      <div>
        <div className="header">
          <h1>
            { recipeStore.currentRecipeSlug
              ? <Link to="/">foodprocessor | recipes</Link>
              : "foodprocessor | recipes"
            }
          </h1>
          { recipeStore.currentRecipe ? <h2 className="recipe-name">{recipeStore.currentRecipe.name}</h2> : "" }
        </div>
        <div className="allChildContent"> { this.props.children } </div>
      </div>
    );
  }
}

@observer
export class Recipe extends Component {
  componentDidMount() { recipeStore.currentRecipeSlug = this.props.params.name; }
  render() {
    if(recipeStore.hasRecipes()) {
      return (
        <div className="recipeBlock">
        { recipeStore.currentRecipe
          ? <div className="recipeBlock">
            <What content={recipeStore.currentRecipe.what} />
            <How content={recipeStore.currentRecipe.how} />
            </div>
          : <h5 className="error">RECIPE NOT FOUND</h5>
        }
        </div>
        );
    } else {
      return <h5 className="error">LOADING</h5>
    }
  }
}

export const IngredientSection = (props) => {
  return (
    <div className="ingredientSectionBlock">
    <h4>{props.header}</h4>
    { Object.keys(props.content).map((k,i) => 
        <Ingredient key={i} amount={props.content[k]} title={k} />
    )}
    </div>
  );
}

export const What = (props) => {
  return (
    <div className="whatBlock">
      <h3>what</h3>
      { Object.keys(props.content).map((k,i) =>
        typeof(props.content[k]) == 'string' 
        ? <Ingredient key={i} amount={props.content[k]} title={k} />
        : <IngredientSection key={i} header={k} content={props.content[k]} />
      )}
    </div>
  );
}

export const How = (props) => {
  return (
    <div className="howBlock">
      <h3>how</h3>
      <div className="howTextBlock" dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
  );
}

@observer
export class RecipeList extends Component {
  componentDidMount() { recipeStore.currentRecipeSlug = null; }
  render() {
    return (
      <div className="recipeListBlock">
        <ul>
        { recipeStore.recipes.map((recipe,i) =>
            <li key={i}>
              <h2>
                <Link to={`/${recipe.slug()}`}> {recipe.name} </Link> 
              </h2>
            </li>
         )}
        </ul>
      </div>
    );
  }
}

@observer
export class Ingredient extends Component {
  @observable titleData;
  @observable amountData;
  @observable completed;
  didExpand = true;

  constructor(props) {
    super(props);
    this.titleData = props.title
    this.amountData = props.amount
    this.completed = false;
  }
  render() { return <div className={this.ingredientClasses}>{this.amount}{this.title}</div> }
  @computed get amountIsBlank() { return this.amountData == "" }
  @computed get title() {
    if(this.amountIsBlank) {
      return <div onClick={this.toggleCompleted} className="right" dangerouslySetInnerHTML={{__html: marked(this.titleData)}} />
    }
    let titleArray = this.titleData.split(' - ');
    return titleArray.length == 2
      ? <div onClick={this.toggleCompleted} className="right"><strong>{titleArray[0]}</strong> <em>{titleArray[1]}</em></div>
      : <div onClick={this.toggleCompleted} className="right"><strong>{this.titleData}</strong></div>
  }
  @action toggleCompleted = () => {
    this.completed = ! this.completed
  }
  expand(measure) {
    switch(measure) {
      case "c":
      return "cup";
      case "t":
      return "teaspoon"
      case "T":
      return "tablespoon"
      case "ml":
      return "milliliter"
      case "g":
      return "gram"
      default:
      this.didExpand = false;
      return measure;
    }
  }
  prettyify_amount(amount) {
    if(Number.isInteger(amount)) { return amount; }
    let whole_num = Math.floor(amount)
    let remain = amount - whole_num
    whole_num = whole_num == 0 ? "" : whole_num
    switch(remain) {
      case 0.25:
      return `${whole_num} ¼`;
      case 0.33:
      return `${whole_num} ⅓`;
      case 0.5:
      return `${whole_num} ½`;
      case 0.6:
      case 0.66:
      return `${whole_num} ⅔`;
      case 0.75:
      return `${whole_num} ¾`;
      default:
      return amount;
    }
  }
  @computed get amount() {
    let amountArray = /(\d*\.?\d+)\s(.+)/.exec(this.amountData);
    let calculatedAmount = "";
    if(amountArray) {
      let expanded_measure = this.expand(amountArray[2]);
      let amount_raw = parseFloat(amountArray[1]);
      let amount_display = this.prettyify_amount(amount_raw);
      let greaterThanOne = amount_raw > 1;
      let addSuffix = greaterThanOne && this.didExpand;
      calculatedAmount = `${amount_display} ${expanded_measure}${addSuffix ? "s" : ""}`
    } else {
      calculatedAmount = this.amountData
    }
    return <div className="left">{calculatedAmount}</div>
  }
  @computed get ingredientClasses() {
    return `
      ${this.completed ? 'completed' : '' }
      ingredient
    `;
  }
}
