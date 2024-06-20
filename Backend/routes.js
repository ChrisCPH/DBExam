const express = require('express');
const router = express.Router();
const sqlController = require('./controllers/sqlController');
const mongodbController = require('./controllers/mongodbController');
const neo4jController = require('./controllers/neo4jController');

//SQL
router.get('/sql/getTopRatedCategories', sqlController.getTopRatedCategories);
router.get('/sql/getTopRatedProducts', sqlController.getTopRatedProducts);
router.get('/sql/getReviewsForHighestRatedProduct', sqlController.getReviewsForHighestRatedProduct);

//Neo4j
router.get('/neo4j/getAllOrdersFromCity/:city', neo4jController.getAllOrdersFromCity);
router.get('/neo4j/getTopSellingCategories', neo4jController.getTopSellingCategories);
router.get('/neo4j/getTopSellingProducts', neo4jController.getTopSellingProducts);
router.get('/neo4j/getLocationsWithHighestOrderVolumes', neo4jController.getLocationsWithHighestOrderVolumes);
router.get('/neo4j/getOrderStatusOverview', neo4jController.getOrderStatusOverview);
router.get('/neo4j/getMostPopularPromotionCodes', neo4jController.getMostPopularPromotionCodes);
router.get('/neo4j/getMostPopularOrdersOnDate/:date', neo4jController.getMostPopularOrdersOnDate);  
router.post('/neo4j/addOrder', neo4jController.addOrder);
router.put('/neo4j/updateOrder/:order_id', neo4jController.updateOrder);
router.delete('/neo4j/deleteOrder/:order_id', neo4jController.deleteOrder);
router.get('/neo4j/getOrderById/:order_id', neo4jController.getOrderById);

//MongoDB
router.get('/mongodb/getPurchaseFrequencyCounts', mongodbController.getPurchaseFrequencyCounts);
router.get('/mongodb/getPurchaseCategoriesCounts', mongodbController.getPurchaseCategoriesCounts);
router.get('/mongodb/getPersonalizedRecommendationFrequencyCounts', mongodbController.getPersonalizedRecommendationFrequencyCounts);
router.get('/mongodb/getBrowsingFrequencyCounts', mongodbController.getBrowsingFrequencyCounts);

module.exports = router;

// Old routes

// SQL Query
/*
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
*/