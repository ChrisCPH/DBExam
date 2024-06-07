const sql = require('mssql');
const connectSQLServer = require('../db/sql');

exports.getTest = async function (req, res) {
    let transaction;

    try {
        await connectSQLServer();

        transaction = new sql.Transaction();
        await transaction.begin();

        const request = new sql.Request(transaction);
        const result = await request.query('SELECT ProductName FROM Products');

        await transaction.commit();

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying database:', err);

        if (transaction && !transaction._aborted) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error('Error rolling back transaction:', rollbackErr);
            }
        }

        res.status(500).json({ error: 'Internal server error' });
    } finally {
        sql.close();
    }
};

exports.getReviews = async function (req, res) {
    const username = req.params.username;
    let transaction;

    try {
        await connectSQLServer();

        transaction = new sql.Transaction();
        await transaction.begin();

        const request = new sql.Request(transaction);
        const result = await request
            .input('username', sql.VarChar, username)
            .query(`SELECT r.ReviewTitle, r.ReviewContent, u.UserName 
                    FROM Reviews r 
                    JOIN Users u 
                    ON r.UserID = u.UserID 
                    WHERE u.UserName = @username`);

        await transaction.commit();

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying database:', err);

        if (transaction && !transaction._aborted) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error('Error rolling back transaction:', rollbackErr);
            }
        }

        res.status(500).json({ error: 'Internal server error' });
    } finally {
        sql.close();
    }
};

exports.getAverageDiscount = async function (req, res) {
    let transaction;

    try {
        await connectSQLServer();

        transaction = new sql.Transaction();
        await transaction.begin();

        const request = new sql.Request(transaction);
        const result = await request
            .query(`SELECT AVG(Price) as PriceAvg, AVG(DiscountedPrice) as DiscountPriceAvg, AVG(DiscountPercentage) as DiscountPercentAvg 
                    FROM Products;`);

        await transaction.commit();

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying database:', err);

        if (transaction && !transaction._aborted) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error('Error rolling back transaction:', rollbackErr);
            }
        }

        res.status(500).json({ error: 'Internal server error' });
    } finally {
        sql.close();
    }
};

//Large join
exports.getEverything = async function (req, res) {
    const username = req.params.username;
    let transaction;

    try {
        await connectSQLServer();

        transaction = new sql.Transaction();
        await transaction.begin();

        const request = new sql.Request(transaction);
        const result = await request
            .input('username', sql.VarChar, username)
            .query(`SELECT u.UserName, re.ReviewTitle, p.ProductName, ra.Rating, c.Category
                    FROM Users u
                    JOIN Reviews re 
                    ON u.UserID = re.UserID
                    JOIN Products p 
                    ON re.ProductID = p.ProductID
                    JOIN Ratings ra
                    ON p.ProductID = ra.ProductID
                    JOIN Categories c
                    ON p.CategoryID = c.CategoryID
                    WHERE u.UserName = @username`);

        await transaction.commit();

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying database:', err);

        if (transaction && !transaction._aborted) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error('Error rolling back transaction:', rollbackErr);
            }
        }

        res.status(500).json({ error: 'Internal server error' });
    } finally {
        sql.close(); // Close the SQL connection
    }
};

//Get without join but a lot of data
exports.getAllProducts = async function (req, res) {
    let transaction;

    try {
        await connectSQLServer();

        transaction = new sql.Transaction();
        await transaction.begin();

        const request = new sql.Request(transaction);
        const result = await request.query(`SELECT ProductID, ProductName, Price, DiscountedPrice, DiscountPercentage, ProductLink, ImageLink, Description, CategoryID
                                            FROM Products`);

        await transaction.commit();

        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying database:', err);

        if (transaction && !transaction._aborted) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error('Error rolling back transaction:', rollbackErr);
            }
        }

        res.status(500).json({ error: 'Internal server error' });
    } finally {
        sql.close(); // Close the SQL connection
    }
};

//Insert
exports.addNewProduct = async function (req, res) {
    try {
        const { id, name, price, discount_price, discount_percent, product_link, image_link, description, category_id } = req.body;
        const request = new sql.Request();
        const result = await request
            .input('id', id)
            .input('name', name)
            .input('price', price)
            .input('discount_price', discount_price)
            .input('discount_percent', discount_percent)
            .input('product_link', product_link)
            .input('image_link', image_link)
            .input('description', description)
            .input('category_id', category_id)
            .query(`INSERT INTO Products (ProductID, ProductName, Price, DiscountedPrice, DiscountPercentage, ProductLink, ImageLink, Description, CategoryID)
                VALUES (@id, @name, @price, @discount_price, @discount_percent, @product_link, @image_link, @description, @category_id)`)
        res.json({message: 'Product added', product: id, name, price, discount_price, discount_percent, product_link, image_link, description, category_id});
    } catch(err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Delete
exports.deleteProduct = async function (req, res) {
    try {
        const productname = req.params.productname;
        const request = new sql.Request();
        const result = await request
            .input('productname', productname)
            .query(`DELETE FROM Products 
                WHERE ProductName = @productname`)
        res.json({message: 'Product deleted', product: productname});
    } catch(err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Update
exports.updateProduct = async function (req, res) {
    try {
        const productname = req.params.productname;
        const { name, price, discount_price, discount_percent, product_link, image_link, description, category_id } = req.body;
        const request = new sql.Request();
        const result = await request
            .input('name', name)
            .input('price', price)
            .input('discount_price', discount_price)
            .input('discount_percent', discount_percent)
            .input('product_link', product_link)
            .input('image_link', image_link)
            .input('description', description)
            .input('category_id', category_id)
            .input('productname', productname)
            .query(`UPDATE Products
                SET ProductName = @name, Price = @price, DiscountedPrice = @discount_price, DiscountPercentage = @discount_percent, ProductLink = @product_link, ImageLink = @image_link, Description = @description, CategoryID = @category_id
                WHERE ProductName = @productname`)
        res.json({message: 'Product updated', product: name, price, discount_price, discount_percent, product_link, image_link, description, category_id});
    } catch(err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}