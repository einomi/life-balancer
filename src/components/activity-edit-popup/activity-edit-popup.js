import { render } from 'react-dom';

import { emitter } from '../../js/emitter';

import ActivityForm from './activity-form.jsx';

class ActivityEditPopup {
  constructor() {
    this.formContainer = document.querySelector('[data-activity-edit-form]');

    this.renderForm();

    emitter.on('activity:add', () => {
      this.renderForm();
    });

    emitter.on('activity:edit', (id) => {
      this.renderForm(id);
    });
  }

  /**
   * @param {string=} id
   *  */
  renderForm(id) {
    render(
      // @ts-ignore
      <ActivityForm id={id} />,
      this.formContainer
    );
  }
}

export default new ActivityEditPopup();
