import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { render } from 'react-dom';
import { Layout, Recipe, RecipeList } from './components';

const routes = (
  <Router history={browserHistory}>
    <Route path='/' component={Layout}>
      <IndexRoute component={RecipeList} />
      <Route path="/:name" component={Recipe} />
    </Route>
  </Router>
);

render(routes, document.getElementById('root'));
