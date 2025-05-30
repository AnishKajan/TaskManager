import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Stack,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CircleIndicator = ({ filled }) => (
  <Box
    width={20}
    height={20}
    borderRadius="50%"
    border="2px solid black"
    bgcolor={filled ? 'black' : 'transparent'}
    flexShrink={0}
  />
);

export default function AddTaskModal({ open, onClose }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [startHour, setStartHour] = useState('');
  const [startMin, setStartMin] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMin, setEndMin] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const [priority, setPriority] = useState('');
  const [recurring, setRecurring] = useState(false);

  const isFilled = (val) => val !== '' && val !== null && val !== undefined;

  const resetFields = () => {
    setName('');
    setDate(new Date());
    setStartHour('');
    setStartMin('');
    setEndHour('');
    setEndMin('');
    setCollaborators('');
    setPriority('');
    setRecurring(false);
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2}>
            {/* Task Name */}
            <Stack direction="row" spacing={2} alignItems="center">
              <CircleIndicator filled={true} />
              <TextField
                fullWidth
                label="Enter Task Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Stack>

            {/* Date Picker */}
            <Stack direction="row" spacing={2} alignItems="center">
              <CircleIndicator filled={true} />
              <DatePicker
                label="Enter Starting Date"
                value={date}
                onChange={(newVal) => setDate(newVal)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Stack>

            {/* Start Time with Label */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <CircleIndicator filled={true} />
              <Box display="flex" flexDirection="column">
                <Typography fontSize={13} fontWeight={600} mb={0.5}>Start Time</Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <Select
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="">Hr</MenuItem>
                    {[...Array(12)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                    ))}
                  </Select>
                  :
                  <Select
                    value={startMin}
                    onChange={(e) => setStartMin(e.target.value)}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="">Min</MenuItem>
                    {[0, 15, 30, 45].map((m) => (
                      <MenuItem key={m} value={m}>{m.toString().padStart(2, '0')}</MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            </Stack>

            {/* End Time with Label */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <CircleIndicator filled={isFilled(endHour) || isFilled(endMin)} />
              <Box display="flex" flexDirection="column">
                <Typography fontSize={13} fontWeight={600} mb={0.5}>End Time (Optional)</Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <Select
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="">Hr</MenuItem>
                    {[...Array(12)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                    ))}
                  </Select>
                  :
                  <Select
                    value={endMin}
                    onChange={(e) => setEndMin(e.target.value)}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="">Min</MenuItem>
                    {[0, 15, 30, 45].map((m) => (
                      <MenuItem key={m} value={m}>{m.toString().padStart(2, '0')}</MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            </Stack>

            {/* Collaborators */}
            <Stack direction="row" spacing={2} alignItems="center">
              <CircleIndicator filled={isFilled(collaborators)} />
              <TextField
                fullWidth
                label="Add Collaborators (Optional)"
                value={collaborators}
                onChange={(e) => setCollaborators(e.target.value)}
              />
            </Stack>

            {/* Priority */}
            <Stack direction="row" spacing={2} alignItems="center">
              <CircleIndicator filled={isFilled(priority)} />
              <FormControl fullWidth>
                <InputLabel>Priority (Optional)</InputLabel>
                <Select
                  value={priority}
                  label="Priority (Optional)"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Recurring Task */}
            <Stack direction="row" spacing={2} alignItems="center">
              <CircleIndicator filled={recurring} />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                  />
                }
                label="Recurring Task"
              />
            </Stack>
          </Stack>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" color="success">Add</Button>
        <Button variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
