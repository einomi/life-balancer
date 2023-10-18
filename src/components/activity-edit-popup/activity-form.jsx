import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { emitter } from '../../js/emitter';
import { REQUIRED_MESSAGE } from '../../js/utils/constants';
import { getActivitiesData } from '../../js/utils/get-activities-data';

const INPUT_CLASS_NAME = 'activity-edit-popup__input';

/**
 * @typedef {Object} FormData
 * @property {string} activity_name
 * @property {number} sessions
 * @property {string} id
 *  */

/**
 * @param {string} name
 * */
function transformNameToId(name) {
  return name.toLowerCase().replace(/\s/g, '-');
}

/** @typedef Props
 * @prop {string=} id
 *  */

/** @param {Props} props */
function ActivityForm(props) {
  const isEditMode = Boolean(props.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({
    mode: 'all',
  });
  const [isIdManuallyEdited, setIsIdManuallyEdited] = useState(false);

  useEffect(() => {
    reset();
  }, [props.id]);

  useEffect(() => {
    if (!props.id) {
      return;
    }

    const activities = getActivitiesData();
    const activity = activities.find((item) => item.id === props.id);
    if (activity) {
      setValue('activity_name', activity.name);
      setValue('sessions', activity.sessions);
      setValue('id', activity.id);
    }

    // update
  }, [props.id]);

  /**
   * @param {FormData} data
   *  */
  function onSubmit(data) {
    const dataToSave =
      /** @type {import('../../components/life-balancer/activity-type').ActivityType} */ ({
        id: data.id,
        name: data.activity_name,
        sessions: Number(data.sessions),
      });

    emitter.emit(
      isEditMode ? 'activity:update' : 'activity:create',
      dataToSave
    );
    emitter.emit('popup:close', 'activity-edit');
  }

  /**
   * @param {Event} event
   *  */
  function handleNameChange(event) {
    const eventTarget = /** @type {HTMLInputElement} */ (event.target);
    if (!isIdManuallyEdited && !isEditMode) {
      setValue('id', transformNameToId(eventTarget.value || ''));
    }
  }

  /**
   * @param {Event} event
   *  */
  function handleIdChange(event) {
    const eventTarget = /** @type {HTMLInputElement} */ (event.target);
    const manuallyEditedId = eventTarget.value;
    setIsIdManuallyEdited(
      manuallyEditedId !== transformNameToId(getValues('activity_name'))
    );
  }

  return (
    // @ts-ignore
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className="activity-edit-popup__input-container">
        <label className="activity-edit-popup__label" htmlFor="activity_name">
          Activity Name
        </label>
        {errors.activity_name && (
          <div className="error-message">{errors.activity_name.message}</div>
        )}
        <input
          className={cn(INPUT_CLASS_NAME, {
            _invalid: errors.activity_name,
          })}
          id="activity_name"
          type="text"
          {...register('activity_name', { required: REQUIRED_MESSAGE })}
          onChange={handleNameChange}
        />
      </div>
      <div className="activity-edit-popup__input-container">
        <label className="activity-edit-popup__label" htmlFor="description">
          Number of Sessions
        </label>
        {errors.sessions && (
          <div className="error-message">{errors.sessions.message}</div>
        )}
        <input
          className={cn(INPUT_CLASS_NAME, {
            _invalid: errors.sessions,
          })}
          id="sessions"
          type="text"
          {...register('sessions', {
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
        <button
          className="popup__button button"
          data-popup-close=""
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default ActivityForm;
