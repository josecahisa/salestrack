import React from 'react';
import ReactDOM from 'react-dom';
import Title from 'components/Title/Title';

import BudgetForm from 'components/Budget/BudgetForm';
import Menu from 'components/Menu/menu';

const BUDGET_FORM_DOM_ELEMENT_NAME = 'react-app-budget-form';
const MENU_DOM_ELEMENT_NAME = 'react-app-menu';

const attachReactElementToDOM = (domElementName, reactElement) => {
    debugger;
    const domElement = document.getElementById(domElementName);
    if (domElement) {
        ReactDOM.render(reactElement, document.getElementById(domElementName));
    }
}

attachReactElementToDOM(MENU_DOM_ELEMENT_NAME, <Menu />);
attachReactElementToDOM(BUDGET_FORM_DOM_ELEMENT_NAME, <BudgetForm />);

class App extends React.Component {
  render () {
  }
}

export default App;

// const alertReportDomElement = document.getElementById('react-app-alert-report');
// if (alertReportDomElement) {
//     ReactDOM.render(<AlertsReport />, document.getElementById('react-app-alert-report'));
// }
