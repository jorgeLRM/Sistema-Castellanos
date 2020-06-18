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

router.get('/see-provider-table', async (req, res) => {
const proveedor = await pool.query("SELECT * FROM proveedor");
const codp = await pool.query("SELECT * FROM codigo_postal");
res.render('see-provider-table', { proveedor, codp });
});

router.post('/see-provider-table', async (req, res) => {
const { busqueda } = req.body;
const pro = await pool.query("SELECT * FROM proveedor AS p WHERE p.rfc LIKE ? or p.razon_social LIKE ? or p.cp LIKE ? or p.telefono LIKE ? or p.email LIKE ? ", [busqueda,busqueda,busqueda,busqueda,busqueda]);
res.render('see-provider-table', { pro, busqueda });
});

router.get('/budget', async (req, res) => {
const servpres1= await pool.query("SELECT numparte, descripcion,precio_venta, existencias From refaccion");
res.render('budget',{servpres1});
});

router.post('/budget', async (req, res) => {
const {busquedabudget} = req.body;
const servpres2= await pool.query("SELECT * FROM refaccion AS r WHERE r.numparte LIKE ? or r.descripcion LIKE ? or r.precio_venta LIKE ? or r.existencias LIKE ? ",[busquedabudget,busquedabudget,busquedabudget,busquedabudget]);
res.render('budget',{servpres2,busquedabudget});
});

router.get('/see-budget-table', async (req, res) => {
  const servtab = await pool.query('SELECT s.folio_servicio,s.estado,au.placa, s.fecha, us.nombre FROM servicio AS s INNER JOIN automovil AS au ON s.id_automovil= au.id_automovil INNER JOIN usuario AS us ON s.id_usuario=us.id_usuario where s.estado="revision"');
  res.render('see-budget-table', {servtab});
});

router.get('/repairs', (req, res) => {
  res.render('repairs');
});

router.get('/add-sale', (req, res) => {
  res.render('add-sale');
});

router.get('/pay-service',(req, res) => {
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
