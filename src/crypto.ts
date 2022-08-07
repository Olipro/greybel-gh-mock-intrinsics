import {
  CustomFunction,
  CustomList,
  CustomNumber,
  CustomString,
  CustomValue,
  Defaults,
  OperationContext
} from 'greybel-interpreter';

import BasicInterface from './interface';
import mockEnvironment from './mock/environment';
import { Computer, File, FileType, Folder, Network, User } from './types';
import {
  getFile,
  getHomePath,
  getPermissions,
  getTraversalPath,
  putFile
} from './utils';

export function create(user: User, computer: Computer): BasicInterface {
  const itrface = new BasicInterface('crypto');

  itrface.addMethod(
    CustomFunction.createExternalWithSelf(
      'aireplay',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        const bssid = args.get('bssid').toString();
        const essid = args.get('essid').toString();
        // Not yet implemented
        // const maxAcks = args.get('maxAcks').toInt();
        const network = mockEnvironment.networks.find((item: Network) => {
          return item.bssid === bssid && item.essid === essid;
        });

        if (!network) {
          return Promise.resolve(new CustomString('No network found'));
        }

        const folder = getFile(
          computer.fileSystem,
          getHomePath(user, computer)
        ) as Folder;

        putFile(folder, {
          name: 'file.cap',
          content: network.password,
          owner: user.username,
          permissions: 'drwxr--r--',
          type: FileType.Ack
        });

        return Promise.resolve(Defaults.Void);
      }
    )
      .addArgument('bssid')
      .addArgument('essid')
      .addArgument('maxAcks', new CustomNumber(25000))
  );

  itrface.addMethod(
    CustomFunction.createExternalWithSelf(
      'airmon',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomString('start'));
      }
    )
  );

  itrface.addMethod(
    CustomFunction.createExternalWithSelf(
      'aircrack',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        const path = args.get('path').toString();
        const traversalPath = getTraversalPath(
          path,
          getHomePath(user, computer)
        );
        const file = getFile(computer.fileSystem, traversalPath) as File;

        if (!file) {
          return Promise.resolve(Defaults.Void);
        }

        const { r } = getPermissions(user, file);

        if (!r) {
          return Promise.resolve(Defaults.Void);
        }

        if (file.type !== FileType.Ack) {
          return Promise.resolve(Defaults.Void);
        }

        return Promise.resolve(new CustomString(file.content));
      }
    ).addArgument('path')
  );

  itrface.addMethod(
    CustomFunction.createExternalWithSelf(
      'decipher',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        const encryptedPass = args.get('encryptedPass').toString();
        const user = mockEnvironment.users.find((item: User) => {
          return item.passwordHashed === encryptedPass;
        });

        if (!user) {
          return Promise.resolve(Defaults.Void);
        }

        return Promise.resolve(new CustomString(user.password));
      }
    ).addArgument('encryptedPass')
  );

  itrface.addMethod(
    CustomFunction.createExternalWithSelf(
      'smtp_user_list',
      (
        _ctx: OperationContext,
        _self: CustomValue,
        _args: Map<string, CustomValue>
      ): Promise<CustomValue> => {
        return Promise.resolve(new CustomList());
      }
    )
  );

  return itrface;
}
