"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productApiController_1 = __importDefault(require("../controllers/productApiController"));
const router = (0, express_1.Router)();
// CREATE
router.post("/products", productApiController_1.default.createProduct);
// GET ALL
router.get("/products", productApiController_1.default.getProducts);
//TRASH
router.get("/products/trash", productApiController_1.default.getTrashProducts);
// GET SINGLE
router.get("/products/:id", productApiController_1.default.getProductById);
// UPDATE
router.put("/products/:id", productApiController_1.default.updateProduct);
//SOFT DELETE
router.patch("/products/:id/delete", productApiController_1.default.softDeleteProduct);
//RESTORE
router.patch("/products/:id/restore", productApiController_1.default.restoreProduct);
// DELETE
router.delete("/products/:id", productApiController_1.default.deleteProduct);
exports.default = router;
