<<<<<<< HEAD
import { db } from '#db';
import { ObjectId } from 'mongodb';
import { Command } from 'commander';

const program = new Command();
program
    .name('ecommerce-cli')
    .description('Simple product CRUD CLI')
    .version('1.0.0');

const products = db.collection('products');

// CREATE
program
    .command('add')
    .description('Add a new product')
    .argument('<name>', 'Product name')
    .argument('<stock>', 'Stock quantity')
    .argument('<price>', 'Product price')
    .argument('<tags>', 'Comma-separated tags')
    .action(
        async (
            name: string,
            stockStr: string,
            priceStr: string,
            tagsStr: string,
        ) => {
            const newProduct = {
                name,
                stock: parseInt(stockStr, 10),
                price: parseFloat(priceStr),
                tags: tagsStr.split(',').map((tag: string) => tag.trim()),
            };

            // fill with formatted inputs
            const result = await products.insertOne(newProduct);
            console.log(`Product added with ID: ${result.insertedId}`);
        },
    );

// READ
program
    .command('list')
    .description('List all products')
    .action(async () => {
        console.log('CLI application was called with list command');
        const allProducts = await products.find().toArray();
        console.log(allProducts);
    });

// READ - Get product by id
program
    .command('get')
    .description('Get product by ID')
    .argument('<id>', 'Product ID')
    .action(async (id) => {
        const objId = ObjectId.createFromHexString(id);
        const product = await products.findOne({ _id: objId });

        if (product) {
            console.table(product);
        } else {
            console.log('No product found with that ID.');
        }

        // search by _id using the objId
        // const product = await products.findOne()
    });

// SEARCH - search by tags
program
    .command('search')
    .description('Search products by tag')
    .argument('<tag>', 'Product tag')
    .action(async (tag) => {
        const matchingProducts = await products.find({ tags: tag }).toArray();
        console.table(matchingProducts);
    });

// UPDATE
program
    .command('update')
    .description('Update a product by ID')
    .argument('<id>', 'Product ID')
    .argument('<name>', 'Product name')
    .argument('<stock>', 'Stock quantity')
    .argument('<price>', 'Product price')
    .argument('<tags>', 'Comma-separated tags')
    .action(async (id, name, stockStr, priceStr, tagsStr) => {
        const result = await products.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name,
                    stock: parseInt(stockStr, 10),
                    price: parseFloat(priceStr),
                    tags: tagsStr.split(',').map((t: string) => t.trim()),
                },
            },
        );
        console.log(`${result.modifiedCount} document(s) updated.`);
    });

// DELETE - delete product by id
program
    .command('delete')
    .description('Delete product by ID')
    .argument('<id>', 'Product ID')
    .action(async (id) => {
        const result = await products.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            console.log('Successfully deleted product.');
        } else {
            console.log('No product found to delete.');
        }
    });

program.hook('postAction', () => process.exit(0));
program.parse();
=======
console.log('Basic Node + TS scaffolding');
>>>>>>> a1ab9d7aa2dcd7eb38b3da0308ba879473d4acf5
