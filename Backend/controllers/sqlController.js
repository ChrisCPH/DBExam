const sql = require('mssql');

exports.getTopRatedCategories = async function (req, res) {
    try {
        const request = new sql.Request();
        const result = await request.query(`
            SELECT TOP 5 c.CategoryID, c.Category, AVG(p.Rating) AS AvgRating
            FROM Categories c
            JOIN Products p ON c.CategoryID = p.CategoryID
            GROUP BY c.CategoryID, c.Category
            ORDER BY AvgRating DESC;
        `);
        
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getTopRatedProducts = async function (req, res) {
    try {
        const request = new sql.Request();
        const result = await request.query(`
            SELECT TOP 5 ProductID, ProductName, Price, DiscountedPrice, 
                   DiscountPercentage, ImageLink, ProductLink, Description, 
                   CategoryID, Rating, RatingCount
            FROM Products
            ORDER BY Rating DESC;
        `);
        
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getReviewsForHighestRatedProduct = async function (req, res) {
    try {
        const request = new sql.Request();
        const highestRatedProductQuery = `
            SELECT TOP 1 ProductID
            FROM Products
            ORDER BY Rating ASC;
        `;
        const highestRatedProductResult = await request.query(highestRatedProductQuery);
        const highestRatedProductID = highestRatedProductResult.recordset[0].ProductID;

        const reviewsQuery = `
            SELECT r.ReviewTitle, r.ReviewContent, u.UserName 
            FROM Reviews r
            JOIN Users u ON r.UserID = u.UserID
            WHERE r.ProductID = @productID;
        `;
        const reviewsRequest = new sql.Request();
        const reviewsResult = await reviewsRequest
            .input('productID', sql.VarChar, highestRatedProductID)
            .query(reviewsQuery);
        
        res.json({
            highestRatedProductID: highestRatedProductID,
            reviews: reviewsResult.recordset
        });
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};