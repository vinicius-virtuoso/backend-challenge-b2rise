import { ProductsRepository } from "@/app/repositories/products-repository";
import { productsByCategory } from "@/app/services/products/products-by-category";
import { productCreateService } from "@/app/services/products/products-create";
import { productDeleteService } from "@/app/services/products/products-delete";
import { productsGetAllService } from "@/app/services/products/products-get-all";
import { productGetOneService } from "@/app/services/products/products-get-one";
import { productUpdateService } from "@/app/services/products/products-update";
import { Request, Response } from "express";

export class ProductsController {
  constructor(private productsRepository: ProductsRepository) {}
  async create(req: Request, res: Response) {
    const product = await productCreateService(
      req.body,
      this.productsRepository
    );
    return res.status(201).json(product);
  }

  async findOne(req: Request, res: Response) {
    const product = await productGetOneService(
      req.params.productId,
      this.productsRepository
    );
    return res.status(200).json(product);
  }

  async findAll(req: Request, res: Response) {
    const {
      page = 1,
      take = 5,
      category,
      title,
      min_price = 1,
      max_price = 9999999,
    } = req.query;
    const products = await productsGetAllService(
      String(req.baseUrl),
      Number(page),
      Number(take),
      String(category),
      String(title),
      Number(min_price),
      Number(max_price),
      this.productsRepository
    );
    return res.status(200).json(products);
  }

  async findByCategory(req: Request, res: Response) {
    const { page = 1, take = 5 } = req.query;
    const products = await productsByCategory(
      String(req.baseUrl),
      req.params.categoryProduct,
      Number(take),
      Number(page),
      this.productsRepository
    );
    return res.status(200).json(products);
  }

  async update(req: Request, res: Response) {
    const product = await productUpdateService(
      req.params.productId,
      req.body,
      this.productsRepository
    );
    return res.status(200).json(product);
  }

  async delete(req: Request, res: Response) {
    await productDeleteService(req.params.productId, this.productsRepository);
    return res.status(204).json();
  }
}
