import { CartsItemsRepository } from "@/app/repositories/carts-items";
import { CartsRepository } from "@/app/repositories/carts-repository";
import { ProductsRepository } from "@/app/repositories/products-repository";

export const cartAddProduct = async (
  userId: string,
  productId: string,
  cartsRepository: CartsRepository,
  productsRepository: ProductsRepository,
  cartsItemsRepository: CartsItemsRepository
) => {
  // Este serviço exatamente as seguintes ações:
  // [x] Verifica se existe o produto no carrinho, caso já tenha-o ele irá apenas atualizar a quantidade.
  // [x] Caso não aja o produto no carrinho ele irá adiciona-lo com uma quantidade de apenas 1.
  // [x] Em qualquer um dos dois casos ele irá atualizará o contagem de todos os produtos levando em conta a quantidade de cada produto e o preço
  // multiplicado pela quantidade.

  let cart = await cartsRepository.get(userId);
  let count = 0;
  let total = 0;

  if (cart) {
    const productInCart = await cartsItemsRepository.get(cart.id, productId);

    if (productInCart) {
      await cartsItemsRepository.update(
        productInCart.id,
        cart.id,
        productId,
        productInCart.quantity + 1
      );
      cart = await cartsRepository.get(userId);

      if (cart) {
        count = cart.products.reduce((acc, att) => {
          return acc + att.quantity;
        }, 0);

        total = cart.products.reduce((acc, att) => {
          return acc + att.product.price * att.quantity;
        }, 0);

        return await cartsRepository.update(cart.id, { count, total });
      }
    }

    const product = await productsRepository.findById(productId);
    if (product) {
      if (cart) {
        await cartsItemsRepository.create({
          cartId: cart.id,
          product,
          quantity: 1,
        });
      }

      cart = await cartsRepository.get(userId);
      if (cart) {
        count = cart.products.reduce((acc, att) => {
          return acc + att.quantity;
        }, 0);

        total = cart.products.reduce((acc, att) => {
          return acc + att.product.price * att.quantity;
        }, 0);

        return cartsRepository.update(cart.id, { count, total });
      }
    }
  }
};
