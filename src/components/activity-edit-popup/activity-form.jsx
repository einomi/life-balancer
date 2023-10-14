import { useState, useMemo } from 'react';

function ActivityForm() {
  const [values, setValues] = useState({
    name: '',
    description: '',
  });

  const id = useMemo(() => {
    return values.name.toLowerCase().replace(/\s/g, '-');
  }, [values.name]);

  return (
    <form action="">
      <div className="activity-edit-popup__input-container">
        <label className="activity-edit-popup__label" htmlFor="name">
          Activity Name
        </label>
        <input
          className="activity-edit-popup__input"
          id="name"
          type="text"
          name="name"
          value={values.name}
          onChange={(event) => {
            setValues((prevValues) => ({
              ...prevValues,
              name: event.target.value,
            }));
          }}
        />
      </div>
      <div className="activity-edit-popup__input-container">
        <label className="activity-edit-popup__label" htmlFor="description">
          Number of Sessions
        </label>
        <input
          className="activity-edit-popup__input"
          id="description"
          type="text"
          name="description"
          value={values.description}
        />
      </div>
      <div className="activity-edit-popup__input-container">
        <label className="activity-edit-popup__label" htmlFor="id">
          Custom ID
        </label>
        <input
          className="activity-edit-popup__input"
          id="id"
          type="text"
          name="id"
          value={id}
          onKeyDown={(event) => {
            if (event.key === 'Backspace') {
              return;
            }
            if (!/[a-z0-9-_]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </div>
    </form>
  );
}

export default ActivityForm;
