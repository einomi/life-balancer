function ActivityForm() {
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
        />
      </div>
    </form>
  );
}

export default ActivityForm;
