import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import controller from '../controllers/productApiController';
import upload from '../config/multer';

const router: Router = Router();

const validateProduct = [
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Product name cannot be empty')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),

    body('price')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('category')
        .optional()
        .trim()
        .notEmpty().withMessage('Category cannot be empty'),

    body('desc')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description too long'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
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
router.post("/products", upload.single('image'), validateProduct, controller.createProduct);

// GET ALL
router.get("/products", controller.getProducts);

//TRASH
router.get("/products/trash", controller.getTrashProducts);

// GET SINGLE
router.get("/products/:id", controller.getProductById);

// UPDATE
router.put("/products/:id", upload.single('image'), validateProduct, controller.updateProduct);

//SOFT DELETE
router.patch("/products/:id/delete", controller.softDeleteProduct);

//RESTORE
router.patch("/products/:id/restore", controller.restoreProduct);

// DELETE
router.delete("/products/:id", controller.deleteProduct);

export default router;

