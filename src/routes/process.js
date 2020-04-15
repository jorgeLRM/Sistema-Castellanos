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
})

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

router.get('/see-return-table', (req, res) => {
  res.render('see-return-table');
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

module.exports = router;
