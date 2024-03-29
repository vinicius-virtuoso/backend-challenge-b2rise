import {
  ICartItemsRequest,
  ICartItemsResponse,
} from "@/app/interfaces/carts-items-interfaces";
import { CartsItemsRepository } from "@/app/repositories/carts-items";
import { productsMemory } from "./in-memory-products-repository";
import { randomUUID } from "node:crypto";

export interface ICartItemsResponseWithCartId extends ICartItemsResponse {
  cart_id: string;
}

export let cart_itemsMemory: ICartItemsResponseWithCartId[] = [];

export class InMemoryCartsItemsRepository implements CartsItemsRepository {
  cart_items: ICartItemsResponseWithCartId[] = [];

  constructor() {
    this.cart_items = cart_itemsMemory;
  }

  async create(data: ICartItemsRequest): Promise<void> {
    const foundProduct = productsMemory.find(
      (product) => product.id === data.product.id
    );
    if (foundProduct) {
      const cartItem = {
        ...data,
        cart_id: data.cartId,
        product: foundProduct,
        id: randomUUID(),
      };
      this.cart_items.push(cartItem);
    }
  }
  async get(
    cartId: string,
    productId: string
  ): Promise<ICartItemsResponse | null> {
    const cartItemFind = this.cart_items.find(
      (item) => item.cart_id === cartId && item.product.id === productId
    );

    if (!cartItemFind) {
      return null;
    }

    return cartItemFind;
  }
  async update(
    cartItemsId: string,
    cartId: string,
    productId: string,
    quantity: number
  ): Promise<void> {
    const cartItemFind = this.cart_items.find(
      (item) =>
        item.cart_id === cartId &&
        item.product.id === productId &&
        item.id === cartItemsId
    );

    if (cartItemFind) {
      cartItemFind.quantity = quantity ?? cartItemFind.quantity;
    }
  }
  async remove(
    cartItemsId: string,
    cartId: string,
    productId: string
  ): Promise<void> {
    cart_itemsMemory = [
      ...this.cart_items.filter((item) => {
        if (
          item.id !== cartItemsId &&
          item.product.id !== productId &&
          item.cart_id === cartId
        ) {
          return item;
        }
      }),
    ];
  }
  async delete(cartId: string): Promise<void> {
    cart_itemsMemory = [
      ...this.cart_items.filter((item) => item.cart_id !== cartId),
    ];
  }
}
