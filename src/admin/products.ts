/**
 * Minimal admin CLI for products.
 * Usage: npm run admin:products -- <command> [args]
 *
 * Commands:
 *   list [--category=ID] [--featured] [--active]
 *   get <id>
 *   get-by-slug <slug>
 *   create <json>
 *   update <id> <field=value> [field=value ...]
 *   delete <id>
 *   featured
 *   by-category <category_id>
 */

import {
  listProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
} from '../lib/dal/products.js';
import type { ProductFilters, ProductUpdate } from '../types/index.js';

const [, , command, ...args] = process.argv;

function parseFilters(flags: string[]): ProductFilters {
  const filters: ProductFilters = {};
  for (const flag of flags) {
    if (flag.startsWith('--category=')) filters.category_id = flag.split('=')[1];
    if (flag === '--featured') filters.is_featured = true;
    if (flag === '--active') filters.is_active = true;
  }
  return filters;
}

function parseUpdates(pairs: string[]): ProductUpdate {
  const update: Record<string, string | number | boolean> = {};
  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) {
      console.error(`Invalid field=value pair: ${pair}`);
      process.exit(1);
    }
    const key = pair.slice(0, eqIdx);
    const val = pair.slice(eqIdx + 1);
    // Simple type coercion for booleans and numbers
    if (val === 'true') update[key] = true;
    else if (val === 'false') update[key] = false;
    else if (!isNaN(Number(val)) && val !== '') update[key] = Number(val);
    else update[key] = val;
  }
  return update as unknown as ProductUpdate;
}

async function main() {
  switch (command) {
    case 'list': {
      const products = await listProducts(parseFilters(args));
      console.table(products.map(p => ({ id: p.id, name: p.name, slug: p.slug, active: p.is_active, featured: p.is_featured })));
      break;
    }
    case 'get': {
      const product = await getProductById(args[0]);
      console.log(product ?? 'Not found');
      break;
    }
    case 'get-by-slug': {
      const product = await getProductBySlug(args[0]);
      console.log(product ?? 'Not found');
      break;
    }
    case 'create': {
      if (!args[0]) {
        console.error('Usage: create \'{"name":"...","slug":"...","website_url":"...","affiliate_url":"..."}\'');
        process.exit(1);
      }
      const input = JSON.parse(args[0]);
      const product = await createProduct(input);
      console.log('Created:', product);
      break;
    }
    case 'update': {
      const id = args[0];
      const updates = parseUpdates(args.slice(1));
      const product = await updateProduct(id, updates);
      console.log('Updated:', product);
      break;
    }
    case 'delete': {
      await deleteProduct(args[0]);
      console.log('Deleted.');
      break;
    }
    case 'featured': {
      const products = await getFeaturedProducts();
      console.table(products.map(p => ({ id: p.id, name: p.name, slug: p.slug })));
      break;
    }
    case 'by-category': {
      const products = await getProductsByCategory(args[0]);
      console.table(products.map(p => ({ id: p.id, name: p.name, slug: p.slug })));
      break;
    }
    default:
      console.log('Commands: list | get <id> | get-by-slug <slug> | create <json> | update <id> <k=v...> | delete <id> | featured | by-category <id>');
  }
}

main().catch(console.error);
