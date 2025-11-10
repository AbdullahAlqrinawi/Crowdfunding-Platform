import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const ProfileUpdateModal = ({ open, handleClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    linkedin: '',
    twitter: '',
    profile_pic: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        profile_pic: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_pic') {
      setFormData({ ...formData, profile_pic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async () => {
  try {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    await onUpdate(data);
    
    handleClose();
  } catch (error) {
    console.error("Update failed:", error);
  }
};


  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ /* styling */ }}>
        <h2>Update Profile</h2>
        <TextField
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
        />
        <Button onClick={handleSubmit}>Save</Button>
      </Box>
    </Modal>
  );
};

export default ProfileUpdateModal;
