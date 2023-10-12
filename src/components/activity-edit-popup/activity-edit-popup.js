import { render } from 'react-dom';

import ActivityForm from './activity-form.jsx';

class ActivityEditPopup {
  constructor() {
    const formContainer = document.querySelector('[data-activity-edit-form]');
    render(
      // @ts-ignore
      <ActivityForm />,
      formContainer
    );
  }
}

export default new ActivityEditPopup();
