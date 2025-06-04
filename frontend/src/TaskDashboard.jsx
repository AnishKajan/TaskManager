import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import SettingsModal from './components/SettingsModal';
import { IconButton, Button, Box, Typography, Chip, Avatar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const API = 'http://localhost:5050/api';

function TaskDashboard() {
  const [tasks, setTasks] = useState({ work: [], school: [], personal: [] });
  const [activeTab, setActiveTab] = useState('work');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios.get(`${API}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const categorized = { work: [], school: [], personal: [] };
      res.data.forEach((task) => {
        const section = task.section || 'work';
        if (categorized[section]) categorized[section].push(task);
      });
      Object.keys(categorized).forEach(key => {
        categorized[key] = sortTasksByTime(categorized[key]);
      });
      setTasks(categorized);
    }).catch(err => {
      console.error('❌ Failed to fetch tasks:', err);
    });
  }, [token]);

  const sortTasksByTime = (list) => {
    return [...list].sort((a, b) => {
      const toMinutes = (h, m, period) =>
        (parseInt(h) % 12 + (period === 'PM' ? 12 : 0)) * 60 + parseInt(m);
      return toMinutes(a.startHour, a.startMin, a.startPeriod) -
             toMinutes(b.startHour, b.startMin, b.startPeriod);
    });
  };

  const handleCreate = (taskData) => {
    axios.post(`${API}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const section = res.data.section || 'work';
      setTasks(prev => ({
        ...prev,
        [section]: sortTasksByTime([...prev[section], res.data]),
      }));
      setShowAddModal(false);
    }).catch(err => {
      console.error('❌ Failed to create task:', err);
    });
  };

  const handleEdit = (updatedTask) => {
    axios.put(`${API}/tasks/${updatedTask._id}`, updatedTask, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const section = res.data.section || 'work';
      setTasks(prev => ({
        ...prev,
        [section]: sortTasksByTime(prev[section].map(t => t._id === res.data._id ? res.data : t)),
      }));
      setShowEditModal(false);
    }).catch(err => {
      console.error('❌ Failed to update task:', err);
    });
  };

  const handleDelete = (taskId) => {
    axios.delete(`${API}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setTasks(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(section => {
          updated[section] = updated[section].filter(t => t._id !== taskId);
        });
        return updated;
      });
    }).catch(err => {
      console.error('❌ Failed to delete task:', err);
    });
  };

  const toggleStatus = (taskId) => {
    const task = Object.values(tasks).flat().find(t => t._id === taskId);
    if (!task) return;

    const newStatus = task.status === 'complete' ? 'pending' : 'complete';
    axios.patch(`${API}/tasks/${taskId}`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const section = res.data.section || 'work';
      setTasks(prev => ({
        ...prev,
        [section]: prev[section].map(t => t._id === res.data._id ? res.data : t),
      }));
    }).catch(err => {
      console.error('❌ Failed to toggle task status:', err);
    });
  };

  const renderTask = (task, index) => (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 2, p: 2, background: '#f5f5f5',
            borderRadius: '8px', display: 'flex', gap: 2
          }}
        >
          <Avatar>{task.collaborators?.[0]?.charAt(0)?.toUpperCase() || 'A'}</Avatar>
          <Box flex={1}>
            <Typography fontWeight={600}>{task.name}</Typography>
            <Typography>
              {`${task.startHour}:${task.startMin.toString().padStart(2, '0')} ${task.startPeriod}`} -
              {task.endHour && task.endMin
                ? ` ${task.endHour}:${task.endMin.toString().padStart(2, '0')} ${task.endPeriod}`
                : ' TBD'}
            </Typography>
            <Typography>Priority: {task.priority || 'None'}</Typography>
            <Typography>Recurring: {task.recurring ? 'Yes' : 'None'}</Typography>
          </Box>
          <Chip label={task.status || 'Pending'} color={task.status === 'complete' ? 'success' : 'warning'} />
          <Box>
            <Button size="small" onClick={() => handleDelete(task._id)}>Delete</Button>
            <Button size="small" onClick={() => toggleStatus(task._id)}>
              {task.status === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
            <Button size="small" onClick={() => {
              setEditTask(task);
              setShowEditModal(true);
            }}>Edit</Button>
          </Box>
        </Box>
      )}
    </Draggable>
  );

  return (
    <Box className="dashboard" padding={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Button onClick={() => setActiveTab('work')} variant={activeTab === 'work' ? 'contained' : 'outlined'}>Work</Button>
          <Button onClick={() => setActiveTab('school')} variant={activeTab === 'school' ? 'contained' : 'outlined'} sx={{ mx: 1 }}>School</Button>
          <Button onClick={() => setActiveTab('personal')} variant={activeTab === 'personal' ? 'contained' : 'outlined'}>Personal</Button>
        </Box>
        <Button variant="contained" color="success" onClick={() => setShowAddModal(true)}>
          Click Here to Add Task
        </Button>
        <IconButton onClick={() => setShowSettings(true)}>
          <SettingsIcon fontSize="large" />
        </IconButton>
      </Box>

      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {(tasks[activeTab] || []).map((task, index) => renderTask(task, index))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleCreate}
        section={activeTab}
      />
      <EditTaskModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={editTask}
        onSave={handleEdit}
      />
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </Box>
  );
}

export default TaskDashboard;
