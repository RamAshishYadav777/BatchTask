import { Request, Response } from 'express';
import Product from '../models/product';

class ProductApiController {
  //POST
  async createProduct(req: Request, res: Response): Promise<Response> {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      return res.status(201).json({ success: true, data: savedProduct });
    } catch (err: any) {
      console.error("CREATE ERROR:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  //GET
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
        const categories = String(req.query.category)
          .split(",")
          .filter(Boolean);
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
      return res.status(200).json({ success: true, data: products });
    } catch (err: any) {
      console.error("SERVER ERROR:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  //GET SINGLE PRODUCT
  async getProductById(req: Request, res: Response): Promise<Response> {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
        isDeleted: false,
      });
      if (!product) return res.status(404).json({ success: false });
      return res.status(200).json({ success: true, data: product });
    } catch (err: any) {
      return res.status(500).json({ success: false });
    }
  }

  //UPDATE PRODUCT
  async updateProduct(req: Request, res: Response): Promise<Response> {
    try {
      const product = await Product.findOneAndUpdate(
        {
          _id: req.params.id,
          isDeleted: false,
        },

        req.body,
        { new: true },
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found or deleted",
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
        message: err.message,
      });
    }
  }

  //SOFT DELETE
  async softDeleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
      );

      return res.json({ success: true, message: "Moved to trash" });
    } catch {
      return res.status(500).json({ success: false });
    }
  }

  //TRASH
  async getTrashProducts(req: Request, res: Response): Promise<Response> {
    try {
      const products = await Product.find({ isDeleted: true });
      return res.json({ success: true, data: products });
    } catch {
      return res.status(500).json({ success: false });
    }
  }

  //RESTORE
  async restoreProduct(req: Request, res: Response): Promise<Response> {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        isDeleted: false,
        deletedAt: null,
      });

      return res.json({ success: true, message: "Restored successfully" });
    } catch {
      return res.status(500).json({ success: false });
    }
  }

  //DELETE PRODUCT
  async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false });
    }
  }
}

export default new ProductApiController();
