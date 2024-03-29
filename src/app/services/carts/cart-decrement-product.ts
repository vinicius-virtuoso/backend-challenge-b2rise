import { CartsItemsRepository } from "@/app/repositories/carts-items";
import { CartsRepository } from "@/app/repositories/carts-repository";

export const cartDecrementProductService = async (
  userId: string,
  productId: string,
  cartsRepository: CartsRepository,
  cartsItemsRepository: CartsItemsRepository
) => {
  // Este serviço exatamente as seguintes ações:
  // [x] Irá diminuir a quantidade do produto no carrinho.
  // [x] Caso a quantidade do produto no carrinho já seja de apenas 1, irá remover aquele produto do carrinho.
  // [x] Em qualquer um dos dois casos ele irá atualizará o contagem de todos os produtos levando em conta a quantidade de cada produto e o preço
  // multiplicado pela quantidade.

  let cart = await cartsRepository.get(userId);
  let count = 0;
  let total = 0;

  if (cart) {
    const cartItem = await cartsItemsRepository.get(cart.id, productId);
    if (cartItem) {
      if (cartItem.quantity - 1 <= 0) {
        await cartsItemsRepository.remove(cartItem.id, cart.id, productId);
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

      if (cart) {
        await cartsItemsRepository.update(
          cartItem.id,
          cart.id,
          productId,
          cartItem.quantity - 1
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
    }
  }
};
