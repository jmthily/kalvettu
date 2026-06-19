/**
 * Tamil Marabu product registry — backend mirror of frontend platform/products.
 * @see docs/tamilmarabu-platform-architecture.md
 */

export type ProductId =
  | 'kalvettu'
  | 'smaranam'
  | 'memories'
  | 'recipes'
  | 'rituals'
  | 'bridge'
  | 'matrimony';

/** Modules reused across heritage / memorial products */
export const SHARED_HERITAGE_MODULES = [
  'auth',
  'profiles',
  'people',
  'invites',
  'contributors',
  'stories',
  'media',
  's3',
  'ses',
] as const;

export const PRODUCT_TABLE_PREFIX: Record<ProductId, string> = {
  kalvettu: 'Kalvettu',
  smaranam: 'Kalvettu', // interim: same tables until Smaranam split
  memories: 'TamilMarabuMemories',
  recipes: 'TamilMarabuRecipes',
  rituals: 'TamilMarabuRituals',
  bridge: 'TamilMarabuBridge',
  matrimony: 'TamilMarabuMatrimony',
};
