import { Request, Response } from 'express';
import Product from '../models/product';

class ProductApiController {
  // CREATE PRODUCT
  async createProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productData = req.body;
      if (req.file) {
        console.log('CONTROLLER: File received:', {
          path: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size
        });
        productData.image = req.file.path; // Store Cloudinary URL
      }

      if (!productData.image) {
        return res.status(400).json({
          success: false,
          message: "Image is required"
        });
      }

      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();

      return res.status(201).json({
        success: true,
        data: savedProduct
      });
    } catch (err: any) {
      console.error("CREATE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    }
  }

  // GET PRODUCTS
  async getProducts(req: Request, res: Response): Promise<Response> {
    try {
      const { search, size, color, minPrice, maxPrice } = req.query;
      const query: any = {
        isDeleted: { $ne: true },
      };

      // SEARCH
      if (search) {
        query.name = { $regex: String(search), $options: "i" };
      }

      // SIZE
      if (size) {
        const sizes = String(size).split(",").filter(Boolean);
        if (sizes.length > 0) {
          query.size = { $in: sizes };
        }
      }

      // COLOR
      if (color) {
        const colors = String(color).split(",").filter(Boolean);
        if (colors.length > 0) {
          query.color = { $in: colors };
        }
      }

      // CATEGORY
      if (req.query.category) {
        const categories = String(req.query.category).split(",").filter(Boolean);
        if (categories.length > 0) {
          query.category = { $in: categories };
        }
      }

      // PRICE
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const products = await Product.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        results: products.length,
        data: products
      });
    } catch (err: any) {
      console.error("SERVER ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    }
  }

  // GET SINGLE PRODUCT
  async getProductById(req: Request, res: Response): Promise<Response> {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'No product found with that ID'
        });
      }

      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (err: any) {
      console.error("FETCH ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    }
  }

  // UPDATE PRODUCT
  async updateProduct(req: Request, res: Response): Promise<Response> {
    try {
      const updateData = req.body;
      if (req.file) {
        updateData.image = req.file.path; // Store the Cloudinary URL
      }

      const product = await Product.findOneAndUpdate(
        {
          _id: req.params.id,
          isDeleted: false,
        },
        updateData,
        {
          new: true,
          runValidators: true
        },
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'No product found with that ID or it is deleted'
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err: any) {
      console.error("UPDATE ERROR:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Bad Request"
      });
    }
  }

  // SOFT DELETE
  async softDeleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: "Moved to trash"
      });
    } catch (err: any) {
      console.error("SOFT DELETE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    }
  }

  // GET TRASH
  async getTrashProducts(req: Request, res: Response): Promise<Response> {
    try {
      const { search, size, color, minPrice, maxPrice } = req.query;
      const query: any = { isDeleted: true };

      if (search) {
        query.name = { $regex: String(search), $options: "i" };
      }

      if (size) {
        const sizes = String(size).split(",").filter(Boolean);
        if (sizes.length > 0) query.size = { $in: sizes };
      }

      if (color) {
        const colors = String(color).split(",").filter(Boolean);
        if (colors.length > 0) query.color = { $in: colors };
      }

      if (req.query.category) {
        const categories = String(req.query.category).split(",").filter(Boolean);
        if (categories.length > 0) query.category = { $in: categories };
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const products = await Product.find(query).sort({ deletedAt: -1 });

      return res.status(200).json({
        success: true,
        results: products.length,
        data: products
      });
    } catch (err: any) {
      console.error("TRASH FETCH ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    }
  }

  // RESTORE
  async restoreProduct(req: Request, res: Response): Promise<Response> {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          isDeleted: false,
          deletedAt: null,
        },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: "Restored successfully"
      });
    } catch (err: any) {
      console.error("RESTORE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    }
  }

  // PERMANENT DELETE
  async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: null
      });
    } catch (err: any) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    }
  }
}

export default new ProductApiController();
