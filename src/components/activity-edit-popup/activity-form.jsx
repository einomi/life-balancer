import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { emitter } from '../../js/emitter';
import { REQUIRED_MESSAGE } from '../../js/utils/constants';
import { getActivitiesData } from '../../js/utils/get-activities-data';

const INPUT_CLASS_NAME = 'activity-edit-popup__input';

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
  const editMode = Boolean(props.id);
  const [activityData, setActivityData] = useState(
    /** @type {import('../life-balancer/activity-type').ActivityType} */ ({
      id: '',
      name: '',
      sessions: 7,
      priority_bonus: 1,
    })
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: activityData.name,
      description: activityData.sessions,
      id: activityData.id,
    },
  });
  const [idManuallyEdited, setIdManuallyEdited] = useState(!editMode);

  useEffect(() => {
    if (!props.id) {
      return;
    }

    const activities = getActivitiesData();
    const activity = activities.find((item) => item.id === props.id);
    if (activity) {
      setActivityData(activity);
      setValue('name', activity.name);
      setValue('description', activity.sessions);
      setValue('id', activity.id);
    }

    // update
  }, [props.id]);

  /**
   * @param {Object} data
   *  */
  function onSubmit(data) {
    emitter.emit(editMode ? 'activity:update' : 'activity:create', data);
  }

  /**
   * @param {Event} event
   *  */
  function handleNameChange(event) {
    const eventTarget = /** @type {HTMLInputElement} */ (event.target);
    if (!idManuallyEdited) {
      setValue('id', transformNameToId(eventTarget.value || ''));
    }
  }

  /**
   * @param {Event} event
   *  */
  function handleIdChange(event) {
    const eventTarget = /** @type {HTMLInputElement} */ (event.target);
    const manuallyEditedId = eventTarget.value;
    setIdManuallyEdited(
      manuallyEditedId !== transformNameToId(getValues('name'))
    );
  }

  return (
    // @ts-ignore
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
