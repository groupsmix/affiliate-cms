/**
 * Minimal admin CLI for categories.
 * Usage: npm run admin:categories -- <command> [args]
 *
 * Commands:
 *   list
 *   get <id>
 *   get-by-slug <slug>
 *   create <name> <slug> [description]
 *   update <id> <field=value> [field=value ...]
 *   delete <id>
 */

import {
  listCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../lib/dal/categories.js';
import type { CategoryUpdate } from '../types/index.js';

const [, , command, ...args] = process.argv;

function parseUpdates(pairs: string[]): CategoryUpdate {
  const update: Record<string, string> = {};
  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) {
      console.error(`Invalid field=value pair: ${pair}`);
      process.exit(1);
    }
    update[pair.slice(0, eqIdx)] = pair.slice(eqIdx + 1);
  }
  return update as unknown as CategoryUpdate;
}

async function main() {
  switch (command) {
    case 'list': {
      const categories = await listCategories();
      console.table(categories);
      break;
    }
    case 'get': {
      const cat = await getCategoryById(args[0]);
      console.log(cat ?? 'Not found');
      break;
    }
    case 'get-by-slug': {
      const cat = await getCategoryBySlug(args[0]);
      console.log(cat ?? 'Not found');
      break;
    }
    case 'create': {
      const [name, slug, description] = args;
      if (!name || !slug) {
        console.error('Usage: create <name> <slug> [description]');
        process.exit(1);
      }
      const cat = await createCategory({ name, slug, description: description ?? null });
      console.log('Created:', cat);
      break;
    }
    case 'update': {
      const id = args[0];
      const updates = parseUpdates(args.slice(1));
      const cat = await updateCategory(id, updates);
      console.log('Updated:', cat);
      break;
    }
    case 'delete': {
      await deleteCategory(args[0]);
      console.log('Deleted.');
      break;
    }
    default:
      console.log('Commands: list | get <id> | get-by-slug <slug> | create <name> <slug> [desc] | update <id> <field=value...> | delete <id>');
  }
}

main().catch(console.error);
