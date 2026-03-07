import '#db';
import { ObjectId } from 'mongodb';
import { Command } from 'commander';
import { Product } from '#models';
import type { ProductType } from '#types';

const program = new Command();
program
    .name('ecommerce-cli')
    .description('Simple product CRUD CLI')
    .version('1.0.0');

// CREATE
program
    .command('add')
    .description('Add a new product')
    .argument('<name>', 'Product name')
    .argument('<stock>', 'Stock quantity')
    .argument('<price>', 'Product price')
    .argument('[tags]', 'Comma-separated tags')
    .action(
        async (
            name: string,
            stockStr: string,
            priceStr: string,
            tagsStr?: string,
        ) => {
            const productData = {
                name,
                stock: parseInt(stockStr, 10),
                price: parseFloat(priceStr),
                tags: tagsStr
                    ? tagsStr.split(',').map((tag: string) => tag.trim())
                    : [],
            } satisfies ProductType;

            let newProduct = await Product.findOne({ name: productData.name });

            if (!newProduct) {
                newProduct = await Product.create(productData);
                console.log(`Product added with ID: ${newProduct.id}`);
            } else {
                console.log(`Product "${name}" already exists.`);
            }
        },
    );

// READ
program
    .command('list')
    .description('List all products')
    .action(async () => {
        console.log('CLI application was called with list command');
        const allProducts = await Product.find();
        for (const product of allProducts) {
            console.log(
                `Product: ${product.name}, Price: ${product.price}, Stock: ${product.stock}`,
            );
        }
    });

// READ - Get product by id
program
    .command('get')
    .description('Get product by ID')
    .argument('<id>', 'Product ID')
    .action(async (id) => {
        const product = await Product.findById(id);
        if (product) {
            console.table(product);
        } else {
            console.log('No product found with that ID.');
        }
    });

// SEARCH - search by tags
program
    .command('search')
    .description('Search products by tag')
    .argument('<tag>', 'Product tag')
    .action(async (tag) => {
        const matchingProducts = await Product.find({ tags: tag });
        console.table(matchingProducts.map((p) => p.toObject()));
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
    .action(async (id, name, stockStr, priceStr, tagsStr: string) => {
        const stock = parseInt(stockStr, 10);
        const price = parseFloat(priceStr);

        const tags = tagsStr.split(',').map((tag) => tag.trim());
        const result = await Product.findByIdAndUpdate(
            id,
            { name: name, stock: stock, price: price, tags: tags },
            { returnDocument: 'after' },
        );
        if (!result) {
            console.error('Product not found.');
            return;
        }
        console.table([result.toObject()]);
    });

// DELETE - delete product by id
program
    .command('delete')
    .description('Delete product by ID')
    .argument('<id>', 'Product ID')
    .action(async (id) => {
        const result = await Product.findByIdAndDelete(id);
        if (result) {
            console.log(`Successfully deleted product, ${result}`);
        } else {
            console.log('No product found to delete.');
        }
    });

program.hook('postAction', () => process.exit(0));
program.parse();

if (process.argv.length <= 2) {
    program.outputHelp();
    process.exit(0);
}
