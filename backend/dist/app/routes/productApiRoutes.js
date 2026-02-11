"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const productApiController_1 = __importDefault(require("../controllers/productApiController"));
const multer_1 = __importDefault(require("../config/multer"));
const router = (0, express_1.Router)();
const validateProduct = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Product name cannot be empty')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
    (0, express_validator_1.body)('price')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('category')
        .optional()
        .trim()
        .notEmpty().withMessage('Category cannot be empty'),
    (0, express_validator_1.body)('desc')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description too long'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorMsg = errors.array().map(err => err.msg).join(', ');
            return res.status(400).json({
                success: false,
                message: errorMsg
            });
        }
        next();
    }
];
// CREATE
router.post("/products", multer_1.default.single('image'), validateProduct, productApiController_1.default.createProduct);
// GET ALL
router.get("/products", productApiController_1.default.getProducts);
//TRASH
router.get("/products/trash", productApiController_1.default.getTrashProducts);
// GET SINGLE
router.get("/products/:id", productApiController_1.default.getProductById);
// UPDATE
router.put("/products/:id", multer_1.default.single('image'), validateProduct, productApiController_1.default.updateProduct);
//SOFT DELETE
router.patch("/products/:id/delete", productApiController_1.default.softDeleteProduct);
//RESTORE
router.patch("/products/:id/restore", productApiController_1.default.restoreProduct);
// DELETE
router.delete("/products/:id", productApiController_1.default.deleteProduct);
exports.default = router;
