const express = require('express');
const router = express.Router();
const sqlController = require('./controllers/sqlController');
const mongodbController = require('./controllers/mongodbController');
const neo4jController = require('./controllers/neo4jController');

// SQL Query
router.get('/sql/getTest', sqlController.getTest)

router.get('/sql/getReviews/:username', sqlController.getReviews)

router.get('/sql/getAverageDiscount', sqlController.getAverageDiscount)

router.get('/sql/getEverything/:username', sqlController.getEverything)

router.get('/sql/getAllProducts', sqlController.getAllProducts)

router.post('/sql/addNewProduct', sqlController.addNewProduct)

router.delete('/sql/deleteProduct/:productname', sqlController.deleteProduct)

router.put('/sql/updateProduct/:productname', sqlController.updateProduct)

// MongoDB Query
router.get('/mongodb/getTest', mongodbController.getTest)

router.get('/mongodb/getReviews/:username', mongodbController.getReviews)

router.get('/mongodb/getAverageDiscount', mongodbController.getAverageDiscount)

router.get('/mongodb/getEverything/:username', mongodbController.getEverything)

router.get('/mongodb/getAllProducts', mongodbController.getAllProducts)

router.post('/mongodb/addNewProduct', mongodbController.addNewProduct)

router.delete('/mongodb/deleteProduct/:productname', mongodbController.deleteProduct)

router.put('/mongodb/updateProduct/:productname', mongodbController.updateProduct)
  
// Neo4j Query
router.get('/neo4j/getTest', neo4jController.getTest)

router.get('/neo4j/getReviews/:username', neo4jController.getReviews)

router.get('/neo4j/getAverageDiscount', neo4jController.getAverageDiscount)

router.get('/neo4j/getEverything/:username', neo4jController.getEverything)

router.get('/neo4j/getAllProducts', neo4jController.getAllProducts)

router.post('/neo4j/addNewProduct', neo4jController.addNewProduct)

router.delete('/neo4j/deleteProduct/:productname', neo4jController.deleteProduct)

router.put('/neo4j/updateProduct/:productname', neo4jController.updateProduct)

module.exports = router;