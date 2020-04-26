const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/home', (req, res) => {
  res.render('home');
});

router.get('/add-repair', (req, res) => {
  res.render('add-repair');
});

router.get('/see-repair-table', (req, res) => {
  res.render('see-repair-table');
});

router.get('/add-provider', (req, res) => {
  res.render('add-provider');
});

router.get('/see-provider-table', (req, res) => {
  res.render('see-provider-table');
});

router.get('/budget', (req, res) => {
  res.render('budget');
});

router.get('/see-budget-table', async (req, res) => {
  const servtab = await pool.query('SELECT s.folio_servicio,au.placa, s.fecha, us.nombre FROM servicio AS s INNER JOIN automovil AS au ON s.id_automovil= au.id_automovil INNER JOIN usuario AS us ON s.id_usuario=us.id_usuario');
  res.render('see-budget-table', {servtab});
});

router.get('/repairs', (req, res) => {
  res.render('repairs');
});

router.get('/add-sale', (req, res) => {
  res.render('add-sale');
});

router.get('/pay-service', (req, res) => {
  res.render('pay-service');
});

router.get('/see-sale-table', (req, res) => {
  res.render('see-sale-table');
});

router.get('/add-return', (req, res) => {
  res.render('add-return');
});

router.get('/see-return-table', (req, res) => {
  res.render('see-return-table');
});

router.get('/add-user', (req, res) => {
  res.render('add-user');
});

router.get('/see-user-table', async (req, res) => {
    const usertab = await  pool.query('SELECT * FROM usuario');
  res.render('see-user-table', {usertab});
});

router.get('/reports', (req, res) => {
  res.render('reports');
});

router.post('/reports', async (req, res) => {
  const {date1, date2} = req.body;
  if (date1 < date2) {
      const services = await pool.query('SELECT * FROM ingresoservicios WHERE fecha >= ? AND fecha <= ?',[date1, date2]);
      const sales = await pool.query('SELECT * FROM ingresoventas WHERE fecha >= ? AND fecha <= ?',[date1, date2]);
      const expenses = await pool.query('SELECT * FROM egresosdevoluciones WHERE fecha >= ? AND fecha <= ?', [date1, date2]);
      var totalRevenue = 0;
      var totalExpenses = 0;
      for(var i=0;i<services.length;i++){
        totalRevenue = totalRevenue + services[i].precio_total;
      }
      for(var i=0;i<sales.length;i++){
        totalRevenue = totalRevenue + sales[i].precio_total;
      }
      for(var i=0;i<expenses.length;i++){
        totalExpenses = totalExpenses + expenses[i].perdida;
      }
      res.render('reports',{services,sales,expenses,totalRevenue,totalExpenses,date1,date2});
  }else{
    console.log('incorrecto');
  }
});

module.exports = router;
