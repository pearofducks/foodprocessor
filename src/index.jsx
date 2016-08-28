import preact, { render } from 'preact';
import Router from 'preact-router';
import { Layout, Recipe, RecipeList } from './components';

const routes = (
  <Layout>
    <Router>
      <RecipeList path="/" />
      <Recipe path="/:name" />
    </Router>
  </Layout>
);

render(routes, document.getElementById('root'));
