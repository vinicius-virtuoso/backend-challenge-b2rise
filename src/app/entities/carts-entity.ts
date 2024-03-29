import { randomUUID } from "node:crypto";
import { ICartResponse } from "./../interfaces/carts-interfaces";
import { ICartItemsResponse } from "../interfaces/carts-items-interfaces";
import { Replace } from "@/helpers/Replace";

export class Carts {
  private _id: string;
  private props: Omit<ICartResponse, "id">;

  constructor(
    props: Replace<
      Omit<ICartResponse, "id">,
      { products?: ICartItemsResponse[]; count?: number; total?: number }
    >,
    id?: string
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      products: props.products ?? [],
      count: props.count ?? 0,
      total: props.total ?? 0,
    };
  }

  public get id(): string {
    return this._id;
  }

  public get user_id(): string {
    return this.props.user_id;
  }

  public get total(): number {
    return this.props.total;
  }

  public get count(): number {
    return this.props.count;
  }

  public set user_id(value: string) {
    this.props.user_id = value;
  }

  public set total(value: number) {
    this.props.total = value;
  }

  public set count(value: number) {
    this.props.count = value;
  }

  public get products(): ICartItemsResponse[] {
    return this.props.products;
  }
}
