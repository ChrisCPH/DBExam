LOAD CSV WITH HEADERS FROM 'file:///CategoryCSV.csv' AS categoryRow
FIELDTERMINATOR ';'
WITH categoryRow
MERGE (c:Category {
  category_id: toInteger(COALESCE(trim(categoryRow.category_id), '0')),
  category: COALESCE(categoryRow.category, 'NULL')
});

LOAD CSV WITH HEADERS FROM 'file:///FulfillmentCSV.csv' AS fulfillmentRow
FIELDTERMINATOR ';'
WITH fulfillmentRow
MERGE (f:Fulfillment {
  fulfillment_id: toInteger(COALESCE(trim(fulfillmentRow.fulfillment_id), '0')),
  fulfillment: COALESCE(fulfillmentRow.fulfillment, 'NULL')
});

LOAD CSV WITH HEADERS FROM 'file:///LocationCSV.csv' AS locationRow
FIELDTERMINATOR ';'
WITH locationRow
MERGE (l:Location { location_id: toInteger(COALESCE(trim(locationRow.location_id), '0')) })
SET l.city = COALESCE(locationRow.city, 'NULL'),
    l.state = COALESCE(locationRow.state, 'NULL'),
    l.postal_code = COALESCE(locationRow.postal_code, 'NULL'),
    l.country = COALESCE(locationRow.country, 'NULL');

LOAD CSV WITH HEADERS FROM 'file:///OrderCSV.csv' AS orderRow
FIELDTERMINATOR ';'
WITH orderRow
MERGE (o:Order {order_id: COALESCE(orderRow.order_id, 'NULL')})
SET o.date = COALESCE(orderRow.date, 'NULL'),
    o.quantity = toInteger(COALESCE(trim(orderRow.quantity), '0')),
    o.amount = toFloat(COALESCE(trim(orderRow.amount), '0.0')),
    o.currency = COALESCE(orderRow.currency, 'NULL'),
    o.shipping_id = toInteger(COALESCE(trim(orderRow.shipping_id), '0')),
    o.fulfillment_id = toInteger(COALESCE(trim(orderRow.fulfillment_id), '0')),
    o.sales_id = toInteger(COALESCE(trim(orderRow.sales_id), '0')),
    o.promotion_id = toInteger(COALESCE(trim(orderRow.promotion_id), '0')),
    o.product_id = toInteger(COALESCE(trim(orderRow.product_id), '0')),
    o.location_id = toInteger(COALESCE(trim(orderRow.location_id), '0')),
    o.status_id = toInteger(COALESCE(trim(orderRow.status_id), '0'));

LOAD CSV WITH HEADERS FROM 'file:///ProductCSV.csv' AS productRow
FIELDTERMINATOR ';'
WITH productRow
MERGE (prod:Product { product_id: toInteger(COALESCE(trim(productRow.product_id), '0')) })
SET prod.style = COALESCE(productRow.style, 'NULL'),
    prod.SKU = COALESCE(productRow.SKU, 'NULL'),
    prod.ASIN = COALESCE(productRow.ASIN, 'NULL'),
    prod.category_id = toInteger(COALESCE(trim(productRow.category_id), '0')),
    prod.size_id = toInteger(COALESCE(trim(productRow.size_id), '0'));

LOAD CSV WITH HEADERS FROM 'file:///PromotionCSV.csv' AS promotionRow
FIELDTERMINATOR ';'
WITH promotionRow
MERGE (prom:Promotion { promotion_id: toInteger(COALESCE(trim(promotionRow.promotion_id), '0')) })
SET prom.promotion_codes = COALESCE(promotionRow.promotion_codes, 'No code used')

LOAD CSV WITH HEADERS FROM 'file:///SalesCSV.csv' AS salesRow
FIELDTERMINATOR ';'
WITH salesRow
MERGE (sa:Sales {
  sales_id: toInteger(COALESCE(trim(salesRow.sales_id), '0')),
  sales_channel: COALESCE(salesRow.sales_channel, 'NULL'),
  B2B: COALESCE(salesRow.B2B, 'NULL')
});

LOAD CSV WITH HEADERS FROM 'file:///ShippingCSV.csv' AS shippingRow
FIELDTERMINATOR ';'
WITH shippingRow
MERGE (sh:Shipping {
  shipping_id: toInteger(COALESCE(trim(shippingRow.shipping_id), '0')),
  shipping_service_level: COALESCE(shippingRow.shipping_service_level, 'NULL')
});

LOAD CSV WITH HEADERS FROM 'file:///SizeCSV.csv' AS sizeRow
FIELDTERMINATOR ';'
WITH sizeRow
MERGE (si:Size {
  size_id: toInteger(COALESCE(trim(sizeRow.size_id), '0')),
  size: COALESCE(sizeRow.size, 'NULL')
});

LOAD CSV WITH HEADERS FROM 'file:///StatusCSV.csv' AS statusRow
FIELDTERMINATOR ';'
WITH statusRow
MERGE (st:Status {
  status_id: toInteger(COALESCE(trim(statusRow.status_id), '0')),
  status: COALESCE(statusRow.status, 'NULL')
});