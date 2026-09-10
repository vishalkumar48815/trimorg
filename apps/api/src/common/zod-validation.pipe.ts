import {
  BadRequestException,
  Injectable,
  PipeTransform,
  type ArgumentMetadata,
} from '@nestjs/common';
import type { ZodTypeAny, ZodError } from 'zod';

interface ZodSchemaHost {
  schema: ZodTypeAny;
}

function isZodSchemaHost(value: unknown): value is ZodSchemaHost {
  return typeof value === 'function' && 'schema' in value;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (!metadata.metatype || !isZodSchemaHost(metadata.metatype)) {
      return value;
    }

    try {
      return metadata.metatype.schema.parse(value);
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as ZodError;
        throw new BadRequestException({
          code: 'ValidationError',
          message: 'Validation failed.',
          details: {
            issues: zodError.issues.map((issue) => ({
              path: issue.path.join('.'),
              message: issue.message,
            })),
          },
        });
      }

      throw error;
    }
  }
}
