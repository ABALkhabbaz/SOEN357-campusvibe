import React, { useState, useRef } from 'react';
import '../css/Submit.css';

function Submit() {
  const [event, setEvent] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });

  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in event) {
      formData.append(key, event[key]);
    }
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch('http://localhost:3001/submit-event', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Server error');

      setSubmitted(true);
      setShowToast(true);

      setEvent({
        name: '',
        description: '',
        date: '',
        time: '',
        location: ''
      });
      setImage(null);
      fileInputRef.current.value = '';
      
      setTimeout(() => setShowToast(false), 2000); // Hide toast after 2s
    } catch (err) {
      console.error('Error submitting event:', err);
      alert('Failed to submit event. Please try again.');
    }
  };

  return (
    <div className="submit-container">
      <h2>Submit Your Event</h2>

      {showToast && (
        <div className="toast-message">Event submitted successfully!</div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={event.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={event.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={event.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={event.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={event.location}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          required
        />
        <button type="submit" className="register-btn">Submit Event</button>
      </form>
    </div>
  );
}

export default Submit;
