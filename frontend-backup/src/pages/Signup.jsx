import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Signup.module.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    email: '',
    password: '',
    role: 'freelancer',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      setMessage(res.data.message || 'Signup successful!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create Account</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Signup;