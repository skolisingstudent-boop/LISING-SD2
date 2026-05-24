//import the installed module of express 
const express = require("express");
const path = require("path");
// import mongoose module
const mongoose = require("mongoose");
// provide name for the server
const server = express();
// Declare server port
const port = 4000;

// Trigger connection to mongoDB thru mongoose
// mongoose.connect("mongodb://localhost:27017/");
mongoose.connect("mongodb+srv://GroupAdmin:admin123@grouplangsd2.i5vxr7t.mongodb.net/Inventory-Management?appName=GroupLangSD2");

server.use(express.static(path.join(__dirname)));
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

let db = mongoose.connection;

// Check if connection has error
db.on("error", () => console.error.bind(console, "Cannot connect to MongoDB."));

// Check if connection is okay
db.once("open", () => console.log("MongoDB Atlas Connection Succcess!"));

//Schema -> blueprint

const inventorySchema = new mongoose.Schema({
    name: String,
    productName: String,
    sku: String,
    category: String,
    quantity: Number,
    price: Number,
    supplier: String,
    reorderLevel: Number,
    brand: String,
    stocks: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

//Model
const InventoryItem = mongoose.model("InventoryItem", inventorySchema);

const itemCategorySchema = new mongoose.Schema({
    categoryName: String,
    description: String,
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

const ItemCategory = mongoose.model("ItemCategory", itemCategorySchema);

const supplierSchema = new mongoose.Schema({
    supplier: String,
    contact: String,
    address: String,
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

const Supplier = mongoose.model("Supplier", supplierSchema);



// Middewares
server.use(express.json());
server.use(express.urlencoded({extended: true}));

// Routes
server.get("/home", (req, res) => {
    res.send("Hello from the home endpoint!");
});
// Error handling for undefined routes
server.get("/error", (req, res) => {
    res.status(404).send({
        code: 404,
        message: "Sorry the page cannot be found."
    })
})

// Add new inventory item
server.post("/inventory/add", (req, res) => {
    InventoryItem.findOne({
        productName: req.body.productName,
        category: req.body.category,
        brand: req.body.brand,
        supplier: req.body.supplier
    }).then((result, err) => {
        if(result != null && result.productName == req.body.productName && result.category == req.body.category && result.brand == req.body.brand && result.supplier == req.body.supplier){
            res.send("Duplicate found. This inventory item cannot be added!");
        }else{
            let newInventoryItem = new InventoryItem({
                name: req.body.name,
                productName: req.body.productName,
                sku: req.body.sku,
                category: req.body.category,
                quantity: req.body.quantity,
                price: req.body.price,
                supplier: req.body.supplier,
                reorderLevel: req.body.reorderLevel,
                brand: req.body.brand,
                stocks: req.body.stocks
            });

            newInventoryItem.save().then((savedItem, saveErr) => {
                if(saveErr){
                    res.send("There is an error saving the inventory item.");
                }else{
                    res.status(201).send({
                        code: 201,
                        message: "Inventory item is now added!",
                        data: savedItem
                    });
                }
            })
        }
    })
})
// Get all inventory items
server.get("/inventory/get-all-item", (req, res) => {
    InventoryItem.find({}).then((items, err) => {
        if(err){
            res.send("Error retrieving inventory items.");
        }else{
            res.status(200).send({
                code: 200,
                message: "Inventory items retrieved successfully!",
                data: items
            });
        }
    })
})

/*
server.get("/inventory/get-item/:itemId", (req, res) => {
    if(!mongoose.isValidObjectId(req.params.itemId)){
        res.send("Invalid itemId provided.");
        return;
    }

    InventoryItem.findById(req.params.itemId).then((item, err) => {
        if(err){
            res.send("Error retrieving inventory item.");
        }else if(item == null){
            res.send("Inventory item not found.");
        }else{
            res.status(200).send({
                code: 200,
                message: "Inventory item retrieved successfully!",
                data: item
            });
        }
    })
})
    */

// Get inventory item by itemName
server.get("/inventory/get-item", (req, res) => {
    const itemName = req.query.itemName;

    if(!itemName){
        res.send("Item name is required.");
        return;
    }

    const escapedItemName = itemName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const nameRegex = new RegExp(`^${escapedItemName}$`, "i");

    InventoryItem.findOne({name: nameRegex}).then((item) => {
        if(item == null){
            res.send("Inventory item not found. Cannot retrieve!");
        }else{
            res.status(200).send({
                code: 200,
                message: "Inventory item retrieved successfully!",
                data: item
            });
        }
    }).catch((err) => {
        console.error("Error retrieving inventory item:", err);
        res.status(500).send({
            code: 500,
            message: "Error retrieving inventory item.",
            error: err.message
        });
    })
})
// Delete inventory item by itemId
server.delete("/inventory/delete/:itemId", (req, res) => {
    if(!mongoose.isValidObjectId(req.params.itemId)){
        res.send("Invalid itemId provided.");
        return;
    }

    InventoryItem.findByIdAndDelete(req.params.itemId).then((deletedItem, deleteErr) => {
        if(deleteErr){
            res.send("There is an error deleting the inventory item.");
        }else if(deletedItem == null){
            res.send("Inventory item not found. Cannot delete!");
        }else{
            res.status(200).send({
                code: 200,
                message: "Inventory item is now deleted!",
                data: deletedItem
            });
        }
    })
})
// Edit inventory item by itemId
server.patch("/inventory/edit/:itemId", (req, res) => {
    if(!mongoose.isValidObjectId(req.params.itemId)){
        res.send("Invalid itemId provided.");
        return;
    }

    if(!req.body || Object.keys(req.body).length === 0){
        res.status(400).send({
            code: 400,
            message: "Request body is empty. Please provide data to update."
        });
        return;
    }

    InventoryItem.findById(req.params.itemId).then((result) => {
        if(result == null){
            res.send("Inventory item not found. Cannot edit!");
        }else{
            result.name = req.body.name || result.name;
            result.productName = req.body.productName || result.productName;
            result.sku = req.body.sku || result.sku;
            result.category = req.body.category || result.category;
            result.quantity = req.body.quantity || result.quantity;
            result.price = req.body.price || result.price;
            result.supplier = req.body.supplier || result.supplier;
            result.reorderLevel = req.body.reorderLevel || result.reorderLevel;
            result.brand = req.body.brand || result.brand;
            result.stocks = req.body.stocks || result.stocks;

            result.save().then((updatedItem) => {
                res.status(200).send({
                    code: 200,
                    message: "Inventory item is now updated!",
                    data: updatedItem
                });
            }).catch((updateErr) => {
                console.error("Save error:", updateErr);
                res.status(500).send({
                    code: 500,
                    message: "There is an error updating the inventory item.",
                    error: updateErr.message
                });
            })
        }
    }).catch((err) => {
        console.error("Error finding item:", err);
        res.status(500).send({
            code: 500,
            message: "There is an error finding the inventory item.",
            error: err.message
        });
    })
})
// Delete all inventory items
server.delete("/inventory/delete-all", (req, res) => {
    InventoryItem.deleteMany({}).then((result, err) => {
        if(err){
            res.send("There is an error deleting all inventory items.");
        }else{
            res.status(200).send({
                code: 200,
                message: "All inventory items are now deleted!",
                data: result
            });
        }
    })
})




// Add new item category
server.post("/inventory/category", (req, res) => {
    ItemCategory.findOne({categoryName: req.body.categoryName}).then((result, err) => {
        if(result != null && result.categoryName == req.body.categoryName){
            res.send("Category already exists. Cannot add duplicate category!");
        }else{
            let newItemCategory = new ItemCategory({
                categoryName: req.body.categoryName,
                description: req.body.description
            });

            newItemCategory.save().then((savedCategory, saveErr) => {
                if(saveErr){
                    res.send("There is an error saving the item category.");
                }else{
                    res.status(201).send({
                        code: 201,
                        message: "Item category is now added!",
                        data: savedCategory
                    });
                }
            })
        }
    })
})

// List inventory items by category name
server.get("/inventory/list-item-category", (req, res) => {
    const categoryName = req.query.categoryName;

    if(!categoryName){
        res.send("Category name is required.");
        return;
    }

    const escapedCategoryName = categoryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const categoryRegex = new RegExp(`^${escapedCategoryName}$`, 'i');

    ItemCategory.findOne({categoryName: categoryRegex}).then((category, err) => {
        if(category == null){
            res.send("Category not found. Cannot list items!");
        }else{
            InventoryItem.find({category: categoryRegex}).then((items, findErr) => {
                if(findErr){
                    res.send("Error retrieving inventory items for the category.");
                }else if(items.length === 0){
                    res.send("No items found for this category.");
                }else{
                    res.status(200).send({
                        code: 200,
                        message: `Inventory items for category ${categoryName} retrieved successfully!`,
                        data: items
                    });
                }
            })
        }
    })
})
// List of all categories
server.get("/inventory/all-category", (req, res) => {
    ItemCategory.find({}).then((categories, err) => {
        if(err){
            res.send("Error retrieving categories.");
        }else{
            res.status(200).send({
                code: 200,
                message: "All item categories retrieved successfully!",
                data: categories
            });
        }
    })
})


//Supplier routes

// Add new supplier
server.post("/inventory/supplier", (req, res) => {
    if(!req.body || !req.body.supplier || !req.body.contact || !req.body.address){
        res.status(400).send({
            code: 400,
            message: "Supplier name, contact, and address are required."
        });
        return;
    }

    Supplier.findOne({supplier: req.body.supplier}).then((result, err) => {
        if(result != null && result.supplier == req.body.supplier){
            res.send("Supplier already exists. Cannot add duplicate supplier!");
        }else{
            let newSupplier = new Supplier({
                supplier: req.body.supplier,
                contact: req.body.contact,
                address: req.body.address
            });

            newSupplier.save().then((savedSupplier, saveErr) => {
                if(saveErr){
                    res.send("There is an error saving the supplier.");
                }else{
                    res.status(201).send({
                        code: 201,
                        message: "Supplier is now added!",
                        data: savedSupplier
                    });
                }
            })
        }
    })
})
// List of supplier name
server.get("/inventory/list_of_supplier", (req, res) => {
    Supplier.find({}).then((suppliers, err) => {
        if(err){
            res.send("Error retrieving supplier list.");
        }else{
            res.status(200).send({
                code: 200,
                message: "Supplier list retrieved successfully!",
                data: suppliers
            });
        }
    })
})

// List of inventory items by supplier name
server.get("/inventory/items_from_supplier", (req, res) => {
    let supplierName = req.query.supplierName;

    if(!supplierName){
        res.send("Supplier name is required.");
        return;
    }

    supplierName = supplierName.trim();
    const escaped = supplierName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const supplierRegex = new RegExp('^' + escaped + '$', 'i');

    Supplier.findOne({supplier: supplierRegex}).then((supplier) => {
        if(supplier == null){
            res.send("Supplier not found. Cannot list items!");
        }else{
            InventoryItem.find({supplier: supplierRegex}).then((items, findErr) => {
                if(findErr){
                    res.send("Error retrieving inventory items for the supplier.");
                }else if(items.length === 0){
                    res.send("No items found for this supplier.");
                }else{
                    res.status(200).send({
                        code: 200,
                        message: `Inventory items for supplier ${supplierName} retrieved successfully!`,
                        data: items
                    });
                }
            }).catch((err) => {
                console.error("Error retrieving items:", err);
                res.status(500).send({
                    code: 500,
                    message: "Error retrieving inventory items for the supplier.",
                    error: err.message
                });
            })
        }
    }).catch((err) => {
        console.error("Error searching supplier:", err);
        res.status(500).send({
            code: 500,
            message: "Error searching for supplier.",
            error: err.message
        });
    })
})


server.listen(port, () => console.log(`Server is now running at port ${port}.`))