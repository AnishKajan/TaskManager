const express = require('express'); // imports express server
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users')); // ✅ new route for collaborator dropdown

const PORT = process.env.PORT || 5000;
