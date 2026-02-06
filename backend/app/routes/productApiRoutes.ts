import { Router } from 'express';
import controller from '../controllers/productApiController';

const router: Router = Router();

// CREATE
router.post("/products", controller.createProduct);

// GET ALL
router.get("/products", controller.getProducts);

//TRASH
router.get("/products/trash", controller.getTrashProducts);

// GET SINGLE
router.get("/products/:id", controller.getProductById);

// UPDATE
router.put("/products/:id", controller.updateProduct);

//SOFT DELETE
router.patch("/products/:id/delete", controller.softDeleteProduct);

//RESTORE
router.patch("/products/:id/restore", controller.restoreProduct);

// DELETE
router.delete("/products/:id", controller.deleteProduct);

export default router;
