import { PartialType } from '@nestjs/mapped-types';
import { Address, EditableUserInformations } from '../entities/user.entity';
import { IsEmail, IsMobilePhone, IsString, IsObject, IsOptional, IsNotEmpty, registerDecorator, ValidationOptions, ValidationArguments  } from 'class-validator';

function AtLeastOne(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { object }: { object: any } = args;
          return (
            !!object['email'] ||
            !!object['name'] ||
            !!object['telephone'] ||
            !!object['address']
          );
        },
      },
    });
  };
}

type create<T> = {}

export class UpdateUserDto extends PartialType(EditableUserInformations) {
	@IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsMobilePhone()
  telephone?: string;

  @IsOptional()
  @IsObject()
  address?: create<Address>;

  @AtLeastOne({ message: 'At least one field (email, name, telephone, address) is required' })
  atLeastOne: string;
}

