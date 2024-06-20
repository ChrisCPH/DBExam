MATCH (c: Category)
WITH c
MATCH (prod:Product)
WHERE prod.category_id = c.category_id
MERGE (prod)-[:CATEGORY]->(c);

MATCH (si: Size)
WITH si
MATCH (prod:Product)
WHERE prod.size_id = si.size_id
MERGE (prod)-[:SIZE]->(si);

MATCH (prod:Product)
WITH prod
MATCH (o:Order)
WHERE o.product_id = prod.product_id
MERGE (o)-[:PRODUCT_ORDERED]->(prod);

MATCH (sh:Shipping)
WITH sh
MATCH (o:Order)
WHERE o.shipping_id = sh.shipping_id
MERGE (o)-[:SHIPPED_VIA]->(sh);

MATCH (l:Location)
WITH l
MATCH (o:Order)
WHERE o.location_id = l.location_id
MERGE (o)-[:SHIPPED_TO]->(l);

MATCH (f:Fulfillment)
WITH f
MATCH (o:Order)
WHERE o.fulfillment_id = f.fulfillment_id
MERGE (o)-[:FULFILLED_BY]->(f);

MATCH (sa:Sales)
WITH sa
MATCH (o:Order)
WHERE o.sales_id = sa.sales_id
MERGE (o)-[:SOLD_THROUGH]->(sa);

MATCH (prom:Promotion)
WITH prom
MATCH (o:Order)
WHERE o.promotion_id = prom.promotion_id
MERGE (o)-[:PROMOTION]->(prom);

MATCH (st:Status)
WITH st
MATCH (o:Order)
WHERE o.status_id = st.status_id
MERGE (o)-[:STATUS]->(st);