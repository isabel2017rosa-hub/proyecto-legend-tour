import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'HotelRestaurantExclusive', async: false })
export class HotelRestaurantExclusiveConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const obj: any = args.object;
    // Válido cuando NO están presentes ambos a la vez
    return !(obj?.hotelId && obj?.restaurantId);
  }

  defaultMessage(): string {
    return 'No puede asociar simultáneamente un hotel y un restaurante.';
  }
}

export function HotelRestaurantExclusive(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'HotelRestaurantExclusive',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: HotelRestaurantExclusiveConstraint,
    });
  };
}
