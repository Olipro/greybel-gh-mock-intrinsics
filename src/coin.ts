import {
  CustomFunction,
  CustomList,
  CustomString,
  CustomValue,
  DefaultType,
  OperationContext
} from 'greybel-interpreter';
import { MockEnvironment, Type } from 'greybel-mock-environment';

import GreyMap from './grey-map';
import BasicInterface from './interface';
import { create as createSubWallet } from './sub-wallet';

export interface CoinVariables {
  mockEnvironment: MockEnvironment;
  user: Type.User;
  computer: Type.Device;
}

export class Coin extends BasicInterface {
  static readonly type: string = 'coin';
  static readonly isa: GreyMap = new GreyMap([
    CustomFunction.createExternalWithSelf(
      'set_cycle_mining',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    ),
    CustomFunction.createExternalWithSelf(
      'get_cycle_mining',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    ),
    CustomFunction.createExternalWithSelf(
      'get_reward',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    ),
    CustomFunction.createExternalWithSelf(
      'set_reward',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    ),
    CustomFunction.createExternalWithSelf(
      'transaction',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    ),
    CustomFunction.createExternalWithSelf(
      'create_subwallet',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    ),
    CustomFunction.createExternalWithSelf(
      'get_subwallet',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        const self = Coin.retreive(args);

        if (self === null) {
          return Promise.resolve(DefaultType.Void);
        }

        const { mockEnvironment, user, computer } = self.variables;
        return Promise.resolve(
          createSubWallet(mockEnvironment, user, computer)
        );
      }
    ),
    CustomFunction.createExternalWithSelf(
      'get_subwallets',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        const self = Coin.retreive(args);

        if (self === null) {
          return Promise.resolve(DefaultType.Void);
        }

        const { mockEnvironment, user, computer } = self.variables;
        return Promise.resolve(
          new CustomList([createSubWallet(mockEnvironment, user, computer)])
        );
      }
    ),
    CustomFunction.createExternalWithSelf(
      'set_address',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    ),
    CustomFunction.createExternalWithSelf(
      'get_address',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    ),
    CustomFunction.createExternalWithSelf(
      'get_mined_coins',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('Not yet supported'));
      }
    )
  ]);

  static retreive(args: Map<string, CustomValue>): Coin | null {
    const intf = args.get('self');
    if (intf instanceof Coin) {
      return intf;
    }
    return null;
  }

  variables: CoinVariables;

  constructor(variables: CoinVariables) {
    super(Coin.type, Coin.isa);
    this.variables = variables;
  }
}

export function create(
  mockEnvironment: MockEnvironment,
  user: Type.User,
  computer: Type.Device
): BasicInterface {
  const itrface = new Coin({
    mockEnvironment,
    user,
    computer
  });

  return itrface;
}
