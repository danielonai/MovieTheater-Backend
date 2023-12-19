import { PrismaClient, Movie } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Middleware function for soft delete
export const softDeleteMiddleware = async (params: any, next: any) => {
  if (params.model === 'Movie') {
    if (params.action === 'delete') {
      // Change action to update and set deleted to true
      params.action = 'update';
      params.args['data'] = { deleted: true };
    }
    if (params.action === 'deleteMany') {
      // Change action to updateMany and set deleted to true
      params.action = 'updateMany';
      if (params.args.data !== undefined) {
        params.args.data['deleted'] = true;
      } else {
        params.args['data'] = { deleted: true };
      }
    }
  }
  return next(params);
};

// Apply the middleware to Prisma
prisma.$use(async (params, next) => {
  // Apply the softDeleteMiddleware for delete and deleteMany operations
  if (params.action === 'delete' || params.action === 'deleteMany') {
    return softDeleteMiddleware(params, next);
  }

  return next(params);
});