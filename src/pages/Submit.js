import React, { useState } from "react";
import "../css/Submit.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Submit = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    organizer: "",
    category: "Student",
    imageFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const today = new Date().toISOString().split("T")[0];
    if (formData.date < today) {
      alert("Date cannot be in the past.");
      return;
    }
  
    try {
      const payload = new FormData();
      payload.append("data", JSON.stringify(formData));
      if (formData.imageFile) {
        payload.append("image", formData.imageFile);
      }
  
      const response = await axios.post("http://localhost:3001/submit-event", payload);
      
      if (response?.data?.message) {
        alert(response.data.message);
        navigate("/events");
      } else {
        alert("Event submitted, but no confirmation message.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit event.");
    }
  };

  return (
    <div className="submit-container">
      <h2>Submit a New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="submit-row">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <div className="submit-row">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="organizer"
          placeholder="Organizer Name"
          value={formData.organizer}
          onChange={handleChange}
          required
        />

        <label>Upload an image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit">Submit Event</button>
      </form>
    </div>
  );
};

export default Submit;
