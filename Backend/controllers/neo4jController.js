const neo4j = require('neo4j-driver');
const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
const session = driver.session();

exports.getAllOrdersFromCity = async function (req, res) {
    try {
        const city = req.params.city;
        const result = await session.run(
            `MATCH (o:Order)-[:SHIPPED_TO]->(l:Location {city: $city})
            RETURN o.amount AS Amount, o.currency AS Currency, o.date AS Date, o.quantity AS Quantity`,
            { city: city }
        );
        const records = result.records.map(record => ({
            amount: record.get('Amount'),
            currency: record.get('Currency'),
            date: record.get('Date'),
            quantity: record.get('Quantity').toNumber()
        }));
        
        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getTopSellingCategories = async function (req, res) {
    try {
        const result = await session.run(
            `MATCH (o:Order)-[:PRODUCT_ORDERED]->(p:Product)-[:CATEGORY]->(c:Category)
            WITH c, SUM(o.quantity) AS Total_Quantity
            RETURN c.category AS Category, Total_Quantity
            ORDER BY Total_Quantity DESC`
        );
        const records = result.records.map(record => ({
            category: record.get('Category'),
            quantity: record.get('Total_Quantity').toNumber()
        }));

        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getTopSellingProducts = async function (req, res) {
    try {
        const result = await session.run(
            `MATCH (o:Order)-[:PRODUCT_ORDERED]->(p:Product)
            WITH p, SUM(o.quantity) AS Total_Quantity
            RETURN p.product_id AS product_id, p.SKU AS SKU, p.ASIN AS ASIN, Total_Quantity
            ORDER BY Total_Quantity DESC
            LIMIT 5`
        );

        const records = result.records.map(record => ({
            product_id: record.get('product_id').toNumber(),
            SKU: record.get('SKU'),
            ASIN: record.get('ASIN'),
            total_quantity: record.get('Total_Quantity').toNumber()
        }));

        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getLocationsWithHighestOrderVolumes = async function (req, res) {
    try {
        const result = await session.run(
            `MATCH (o:Order)-[:SHIPPED_TO]->(l:Location)
            WITH l, COUNT(o) AS order_count
            RETURN l.location_id AS location_id, l.city AS city, l.state AS state, l.country AS country, order_count
            ORDER BY order_count DESC`
        );

        const records = result.records.map(record => ({
            location_id: record.get('location_id').toNumber(),
            city: record.get('city'),
            state: record.get('state'),
            country: record.get('country'),
            order_count: record.get('order_count').toNumber()
        }));

        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOrderStatusOverview = async function (req, res) {
    try {
        const result = await session.run(
            `MATCH (o:Order)-[:STATUS]->(st:Status)
            WITH st.status AS status, COUNT(o) AS order_count
            RETURN status, order_count
            ORDER BY order_count DESC`
        );

        const records = result.records.map(record => ({
            status: record.get('status'),
            order_count: record.get('order_count').toNumber()
        }));

        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMostPopularPromotionCodes = async function (req, res) {
    try {
        const result = await session.run(
            `MATCH (o:Order)-[:PROMOTION]->(prom:Promotion)
            WITH prom.promotion_codes AS promotion_code, COUNT(o) AS usage_count
            RETURN promotion_code, usage_count
            ORDER BY usage_count DESC`
        );

        const records = result.records.map(record => ({
            promotion_code: record.get('promotion_code'),
            usage_count: record.get('usage_count').toNumber()
        }));

        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMostPopularOrdersOnDate = async function (req, res) {
    const date = req.params.date;
    try {
        const result = await session.run(
            `MATCH (o:Order)-[:PRODUCT_ORDERED]->(p:Product)
            WHERE o.date = $date
            WITH p, SUM(o.quantity) AS total_quantity
            RETURN p.product_id AS product_id, total_quantity
            ORDER BY total_quantity DESC
            LIMIT 5`,
            { date }
        );

        const records = result.records.map(record => ({
            product_id: record.get('product_id').toNumber(),
            total_quantity: record.get('total_quantity').toNumber()
        }));

        res.json(records);
    } catch (err) {
        console.error('Error querying Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addOrder = async function (req, res) {
    const { order_id, date, quantity, amount, currency, shipping_id, fulfillment_id, sales_id, promotion_id, product_id, location_id, status_id } = req.body;

    try {
        const result = await session.run(
            `CREATE (o:Order {
                order_id: $order_id,
                date: $date,
                quantity: $quantity,
                amount: $amount,
                currency: $currency,
                shipping_id: $shipping_id,
                fulfillment_id: $fulfillment_id,
                sales_id: $sales_id,
                promotion_id: $promotion_id,
                product_id: $product_id,
                location_id: $location_id,
                status_id: $status_id
            })
            RETURN o`,
            { order_id, date, quantity, amount, currency, shipping_id, fulfillment_id, sales_id, promotion_id, product_id, location_id, status_id }
        );

        res.json(result.records[0].get('o').properties);
    } catch (err) {
        console.error('Error adding order to Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateOrder = async function (req, res) {
    const order_id = req.params.order_id;
    const { date, quantity, amount, currency, shipping_id, fulfillment_id, sales_id, promotion_id, product_id, location_id, status_id } = req.body;

    try {
        const result = await session.run(
            `MATCH (o:Order { order_id: $order_id })
            SET o.date = $date,
                o.quantity = $quantity,
                o.amount = $amount,
                o.currency = $currency,
                o.shipping_id = $shipping_id,
                o.fulfillment_id = $fulfillment_id,
                o.sales_id = $sales_id,
                o.promotion_id = $promotion_id,
                o.product_id = $product_id,
                o.location_id = $location_id,
                o.status_id = $status_id
            RETURN o`,
            { order_id, date, quantity, amount, currency, shipping_id, fulfillment_id, sales_id, promotion_id, product_id, location_id, status_id }
        );

        if (result.records.length === 0) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.json(result.records[0].get('o').properties);
        }
    } catch (err) {
        console.error('Error updating order in Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteOrder = async function (req, res) {
    const order_id = req.params.order_id;

    try {
        const result = await session.run(
            `MATCH (o:Order { order_id: $order_id })
            DETACH DELETE o`,
            { order_id }
        );

        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order from Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOrderById = async function (req, res) {
    const order_id = req.params.order_id;

    try {
        const result = await session.run(
            `MATCH (o:Order { order_id: $order_id })
            RETURN o`,
            { order_id }
        );

        if (result.records.length === 0) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.json(result.records[0].get('o').properties);
        }
    } catch (err) {
        console.error('Error retrieving order from Neo4j:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};