import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  Typography
} from '@mui/material';

const EditTaskModal = ({ open, onClose, task, onSave, onDelete }) => {
  const [editedTask, setEditedTask] = React.useState(task);

  React.useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleChange = (field) => (e) => {
    setEditedTask({ ...editedTask, [field]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Edit Task Name" value={editedTask.name} onChange={handleChange('name')} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="date" label="Edit Starting Date" InputLabelProps={{ shrink: true }} value={editedTask.date} onChange={handleChange('date')} />
          </Grid>
          <Grid item xs={6}>
            <Typography>Start Time</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><TextField fullWidth select value={editedTask.startHour} onChange={handleChange('startHour')}><MenuItem value="">--</MenuItem>{[...Array(12)].map((_, i) => <MenuItem key={i} value={i+1}>{i+1}</MenuItem>)}</TextField></Grid>
              <Grid item xs={6}><TextField fullWidth select value={editedTask.startMinute} onChange={handleChange('startMinute')}><MenuItem value="">--</MenuItem>{[0, 15, 30, 45].map(min => <MenuItem key={min} value={min}>{min}</MenuItem>)}</TextField></Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography>Add End Time (Optional)</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><TextField fullWidth select value={editedTask.endHour} onChange={handleChange('endHour')}><MenuItem value="">--</MenuItem>{[...Array(12)].map((_, i) => <MenuItem key={i} value={i+1}>{i+1}</MenuItem>)}</TextField></Grid>
              <Grid item xs={6}><TextField fullWidth select value={editedTask.endMinute} onChange={handleChange('endMinute')}><MenuItem value="">--</MenuItem>{[0, 15, 30, 45].map(min => <MenuItem key={min} value={min}>{min}</MenuItem>)}</TextField></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Add Collaborators (Optional)" value={editedTask.collaborators} onChange={handleChange('collaborators')} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Priority (Optional)" select value={editedTask.priority} onChange={handleChange('priority')}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox checked={editedTask.isRecurring} onChange={() => setEditedTask({ ...editedTask, isRecurring: !editedTask.isRecurring })} />} label="Recurring Task" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => onDelete(editedTask)}>Delete Task</Button>
        <Button variant="contained" color="success" onClick={() => onSave(editedTask)}>Save</Button>
        <Button variant="outlined" onClick={onClose}>Revert</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
