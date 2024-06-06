const Products = require('../models/Products')
const Categories = require('../models/Categories')
const Ratings = require('../models/Ratings')
const Reviews = require('../models/Reviews')
const Users = require('../models/Users')

exports.getTest = async function (req, res) {
    try {
        const data = await Ratings.find({Rating:4});
        res.json(data);
        //console.log(data);
    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Get review based on username
exports.getReviews = async function (req, res) {
    try {
        const username = req.params.username;
        const user = await Users.findOne({UserName: username});

        const review = await Reviews.find({ UserID: user.UserID }).select('ReviewTitle ReviewContent').lean();

        const response = review.map(reviews => ({
            ReviewTitle: reviews.ReviewTitle,
            ReviewContent: reviews.ReviewContent,
            UserName: user.UserName
        }));

        res.json(response);

    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Get avg price, discount
exports.getAverageDiscount = async function (req, res) {
    try {
        const result = await Products.aggregate([
            {
                $group: {
                    _id: null,
                    PriceAvg: { $avg: "$Price" },
                    DiscountPriceAvg: { $avg: "$DiscountedPrice" },
                    DiscountPercentAvg: { $avg: "$DiscountPercentage" }
                }
            },
            {
                $project: {
                    _id: 0,
                    PriceAvg: 1,
                    DiscountPriceAvg: 1,
                    DiscountPercentAvg: 1
                }
            }
        ]);

        res.json(result[0] || {});
    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Large join
exports.getEverything = async function (req, res) {
    const username = req.params.username;
    try {
        const result = await Users.aggregate([
            {
                $match: { UserName: username }
            },
            {
                $lookup: {
                    from: 'Reviews',
                    localField: 'UserID',
                    foreignField: 'UserID',
                    as: 'reviews'
                }
            },
            {
                $unwind: '$reviews'
            },
            {
                $lookup: {
                    from: 'Products',
                    localField: 'reviews.ProductID',
                    foreignField: 'ProductID',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $lookup: {
                    from: 'Ratings',
                    localField: 'product.ProductID',
                    foreignField: 'ProductID',
                    as: 'ratings'
                }
            },
            {
                $unwind: '$ratings'
            },
            {
                $lookup: {
                    from: 'Categories',
                    localField: 'product.CategoryID',
                    foreignField: 'CategoryID',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $project: {
                    UserName: '$UserName',
                    ReviewTitle: '$reviews.ReviewTitle',
                    ProductName: '$product.ProductName',
                    Rating: '$ratings.Rating',
                    Category: '$category.Category'
                }
            }
        ]);

        res.json(result);
    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//Get without join but a lot of data
exports.getAllProducts = async function (req, res) {
    try {
        const products = await Products.find({}, {
            ProductID: 1,
            ProductName: 1,
            Price: 1,
            DiscountedPrice: 1,
            DiscountPercentage: 1,
            ProductLink: 1,
            ImageLink: 1,
            Description: 1,
            CategoryID: 1
        }).lean();

        res.json(products);
    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Insert
exports.addNewProduct = async function (req, res) {
    try {
        const { name, price, discount_price, discount_percent, product_link, image_link, description, category_id } = req.body;

        const newProduct = new Products({
            ProductName: name,
            Price: price,
            DiscountedPrice: discount_price,
            DiscountPercentage: discount_percent,
            ProductLink: product_link,
            ImageLink: image_link,
            Description: description,
            CategoryID: category_id
        });

        await newProduct.save();

        res.json({ message: 'Product added', product: newProduct });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Delete
exports.deleteProduct = async function (req, res) {
    try {
        const productName = req.params.productname;

        const deletedProduct = await Products.findOneAndDelete({ ProductName: productName });

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted', product: deletedProduct });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Update
exports.updateProduct = async function (req, res) {
    try {
        const productName = req.params.productname;
        const { name, price, discount_price, discount_percent, product_link, image_link, description, category_id } = req.body;

        const updatedProduct = await Products.findOneAndUpdate(
            { ProductName: productName },
            {
                ProductName: name,
                Price: price,
                DiscountedPrice: discount_price,
                DiscountPercentage: discount_percent,
                ProductLink: product_link,
                ImageLink: image_link,
                Description: description,
                CategoryID: category_id
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated', product: updatedProduct });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};