/**
 * Minimal admin CLI for content-product mappings.
 * Usage: npm run admin:content-products -- <command> [args]
 *
 * Commands:
 *   for-content <content_id>         List products linked to content
 *   for-product <product_id>         List content linked to product
 *   link <content_id> <product_id> [placement] [display_order] [custom_affiliate_url]
 *   unlink <content_id> <product_id>
 *   update <mapping_id> <field=value> [field=value ...]
 *   set <content_id> <json_array>    Replace all product links for content
 */

import {
  getProductsForContent,
  getContentForProduct,
  linkProductToContent,
  unlinkProductFromContent,
  updateContentProduct,
  setProductsForContent,
} from '../lib/dal/content-products.js';
import type { ContentProductUpdate } from '../types/index.js';

const [, , command, ...args] = process.argv;

function parseUpdates(pairs: string[]): ContentProductUpdate {
  const update: Record<string, string | number> = {};
  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) {
      console.error(`Invalid field=value pair: ${pair}`);
      process.exit(1);
    }
    const key = pair.slice(0, eqIdx);
    const val = pair.slice(eqIdx + 1);
    if (!isNaN(Number(val)) && val !== '') update[key] = Number(val);
    else update[key] = val;
  }
  return update as unknown as ContentProductUpdate;
}

async function main() {
  switch (command) {
    case 'for-content': {
      const items = await getProductsForContent(args[0]);
      console.table(items);
      break;
    }
    case 'for-product': {
      const items = await getContentForProduct(args[0]);
      console.table(items);
      break;
    }
    case 'link': {
      const [content_id, product_id, placement, display_order, custom_affiliate_url] = args;
      if (!content_id || !product_id) {
        console.error('Usage: link <content_id> <product_id> [placement] [display_order] [custom_affiliate_url]');
        process.exit(1);
      }
      const item = await linkProductToContent({
        content_id,
        product_id,
        placement: placement ?? null,
        display_order: display_order ? Number(display_order) : 0,
        custom_affiliate_url: custom_affiliate_url ?? null,
      });
      console.log('Linked:', item);
      break;
    }
    case 'unlink': {
      await unlinkProductFromContent(args[0], args[1]);
      console.log('Unlinked.');
      break;
    }
    case 'update': {
      const id = args[0];
      const updates = parseUpdates(args.slice(1));
      const item = await updateContentProduct(id, updates);
      console.log('Updated:', item);
      break;
    }
    case 'set': {
      if (!args[0] || !args[1]) {
        console.error('Usage: set <content_id> \'[{"product_id":"...","placement":"...","display_order":0}]\'');
        process.exit(1);
      }
      const products = JSON.parse(args[1]);
      const items = await setProductsForContent(args[0], products);
      console.table(items);
      break;
    }
    default:
      console.log('Commands: for-content <id> | for-product <id> | link <cid> <pid> [placement] [order] [url] | unlink <cid> <pid> | update <id> <k=v...> | set <cid> <json>');
  }
}

main().catch(console.error);
