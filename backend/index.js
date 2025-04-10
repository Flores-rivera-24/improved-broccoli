const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const employeeRoutes = require('./routes/employee');
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('API M3: Lab 2 CRUD funcionando');
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
