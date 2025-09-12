import { z } from 'zod';
import { docRegistry } from '../doc/openAPIDocumentGenerator';
import { createApiResponse } from '../doc/openAPIDocumentGenerator';
import { idSchema } from './common.schema';

const LookupSchema = z.object({
  id: z.number(),
  label: z.string(),
});

export const LookupTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  lookups: z.array(LookupSchema),
});

export const LookupListSchema = z.array(LookupTypeSchema);
