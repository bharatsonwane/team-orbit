import { z } from 'zod';
import { docRegistry } from '../openApiDocs/openAPIDocumentGenerator';
import { createApiResponse } from '../openApiDocs/openAPIDocumentGenerator';
import { idSchema } from './common.schema';

const lookupSchema = z.object({
  id: z.number(),
  label: z.string(),
});

export type LookupSchema = z.infer<typeof lookupSchema>;

export const lookupTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  lookups: z.array(lookupSchema),
});

export const lookupListSchema = z.array(lookupTypeSchema);
