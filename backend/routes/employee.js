const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employee');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { nombre, empresa, puesto, expertise, edad, email, telefono } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO employee (nombre, empresa, puesto, expertise, edad, email, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, empresa, puesto, expertise, edad, email, telefono]
    );
    res.status(201).json({ id: result.insertId, nombre, empresa, puesto, expertise, edad, email, telefono });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, empresa, puesto, expertise, edad, email, telefono } = req.body;
  try {
    await pool.query(
      'UPDATE employee SET nombre=?, empresa=?, puesto=?, expertise=?, edad=?, email=?, telefono=? WHERE id=?',
      [nombre, empresa, puesto, expertise, edad, email, telefono, id]
    );
    res.json({ message: 'Empleado actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM employee WHERE id=?', [id]);
    res.json({ message: 'Empleado eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
