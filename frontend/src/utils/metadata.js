/**
 * NFT Metadata Service
 * Handles fetching, caching, and managing NFT metadata
 */

import { ipfsToHttp, fetchMetadata, validateMetadata, generatePlaceholderMetadata } from './ipfs';

// In-memory cache
const metadataCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Cache entry structure
 */
class CacheEntry {
  constructor(data) {
    this.data = data;
    this.timestamp = Date.now();
  }
  
  isValid() {
    return Date.now() - this.timestamp < CACHE_TTL;
  }
}

/**
 * Get metadata for a single token
 */
export async function getTokenMetadata(baseUri, tokenId, options = {}) {
  const { useCache = true, forceRefresh = false } = options;
  
  const cacheKey = `${baseUri}:${tokenId}`;
  
  // Check cache
  if (useCache && !forceRefresh) {
    const cached = metadataCache.get(cacheKey);
    if (cached && cached.isValid()) {
      return cached.data;
    }
  }
  
  try {
    const uri = `${baseUri.replace(/\/$/, '')}/${tokenId}`;
    const metadata = await fetchMetadata(uri);
    
    // Validate and enrich metadata
    const enriched = enrichMetadata(metadata, tokenId);
    
    // Cache the result
    if (useCache) {
      metadataCache.set(cacheKey, new CacheEntry(enriched));
    }
    
    return enriched;
  } catch (error) {
    console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
    
    // Return placeholder on error
    return generatePlaceholderMetadata(tokenId);
  }
}

/**
 * Get metadata for multiple tokens
 */
export async function getBatchMetadata(baseUri, tokenIds, options = {}) {
  const { concurrency = 5 } = options;
  
  const results = new Map();
  
  // Process in batches to avoid overwhelming the network
  for (let i = 0; i < tokenIds.length; i += concurrency) {
    const batch = tokenIds.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((tokenId) => getTokenMetadata(baseUri, tokenId, options))
    );
    
    batchResults.forEach((result, index) => {
      const tokenId = batch[index];
      if (result.status === 'fulfilled') {
        results.set(tokenId, result.value);
      } else {
        results.set(tokenId, generatePlaceholderMetadata(tokenId));
      }
    });
  }
  
  return results;
}

/**
 * Enrich metadata with computed properties
 */
export function enrichMetadata(metadata, tokenId) {
  if (!metadata) {
    return generatePlaceholderMetadata(tokenId);
  }
  
  const enriched = {
    ...metadata,
    tokenId,
    imageUrl: ipfsToHttp(metadata.image),
    animationUrl: metadata.animation_url ? ipfsToHttp(metadata.animation_url) : null,
  };
  
  // Compute rarity if attributes exist
  if (metadata.attributes && Array.isArray(metadata.attributes)) {
    enriched.attributeCount = metadata.attributes.length;
    enriched.formattedAttributes = formatAttributes(metadata.attributes);
  }
  
  return enriched;
}

/**
 * Format attributes for display
 */
export function formatAttributes(attributes) {
  if (!Array.isArray(attributes)) return [];
  
  return attributes.map((attr) => ({
    traitType: attr.trait_type || attr.traitType || 'Unknown',
    value: formatAttributeValue(attr.value, attr.display_type),
    displayType: attr.display_type || 'string',
    rarity: attr.rarity || null,
  }));
}

/**
 * Format attribute value based on display type
 */
export function formatAttributeValue(value, displayType) {
  if (value === undefined || value === null) return 'None';
  
  switch (displayType) {
    case 'number':
      return Number(value).toLocaleString();
    case 'boost_percentage':
      return `+${value}%`;
    case 'boost_number':
      return `+${value}`;
    case 'date':
      return new Date(value * 1000).toLocaleDateString();
    default:
      return String(value);
  }
}

/**
 * Calculate rarity score based on attributes
 */
export function calculateRarityScore(attributes, collectionTraits) {
  if (!attributes || !collectionTraits) return 0;
  
  let score = 0;
  
  for (const attr of attributes) {
    const traitType = attr.trait_type || attr.traitType;
    const value = attr.value;
    
    const traitInfo = collectionTraits[traitType];
    if (traitInfo && traitInfo.values && traitInfo.values[value]) {
      // Rarity = 1 / (count / total)
      const rarity = traitInfo.total / traitInfo.values[value].count;
      score += rarity;
    }
  }
  
  return score;
}

/**
 * Get rarity tier based on score
 */
export function getRarityTier(score, thresholds = {}) {
  const {
    legendary = 100,
    epic = 50,
    rare = 25,
    uncommon = 10,
  } = thresholds;
  
  if (score >= legendary) return 'legendary';
  if (score >= epic) return 'epic';
  if (score >= rare) return 'rare';
  if (score >= uncommon) return 'uncommon';
  return 'common';
}

/**
 * Clear metadata cache
 */
export function clearCache() {
  metadataCache.clear();
}

/**
 * Clear specific token from cache
 */
export function clearTokenCache(baseUri, tokenId) {
  const cacheKey = `${baseUri}:${tokenId}`;
  metadataCache.delete(cacheKey);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  let validCount = 0;
  let expiredCount = 0;
  
  for (const entry of metadataCache.values()) {
    if (entry.isValid()) {
      validCount++;
    } else {
      expiredCount++;
    }
  }
  
  return {
    total: metadataCache.size,
    valid: validCount,
    expired: expiredCount,
  };
}

/**
 * Prefetch metadata for token IDs
 */
export async function prefetchMetadata(baseUri, tokenIds) {
  // Use low concurrency for prefetching
  await getBatchMetadata(baseUri, tokenIds, { concurrency: 2 });
}

export default {
  getTokenMetadata,
  getBatchMetadata,
  enrichMetadata,
  formatAttributes,
  formatAttributeValue,
  calculateRarityScore,
  getRarityTier,
  clearCache,
  clearTokenCache,
  getCacheStats,
  prefetchMetadata,
};
