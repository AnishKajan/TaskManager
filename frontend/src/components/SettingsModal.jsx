// File: src/components/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Avatar,
  Box,
  Stack,
  Typography,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function SettingsModal({ open, onClose }) {
  const [username, setUsername] = useState('');
  const [notification, setNotification] = useState('on');
  const [privacy, setPrivacy] = useState('everyone');
  const [avatarColor, setAvatarColor] = useState('#A188FF');
  const [avatarImage, setAvatarImage] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    // Simulate fetch user data from DB
    setUsername('ExampleUser');
  }, []);

  const handleAvatarChange = (color) => {
    setAvatarColor(color);
    setAvatarImage(null); // reset custom image
    setShowAvatarModal(false);
  };

  const handleAvatarUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarImage(reader.result);
      setShowAvatarModal(false);
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, textAlign: 'center' }}>
        Settings
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            backgroundColor: '#eee',
            '&:hover': { backgroundColor: '#ccc' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minHeight: '450px' }}>
        <Stack spacing={4} alignItems="flex-start">
          <FormControl fullWidth>
            <InputLabel>Toggle Notifications</InputLabel>
            <Select
              value={notification}
              label="Toggle Notifications"
              onChange={(e) => setNotification(e.target.value)}
            >
              <MenuItem value="on">On</MenuItem>
              <MenuItem value="off">Off</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Privacy (who can add)</InputLabel>
            <Select
              value={privacy}
              label="Privacy"
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <MenuItem value="everyone">Everyone</MenuItem>
              <MenuItem value="friends">Friends Only</MenuItem>
              <MenuItem value="onlyme">Only Me</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" gap={2} alignItems="center" width="100%">
            <TextField
              label="Edit Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <Avatar sx={{ bgcolor: avatarColor, width: 48, height: 48 }} src={avatarImage || undefined}>
              {!avatarImage && username.charAt(0).toUpperCase()}
            </Avatar>
            <Button
              variant="outlined"
              onClick={() => setShowAvatarModal(true)}
              sx={{ fontWeight: 'bold', '&:hover': { backgroundColor: '#ddd' } }}
            >
              Choose Avatar
            </Button>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          sx={{
            fontWeight: 700,
            '&:hover': { backgroundColor: '#ddd' },
          }}
        >
          Log Out
        </Button>
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'green',
              fontWeight: 700,
              mr: 2,
              '&:hover': { backgroundColor: '#088A08' },
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            sx={{
              fontWeight: 700,
              '&:hover': { backgroundColor: '#ddd' },
            }}
          >
            Revert
          </Button>
        </Box>
      </DialogActions>

      {/* Avatar Modal */}
      <Dialog open={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
        <DialogTitle>Customize Avatar</DialogTitle>
        <DialogContent>
          <Typography mb={2}>Select Color</Typography>
          <Stack direction="row" spacing={2} mb={3}>
            {['#A188FF', '#F44336', '#4CAF50', '#2196F3', '#FF9800'].map((color) => (
              <Avatar
                key={color}
                sx={{ bgcolor: color, cursor: 'pointer' }}
                onClick={() => handleAvatarChange(color)}
              >
                {username.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </Stack>
          <Typography mb={1}>Or upload a custom image:</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleAvatarUpload(e.target.files[0])}
          />
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
