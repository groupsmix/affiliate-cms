/**
 * Minimal admin CLI for content.
 * Usage: npm run admin:content -- <command> [args]
 *
 * Commands:
 *   list [--status=draft|review|published] [--type=best|review|...] [--category=ID] [--featured] [--lang=ar]
 *   get <id>
 *   get-by-slug <slug>
 *   create <json>
 *   update <id> <field=value> [field=value ...]
 *   delete <id>
 *   publish <id>
 *   unpublish <id>
 *   set-status <id> <draft|review|published>
 *   published
 *   featured
 *   by-category <category_id>
 */

import {
  listContent,
  getContentById,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  publishContent,
  unpublishContent,
  setContentStatus,
  getPublishedContent,
  getFeaturedContent,
  getContentByCategory,
} from '../lib/dal/content.js';
import type { ContentFilters, ContentStatus, ContentType, ContentUpdate } from '../types/index.js';

const [, , command, ...args] = process.argv;

function parseFilters(flags: string[]): ContentFilters {
  const filters: ContentFilters = {};
  for (const flag of flags) {
    if (flag.startsWith('--status=')) filters.status = flag.split('=')[1] as ContentStatus;
    if (flag.startsWith('--type=')) filters.content_type = flag.split('=')[1] as ContentType;
    if (flag.startsWith('--category=')) filters.category_id = flag.split('=')[1];
    if (flag === '--featured') filters.is_featured = true;
    if (flag.startsWith('--lang=')) filters.language = flag.split('=')[1];
  }
  return filters;
}

function parseUpdates(pairs: string[]): ContentUpdate {
  const update: Record<string, string | number | boolean> = {};
  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) {
      console.error(`Invalid field=value pair: ${pair}`);
      process.exit(1);
    }
    const key = pair.slice(0, eqIdx);
    const val = pair.slice(eqIdx + 1);
    if (val === 'true') update[key] = true;
    else if (val === 'false') update[key] = false;
    else if (!isNaN(Number(val)) && val !== '') update[key] = Number(val);
    else update[key] = val;
  }
  return update as unknown as ContentUpdate;
}

async function main() {
  switch (command) {
    case 'list': {
      const items = await listContent(parseFilters(args));
      console.table(items.map(c => ({
        id: c.id, title: c.title, slug: c.slug, type: c.content_type, status: c.status, lang: c.language,
      })));
      break;
    }
    case 'get': {
      const item = await getContentById(args[0]);
      console.log(item ?? 'Not found');
      break;
    }
    case 'get-by-slug': {
      const item = await getContentBySlug(args[0]);
      console.log(item ?? 'Not found');
      break;
    }
    case 'create': {
      if (!args[0]) {
        console.error('Usage: create \'{"title":"...","slug":"...","content_type":"best|review|..."}\'');
        process.exit(1);
      }
      const input = JSON.parse(args[0]);
      const item = await createContent(input);
      console.log('Created:', item);
      break;
    }
    case 'update': {
      const id = args[0];
      const updates = parseUpdates(args.slice(1));
      const item = await updateContent(id, updates);
      console.log('Updated:', item);
      break;
    }
    case 'delete': {
      await deleteContent(args[0]);
      console.log('Deleted.');
      break;
    }
    case 'publish': {
      const item = await publishContent(args[0]);
      console.log('Published:', item);
      break;
    }
    case 'unpublish': {
      const item = await unpublishContent(args[0]);
      console.log('Unpublished:', item);
      break;
    }
    case 'set-status': {
      const item = await setContentStatus(args[0], args[1] as ContentStatus);
      console.log('Status updated:', item);
      break;
    }
    case 'published': {
      const items = await getPublishedContent();
      console.table(items.map(c => ({ id: c.id, title: c.title, slug: c.slug })));
      break;
    }
    case 'featured': {
      const items = await getFeaturedContent();
      console.table(items.map(c => ({ id: c.id, title: c.title, slug: c.slug })));
      break;
    }
    case 'by-category': {
      const items = await getContentByCategory(args[0]);
      console.table(items.map(c => ({ id: c.id, title: c.title, slug: c.slug })));
      break;
    }
    default:
      console.log('Commands: list | get | get-by-slug | create | update | delete | publish | unpublish | set-status | published | featured | by-category');
  }
}

main().catch(console.error);
