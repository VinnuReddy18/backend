const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const dataPath = path.join(__dirname, '../data.json');
const dummyDataUrl = 'https://microsoftedge.github.io/Demos/json-dummy-data/256KB.json';


router.get('/', (req, res) => {
    const { sortBy, filterBy, filterValue } = req.query;
  
    let data = JSON.parse(fs.readFileSync(dataPath));
  
    if (filterBy && filterValue) {
      data = data.filter(item => item[filterBy].toString().toLowerCase().includes(filterValue.toLowerCase()));
    }
  
    if (sortBy) {
      data.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }
  
    res.json(data);
  });
  
// Initialization script to fetch and store dummy data
const initializeData = async () => {
  try {
    if (!fs.existsSync(dataPath) || fs.readFileSync(dataPath, 'utf-8').length === 0) {
      const response = await axios.get(dummyDataUrl);
      fs.writeFileSync(dataPath, JSON.stringify(response.data, null, 2));
      console.log('Dummy data initialized.');
    }
  } catch (error) {
    console.error('Error fetching dummy data:', error);
  }
};

initializeData();

// Get data with optional filtering and sorting
router.get('/', (req, res) => {
  const { sortBy, filterBy, filterValue } = req.query;

  let data = JSON.parse(fs.readFileSync(dataPath));

  if (filterBy && filterValue) {
    data = data.filter(item => item[filterBy].toString().includes(filterValue));
  }

  if (sortBy) {
    data.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
  }

  res.json(data);
});


module.exports = router;
