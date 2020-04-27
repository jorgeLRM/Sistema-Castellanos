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

router.get('/add-provider', async (req, res) => {
  const codp = await pool.query('SELECT * FROM codigo_postal');
  res.render('add-provider', { codp });
});

router.get('/see-provider-table', async (req, res) => {
  const proveedor = await pool.query('SELECT * FROM proveedor');
  const codp = await pool.query('SELECT * FROM codigo_postal');
  res.render('see-provider-table', { proveedor, codp });
});

router.get('/budget', (req, res) => {
  res.render('budget');
});

router.get('/see-budget-table', (req, res) => {
  res.render('see-budget-table');
});

router.get('/repairs', async (req, res) => {
  const repairs = await pool.query('SELECT s.folio_servicio, date_format(s.fecha, "%d / %m / %y") as fecha, s.precio_total, u.nombre, a.modelo FROM servicio AS s INNER JOIN automovil AS a on s.id_automovil = a.id_automovil INNER JOIN usuario AS u on u.id_usuario = s.id_usuario ');
  const users = await pool.query('SELECT * FROM usuario AS u WHERE u.tipo_usuario like "mecanico" ');
  res.render('repairs', { repairs, users});
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

router.get('/add-return', async (req, res) => {
  const sales = await pool.query('SELECT *, date_format(fecha, "%d / %m / %y") as fecha ,u.nombre FROM venta as v INNER JOIN usuario AS u on u.id_usuario = v.id_usuario ');
  const parts = await pool.query('SELECT *, c.nombre FROM refaccion AS r INNER JOIN venta_agrega_refaccion AS v on r.numParte= v.numParte INNER JOIN clasificacion_refaccion AS c on c.id_clasificacion= r.id_clasificacion');
  const retuns = await pool.query('SELECT *, date_format(fecha, "%d / %m / %y") as fecha, u.nombre FROM devolucion as d INNER JOIN usuario AS u on u.id_usuario = d.id_usuario ');
  res.render('add-return', { sales, parts, retuns });
});

router.get('/see-return-table', async (req, res) => {
  const retuns = await pool.query('SELECT *, date_format(fecha, "%d / %m / %y") as fecha,u.nombre FROM devolucion as d INNER JOIN usuario AS u on u.id_usuario = d.id_usuario ');
  res.render('see-return-table', { retuns });
});

router.get('/add-user', (req, res) => {
  res.render('add-user');
});

router.get('/see-user-table', (req, res) => {
  res.render('see-user-table');
});

router.get('/reports', (req, res) => {
  res.render('reports');
});

router.post('/reports', async (req, res) => {
  const { date1, date2 } = req.body;
  if (date1 < date2) {
    const services = await pool.query('SELECT * FROM ingresoservicios WHERE fecha >= ? AND fecha <= ?', [date1, date2]);
    const sales = await pool.query('SELECT * FROM ingresoventas WHERE fecha >= ? AND fecha <= ?', [date1, date2]);
    const expenses = await pool.query('SELECT * FROM egresosdevoluciones WHERE fecha >= ? AND fecha <= ?', [date1, date2]);
    var totalRevenue = 0;
    var totalExpenses = 0;
    for (var i = 0; i < services.length; i++) {
      totalRevenue = totalRevenue + services[i].precio_total;
    }
    for (var i = 0; i < sales.length; i++) {
      totalRevenue = totalRevenue + sales[i].precio_total;
    }
    for (var i = 0; i < expenses.length; i++) {
      totalExpenses = totalExpenses + expenses[i].perdida;
    }
    res.render('reports', { services, sales, expenses, totalRevenue, totalExpenses, date1, date2 });
  } else {
    console.log('incorrecto');
  }
});

module.exports = router;
