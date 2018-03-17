import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilger from './containers/BurgerBuilder/BurgerBuilder'
class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <BurgerBuilger />
        </Layout>
      </div>
    );
  }
}

export default App;
