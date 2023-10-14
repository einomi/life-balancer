import { useState } from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { emitter } from '../../js/emitter';
import { REQUIRED_MESSAGE } from '../../js/utils/constants';

const INPUT_CLASS_NAME = 'activity-edit-popup__input';

/**
 * @param {string} name
 * */
function transformNameToId(name) {
  return name.toLowerCase().replace(/\s/g, '-');
}

function ActivityForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    mode: 'all',
  });
  const [idManuallyEdited, setIdManuallyEdited] = useState(false);

  /**
   * @param {Object} data
   *  */
  function onSubmit(data) {
    console.info(data);
  }

  /**
   * @param {Event} event
   *  */
  function handleNameChange(event) {
    if (!idManuallyEdited) {
      setValue('id', transformNameToId(event.target?.value || ''));
    }
  }

  /**
   * @param {Event} event
   *  */
  function handleIdChange(event) {
    const manuallyEditedId = event.target?.value;
    setIdManuallyEdited(
      manuallyEditedId !== transformNameToId(getValues('name'))
    );
  }

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className="activity-edit-popup__input-container">
        <label className="activity-edit-popup__label" htmlFor="name">
          Activity Name
        </label>
        {errors.name && (
          <div className="error-message">{errors.name.message}</div>
        )}
        <input
          className={cn(INPUT_CLASS_NAME, {
            _invalid: errors.name,
          })}
          id="name"
          type="text"
          {...register('name', { required: REQUIRED_MESSAGE })}
          onChange={handleNameChange}
        />
      </div>
      <div className="activity-edit-popup__input-container">
        <label className="activity-edit-popup__label" htmlFor="description">
          Number of Sessions
        </label>
        {errors.description && (
          <div className="error-message">{errors.description.message}</div>
        )}
        <input
          className={cn(INPUT_CLASS_NAME, {
            _invalid: errors.description,
          })}
          id="description"
          type="text"
          {...register('description', {
            required: REQUIRED_MESSAGE,
            pattern: {
              value: /^[0-9]*$/,
              message: 'Please enter a number',
            },
          })}
        />
      </div>
      <div className="activity-edit-popup__input-container">
        <label className="activity-edit-popup__label" htmlFor="id">
          Custom ID
        </label>
        {errors.id && <div className="error-message">{errors.id.message}</div>}
        <input
          className={cn(INPUT_CLASS_NAME, {
            _invalid: errors.id,
          })}
          id="id"
          type="text"
          {...register('id', {
            required: REQUIRED_MESSAGE,
            pattern: {
              value: /^[a-z0-9-_]*$/,
              message: 'Please enter a valid ID',
            },
          })}
          onChange={handleIdChange}
        />
      </div>
      <div className="popup__buttons flex justify-center space-x-5">
        <button
          className="popup__button _cancel button"
          type="button"
          onClick={() => {
            emitter.emit('popup:close', 'activity-edit');
          }}
        >
          Cancel
        </button>
        <button className="popup__button button" data-popup-close type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

export default ActivityForm;
