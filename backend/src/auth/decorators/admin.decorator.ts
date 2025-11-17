import { SetMetadata } from '@nestjs/common';

// Decorator to require admin role
export const Admin = () => SetMetadata('roles', ['admin']);
