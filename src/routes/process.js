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

router.get('/see-repair-table', async (req, res) => {
  const repair = await pool.query
  (`SELECT r.numParte, r.descripcion, ur.unidad, r.precio_venta, r.precio_compra, r.existencias, cr.nombre
    FROM refaccion AS r
    INNER JOIN unidad_refaccion AS ur
    ON r.id_unidad=ur.id_unidad
    INNER JOIN clasificacion_refaccion AS cr
    ON r.id_clasificacion=cr.id_clasificacion`);
  const classification = await pool.query("SELECT id_clasificacion, nombre FROM clasificacion_refaccion");
  const unity = await pool.query("SELECT id_unidad, unidad FROM unidad_refaccion");
  res.render('see-repair-table', {repair, classification, unity});
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

router.get('/see-budget-table', (req, res) => {
  res.render('see-budget-table');
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

router.get('/see-return-table', async (req, res) => {
  const returns = await pool.query
  (`SELECT folio_devolucion,
    DATE_FORMAT(fecha, "%d/%m/%Y") AS fecha_f,
    id_usuario,
    folio_venta 
    FROM devolucion`);
  res.render('see-return-table', {returns});
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
