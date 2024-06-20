const neo4j = require('neo4j-driver');
const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
const session = driver.session();

exports.getTest = async function (req, res) {
    try {
        const result = await session.run('MATCH (n) RETURN n LIMIT 10');
        const records = result.records.map(record => record.get(0));
        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Get review based on username
exports.getReviews = async function (req, res) {
    const username = req.params.username;
    try {
        const result = await session.run(
            `MATCH (r:Reviews)-[:CREATED_BY]->(u:Users {user_name: $username}) 
            RETURN r.review_title as ReviewTitle, r.review_content as ReviewContent, u.user_name as UserName`,
            { username: username }
        );
        const records = result.records.map(record => {
            return {
                ReviewTitle: record.get('ReviewTitle'),
                ReviewContent: record.get('ReviewContent'),
                UserName: record.get('UserName')
            };
        });
        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Get avg price, discount
exports.getAverageDiscount = async function (req, res) {
    try {
        const result = await session.run(`
            MATCH (p:Products)
            WITH AVG(p.price) AS PriceAvg, AVG(p.discounted_price) AS DiscountPriceAvg, AVG(p.discount_percentage) AS DiscountPercentAvg
            RETURN PriceAvg, DiscountPriceAvg, DiscountPercentAvg
        `);
        const record = result.records[0];
        const priceAvg = record.get('PriceAvg');
        const discountPriceAvg = record.get('DiscountPriceAvg');
        const discountPercentAvg = record.get('DiscountPercentAvg');
        res.json({ PriceAvg: priceAvg, DiscountPriceAvg: discountPriceAvg, DiscountPercentAvg: discountPercentAvg });
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//Large join
exports.getEverything = async function (req, res) {
    const username = req.params.username;
    try {
        const result = await session.run(`
            MATCH (u:Users {user_name: "paul"})-[:WROTE]->(re:Reviews)-[:CREATED_BY]->(u)
            MATCH (re)-[:PRODUCT]->(p:Products)-[:HAS_RATING]->(ra:Ratings)
            MATCH (p)-[:CATEGORY]->(c:Categories)
            RETURN u.user_name AS UserName, re.review_title AS ReviewTitle, p.product_name AS ProductName, ra.rating AS Rating, c.category_name AS Category
        `, { username: username });
        
        const records = result.records.map(record => ({
            UserName: record.get('UserName'),
            ReviewTitle: record.get('ReviewTitle'),
            ProductName: record.get('ProductName'),
            Rating: record.get('Rating'),
            Category: record.get('Category')
        }));
        
        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Get without join but a lot of data
exports.getAllProducts = async function (req, res) {
    try {
        const result = await session.run(`
            MATCH (p:Products)
            RETURN p.product_id AS ProductID, p.product_name AS ProductName, p.price AS Price,
                   p.discounted_price AS DiscountedPrice, p.discount_percentage AS DiscountPercentage,
                   p.product_link AS ProductLink, p.image_link AS ImageLink, p.description AS Description,
                   p.category_id AS CategoryID
        `);
        
        const records = result.records.map(record => ({
            ProductID: record.get('ProductID'),
            ProductName: record.get('ProductName'),
            Price: record.get('Price'),
            DiscountedPrice: record.get('DiscountedPrice'),
            DiscountPercentage: record.get('DiscountPercentage'),
            ProductLink: record.get('ProductLink'),
            ImageLink: record.get('ImageLink'),
            Description: record.get('Description'),
            CategoryID: record.get('CategoryID')
        }));
        
        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Insert
exports.addNewProduct = async function (req, res) {
    try {
        const { id, name, price, discount_price, discount_percent, product_link, image_link, description, category_id } = req.body;
        
        const result = await session.run(`
            CREATE (p:Products {
                product_id: $id,
                product_name: $name,
                price: $price,
                discounted_price: $discount_price,
                discount_percentage: $discount_percent,
                product_link: $product_link,
                image_link: $image_link,
                description: $description,
                category_id: $category_id
            })
            RETURN p.product_id AS ProductID, p.product_name AS ProductName, p.price AS Price,
                   p.discounted_price AS DiscountedPrice, p.discount_percentage AS DiscountPercentage,
                   p.product_link AS ProductLink, p.image_link AS ImageLink, p.description AS Description,
                   p.category_id AS CategoryID
        `, { 
            id,
            name,
            price,
            discount_price,
            discount_percent,
            product_link,
            image_link,
            description,
            category_id
        });
        
        const createdProduct = result.records[0];
        
        res.json({
            message: 'Product added',
            product: {
                ProductID: createdProduct.get('ProductID'),
                ProductName: createdProduct.get('ProductName'),
                Price: createdProduct.get('Price'),
                DiscountedPrice: createdProduct.get('DiscountedPrice'),
                DiscountPercentage: createdProduct.get('DiscountPercentage'),
                ProductLink: createdProduct.get('ProductLink'),
                ImageLink: createdProduct.get('ImageLink'),
                Description: createdProduct.get('Description'),
                CategoryID: createdProduct.get('CategoryID')
            }
        });
    } catch(err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Delete
exports.deleteProduct = async function (req, res) {
    try {
        const productName = req.params.productname;
        
        const result = await session.run(`
            MATCH (p:Products {product_name: $productName})
            DETACH DELETE p
        `, { productName });
        
        res.json({ message: 'Product deleted', product: productName });
    } catch(err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Update
exports.updateProduct = async function (req, res) {
    try {
        const productName = req.params.productname;
        const { name, price, discount_price, discount_percent, product_link, image_link, description, category_id } = req.body;
        
        const result = await session.run(`
            MATCH (p:Products {product_name: $productName})
            SET p.product_name = $name,
                p.price = $price,
                p.discounted_price = $discount_price,
                p.discount_percentage = $discount_percent,
                p.product_link = $product_link,
                p.image_link = $image_link,
                p.description = $description,
                p.category_id = $category_id
            RETURN p.product_name AS ProductName,
                   p.price AS Price,
                   p.discounted_price AS DiscountedPrice,
                   p.discount_percentage AS DiscountPercentage,
                   p.product_link AS ProductLink,
                   p.image_link AS ImageLink,
                   p.description AS Description,
                   p.category_id AS CategoryID
        `, { 
            productName,
            name,
            price,
            discount_price,
            discount_percent,
            product_link,
            image_link,
            description,
            category_id
        });
        
        const updatedProduct = result.records[0];
        
        res.json({
            message: 'Product updated',
            product: {
                ProductName: updatedProduct.get('ProductName'),
                Price: updatedProduct.get('Price'),
                DiscountedPrice: updatedProduct.get('DiscountedPrice'),
                DiscountPercentage: updatedProduct.get('DiscountPercentage'),
                ProductLink: updatedProduct.get('ProductLink'),
                ImageLink: updatedProduct.get('ImageLink'),
                Description: updatedProduct.get('Description'),
                CategoryID: updatedProduct.get('CategoryID')
            }
        });
    } catch(err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
