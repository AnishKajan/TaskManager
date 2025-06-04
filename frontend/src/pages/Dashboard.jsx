import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  IconButton,
  Popover,
} from '@mui/material';
import { Settings, CalendarToday } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddTaskModal from '../components/AddTaskModal';
import SettingsModal from '../components/SettingsModal';

const tabColors = ['#8000B2', '#1E90FF', '#FFA500', '#FF0000'];
const tabLabels = ['Work', 'School', 'Personal'];

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (_, newTab) => setTab(newTab);

  const handleCalendarOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    handleCalendarClose();
  };

  const isCalendarOpen = Boolean(anchorEl);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box height="100vh" bgcolor="#fff">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor={tabColors[tab]}
          px={4}
          py={2}
        >
          {/* Left Tabs */}
          <Tabs
            value={tab}
            onChange={handleChange}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
          >
            {tabLabels.map((label) => (
              <Tab
                key={label}
                label={label}
                sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 500 }}
              />
            ))}
          </Tabs>

          {/* Right-side Archive and Settings */}
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              onClick={() => setTab(3)}
              sx={{
                color: 'white',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1rem',
              }}
            >
              Archive
            </Button>
            <IconButton onClick={() => setShowSettings(true)}>
              <Settings sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>

        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" fontWeight={700} mb={2} color={tabColors[tab]}>
            Schedule
          </Typography>

          <Button variant="outlined" onClick={() => setShowAddModal(true)}>
            Click here to Add Task
          </Button>

          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight={600} color={tabColors[tab]}>
              Date: {tab === 3 ? new Date().toDateString() : selectedDate.toDateString()}
            </Typography>

            {tab !== 3 && (
              <>
                <IconButton onClick={handleCalendarOpen}>
                  <CalendarToday />
                </IconButton>
                <Popover
                  open={isCalendarOpen}
                  anchorEl={anchorEl}
                  onClose={handleCalendarClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </Popover>
              </>
            )}
          </Box>
        </Box>

        {/* Modals */}
        <AddTaskModal open={showAddModal} onClose={() => setShowAddModal(false)} />
        <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      </Box>
    </LocalizationProvider>
  );
}
