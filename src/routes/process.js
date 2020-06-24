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

router.post('/see-repair-table', async (req, res) => {
  const {busqueda} = req.body;
  const busq = await pool.query
  (`SELECT r.numParte, r.descripcion, ur.unidad, r.precio_venta, r.precio_compra, r.existencias, cr.nombre
    FROM refaccion AS r
    INNER JOIN unidad_refaccion AS ur
    ON r.id_unidad=ur.id_unidad
    INNER JOIN clasificacion_refaccion AS cr
    ON r.id_clasificacion=cr.id_clasificacion
    WHERE r.numParte LIKE ?`, [busqueda]);
  res.render('see-repair-table', {busq, busqueda});
});

router.get('/add-provider', async (req, res) => {
  const codp = await pool.query('SELECT * FROM codigo_postal');
  res.render('add-provider', { codp });
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
  const servtab = await pool.query('SELECT s.folio_servicio,au.placa, s.fecha, us.nombre FROM servicio AS s INNER JOIN automovil AS au ON s.id_automovil= au.id_automovil INNER JOIN usuario AS us ON s.id_usuario=us.id_usuario');
  res.render('see-budget-table', {servtab});
});

router.get('/repairs', async (req, res) => {
  const repairs = await pool.query('SELECT s.folio_servicio, date_format(s.fecha, "%d / %m / %y") as fecha, s.precio_total, u.nombre, a.modelo FROM servicio AS s INNER JOIN automovil AS a on s.id_automovil = a.id_automovil INNER JOIN usuario AS u on u.id_usuario = s.id_usuario ');
  const users = await pool.query('SELECT * FROM usuario AS u WHERE u.tipo_usuario like "mecanico" ');
  res.render('repairs', { repairs, users });
});

router.get('/add-sale', (req, res) => {
  res.render('add-sale');
});
router.post('/add-sale', async (req, res) => {
  const {txtbuscar}=req.body;
  const ves= await pool.query('SELECT r.numParte,ur.id_unidad,r.descripcion,cr.nombre as nombre,r.existencias,r.precio_venta FROM refaccion r INNER JOIN unidad_refaccion AS ur ON r.id_unidad=ur.id_unidad INNER JOIN clasificacion_refaccion AS cr ON r.id_clasificacion=cr.id_clasificacion WHERE ur.id_unidad LIKE ? or r.numParte LIKE ? or r.descripcion LIKE ? or cr.nombre LIKE ?  ',[txtbuscar,txtbuscar,txtbuscar,txtbuscar]);
  res.render('add-sale',{ves,txtbuscar});
});

router.get('/pay-service', (req, res) => {
  res.render('pay-service');
});
router.get('/see-sale-table', (req, res) => {
  res.render('see-sale-table');
});
router.post('/see-sale-table', async  (req, res) => {
  const {fecha1, fecha2} = req.body;
      const ve= await pool.query('SELECT  m.folio_venta,date_format(m.fecha, "%d-%m-%y") as fecha, CONCAT(us.nombre," ",us.apellidoPat," ",us.apellidoMat) as nombre FROM venta AS m INNER JOIN usuario AS us ON m.id_usuario=us.id_usuario WHERE fecha >= ? AND fecha <= ?',[fecha1, fecha2]);
      res.render('see-sale-table',{ve,fecha1,fecha2});
  
});

router.get('/add-return', async (req, res) => {
  const sales = await pool.query('SELECT *, date_format(fecha, "%d / %m / %y") as fecha ,u.nombre FROM venta as v INNER JOIN usuario AS u on u.id_usuario = v.id_usuario ');
  //const parts = await pool.query('SELECT *, c.nombre FROM refaccion AS r INNER JOIN venta_agrega_refaccion AS v on r.numParte= v.numParte INNER JOIN clasificacion_refaccion AS c on c.id_clasificacion= r.id_clasificacion');
  const retuns = await pool.query('SELECT *, date_format(fecha, "%d / %m / %y") as fecha, u.nombre FROM devolucion as d INNER JOIN usuario AS u on u.id_usuario = d.id_usuario ');
  res.render('add-return', { sales, retuns });
});

router.post('/add-return', async (req, res) => {
  const { busquedarr } = req.body;
  const sale2 = await pool.query('SELECT v.folio_venta, date_format(fecha, "%d / %m / %y") as fecha ,u.nombre FROM venta AS v INNER JOIN usuario AS u on u.id_usuario = v.id_usuario WHERE v.folio_venta LIKE ?', [busquedarr]);
  const parts2 = await pool.query('SELECT r.numParte,r.id_unidad,r.descripcion,r.observacion,r.precio_venta,r.existencias,c.nombre FROM refaccion AS r INNER JOIN clasificacion_refaccion AS c on c.id_clasificacion= r.id_clasificacion INNER JOIN venta_agrega_refaccion AS v on r.numParte= v.numParte WHERE v.folio_venta LIKE ?', [busquedarr]);
  res.render('add-return', { sale2,parts2,busquedarr});
});

router.get('/see-return-table', async (req, res) => {
  const retuns = await pool.query('SELECT *, date_format(fecha, "%d / %m / %y") as fecha FROM devolucion as d INNER JOIN usuario AS u on u.id_usuario = d.id_usuario ');
  const retuns2 = await pool.query('SELECT * FROM devolucion_requiere_refaccion as d ');
  res.render('see-return-table', { retuns,retuns2});
});

router.post('/see-return-table', async (req, res) => {
  const { busquedar } = req.body;
  const ret = await pool.query('SELECT *, date_format(fecha, "%d / %m / %y") as fecha FROM devolucion as d INNER JOIN usuario AS u on u.id_usuario = d.id_usuario WHERE d.folio_devolucion LIKE ? or d.folio_venta LIKE ?', [busquedar,busquedar]);
  res.render('see-return-table', {ret,busquedar});
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
