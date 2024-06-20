CREATE INDEX IF NOT EXISTS FOR (o:Order) ON (o.order_id);

CREATE INDEX IF NOT EXISTS FOR (prod:Product) ON (prod.product_id);

CREATE INDEX IF NOT EXISTS FOR (l:Location) ON (l.location_id);

CREATE INDEX IF NOT EXISTS FOR (prom:Promotion) ON (prom.promotion_id);

CREATE INDEX IF NOT EXISTS FOR (c:Category) ON (c.category_id);

CREATE INDEX IF NOT EXISTS FOR (f:Fulfillment) ON (f.fulfillment_id);

CREATE INDEX IF NOT EXISTS FOR (sa:Sales) ON (sa.sales_id);

CREATE INDEX IF NOT EXISTS FOR (sh:Shipping) ON (sh.shipping_id);

CREATE INDEX IF NOT EXISTS FOR (si:Size) ON (si.size_id);

CREATE INDEX IF NOT EXISTS FOR (st:Status) ON (st.status_id);