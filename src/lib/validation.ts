const CONTENT_TYPES = ['best', 'review', 'comparison', 'problem', 'alternative'] as const;
const CONTENT_STATUSES = ['draft', 'review', 'published'] as const;
const PLACEMENTS = ['hero', 'sidebar', 'inline', 'footer'] as const;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}

function fail(field: string, message: string): ValidationError {
  return { field, message };
}

export function validateCreateContent(formData: FormData): ValidationResult {
  const errors: ValidationError[] = [];

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    errors.push(fail('title', 'Title is required'));
  } else if (title.length > 500) {
    errors.push(fail('title', 'Title must be under 500 characters'));
  }

  const slug = (formData.get('slug') as string)?.trim();
  if (!slug) {
    errors.push(fail('slug', 'Slug is required'));
  } else if (!SLUG_RE.test(slug)) {
    errors.push(fail('slug', 'Slug must contain only lowercase letters, numbers, and hyphens'));
  } else if (slug.length > 200) {
    errors.push(fail('slug', 'Slug must be under 200 characters'));
  }

  const contentType = formData.get('content_type') as string;
  if (!contentType || !(CONTENT_TYPES as readonly string[]).includes(contentType)) {
    errors.push(fail('content_type', `Content type must be one of: ${CONTENT_TYPES.join(', ')}`));
  }

  const categoryId = formData.get('category_id') as string;
  if (categoryId && !UUID_RE.test(categoryId)) {
    errors.push(fail('category_id', 'Invalid category ID'));
  }

  const primaryKeyword = (formData.get('primary_keyword') as string)?.trim();
  if (primaryKeyword && primaryKeyword.length > 200) {
    errors.push(fail('primary_keyword', 'Primary keyword must be under 200 characters'));
  }

  return { ok: errors.length === 0, errors };
}

export function validateUpdateContent(formData: FormData): ValidationResult {
  const errors: ValidationError[] = [];

  const metaTitle = (formData.get('meta_title') as string)?.trim();
  if (metaTitle && metaTitle.length > 200) {
    errors.push(fail('meta_title', 'Meta title must be under 200 characters'));
  }

  const metaDescription = (formData.get('meta_description') as string)?.trim();
  if (metaDescription && metaDescription.length > 500) {
    errors.push(fail('meta_description', 'Meta description must be under 500 characters'));
  }

  return { ok: errors.length === 0, errors };
}

export function validateContentStatus(status: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!(CONTENT_STATUSES as readonly string[]).includes(status)) {
    errors.push(fail('status', `Status must be one of: ${CONTENT_STATUSES.join(', ')}`));
  }

  return { ok: errors.length === 0, errors };
}

export function validateLinkProduct(formData: FormData): ValidationResult {
  const errors: ValidationError[] = [];

  const productId = formData.get('product_id') as string;
  if (!productId || !UUID_RE.test(productId)) {
    errors.push(fail('product_id', 'Valid product selection is required'));
  }

  const placement = formData.get('placement') as string;
  if (placement && !(PLACEMENTS as readonly string[]).includes(placement)) {
    errors.push(fail('placement', `Placement must be one of: ${PLACEMENTS.join(', ')}`));
  }

  const displayOrderStr = formData.get('display_order') as string;
  if (displayOrderStr) {
    const displayOrder = parseInt(displayOrderStr, 10);
    if (isNaN(displayOrder) || displayOrder < 0) {
      errors.push(fail('display_order', 'Display order must be a non-negative number'));
    }
  }

  return { ok: errors.length === 0, errors };
}

export function validateUUID(value: string, field: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!value || !UUID_RE.test(value)) {
    errors.push(fail(field, `Invalid ${field} format`));
  }

  return { ok: errors.length === 0, errors };
}

export function formatErrors(errors: ValidationError[]): string {
  return errors.map((e) => `${e.field}: ${e.message}`).join('; ');
}
