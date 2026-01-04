const express = require('express');

const cors = require('cors');
const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 30036;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const TABLE_NAMES = {
    SECTIONS: process.env.DYNAMODB_TABLE_SECTIONS,
    CATEGORIES: process.env.DYNAMODB_TABLE_CATEGORIES,
    SUBCATEGORIES: process.env.DYNAMODB_TABLE_SUBCATEGORIES,
    PRODUCTS: process.env.DYNAMODB_TABLE_PRODUCTS,
    BANNERS: process.env.DYNAMODB_TABLE_BANNERS,
};

// Helper function to scan a table
const scanTable = async (tableName) => {
    const command = new ScanCommand({
        TableName: tableName,
    });
    const response = await docClient.send(command);
    return response.Items;
};

// Routes

// Get all sections
app.get('/api/sections', async (req, res) => {
    try {
        const sections = await scanTable(TABLE_NAMES.SECTIONS);
        res.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).json({ error: 'Failed to fetch sections' });
    }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await scanTable(TABLE_NAMES.CATEGORIES);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Get all subcategories
app.get('/api/subcategories', async (req, res) => {
    try {
        const subcategories = await scanTable(TABLE_NAMES.SUBCATEGORIES);
        res.json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await scanTable(TABLE_NAMES.PRODUCTS);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get all banners
app.get('/api/banners', async (req, res) => {
    try {
        const banners = await scanTable(TABLE_NAMES.BANNERS);
        res.json(banners);
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('Dhanalakshmi Furnitures Server is running');
});

// Get product by slug
app.get('/api/products/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        console.log(`Searching for product with slug/id: ${slug}`);
        const products = await scanTable(TABLE_NAMES.PRODUCTS);
        console.log(`Found ${products.length} products in DB`);

        // Debug: Log all slugs to see what's available
        // console.log('Available slugs:', products.map(p => p.slug));

        const product = products.find(p => p.slug === slug || p.productId === slug);
        console.log("sssss" + JSON.stringify(product));
        if (!product) {
            console.log(`Product not found for slug: ${slug}`);
            // Try case-insensitive search as fallback
            const productCaseInsensitive = products.find(p =>
                (p.slug && p.slug.toLowerCase() === slug.toLowerCase()) ||
                (p.productId && p.productId === slug)
            );

            if (productCaseInsensitive) {
                console.log(`Found product via case-insensitive match: ${productCaseInsensitive.slug}`);
                return res.json(productCaseInsensitive);
            }

            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Get product image by slug/id
app.get('/api/products/:slug/image', async (req, res) => {
    try {
        const { slug } = req.params;
        const products = await scanTable(TABLE_NAMES.PRODUCTS);
        const product = products.find(p => p.slug === slug || p.productId === slug);

        if (!product || !product.images || product.images.length === 0) {
            return res.status(404).send('Image not found');
        }

        const image = product.images[0]; // Get the first image

        // Check if it's a Base64 string
        if (image.startsWith('data:image')) {
            const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const type = matches[1];
                const buffer = Buffer.from(matches[2], 'base64');
                res.writeHead(200, {
                    'Content-Type': type,
                    'Content-Length': buffer.length
                });
                res.end(buffer);
                return;
            }
        }

        // If it's a URL, redirect to it
        if (image.startsWith('http')) {
            return res.redirect(image);
        }

        res.status(404).send('Invalid image format');
    } catch (error) {
        console.error('Error serving product image:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
