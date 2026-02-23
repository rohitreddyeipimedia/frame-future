#!/usr/bin/env ts-node

/**
 * Backfill script to populate the database with historical articles
 * Usage: npx ts-node scripts/backfill.ts [target_count] [backfill_days]
 */

const TARGET_COUNT = parseInt(process.argv[2] || '300', 10);
const BACKFILL_DAYS = parseInt(process.argv[3] || '120', 10);
const INGEST_SECRET = process.env.INGEST_SECRET || 'your-ingest-secret';
const API_URL = process.env.API_URL || 'http://localhost:3000';

async function getArticleCount(): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/api/feed?window=all&limit=1`);
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Failed to get article count:', error);
    return 0;
  }
}

async function runIngestion(backfillDays: number): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_URL}/api/ingest?backfill_days=${backfillDays}&max_per_source=50`,
      {
        method: 'POST',
        headers: {
          'x-ingest-secret': INGEST_SECRET,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Ingestion failed:', error);
      return false;
    }

    const result = await response.json();
    console.log('Ingestion result:', {
      inserted: result.total_inserted,
      skipped: result.total_skipped,
      sources: result.results.length,
    });

    return result.total_inserted > 0;
  } catch (error) {
    console.error('Ingestion error:', error);
    return false;
  }
}

async function main() {
  console.log(`Starting backfill to ${TARGET_COUNT} articles...`);
  console.log(`Using backfill window: ${BACKFILL_DAYS} days`);

  let currentCount = await getArticleCount();
  console.log(`Current article count: ${currentCount}`);

  if (currentCount >= TARGET_COUNT) {
    console.log(`Target already reached! (${currentCount} >= ${TARGET_COUNT})`);
    return;
  }

  let attempts = 0;
  const maxAttempts = 10;

  while (currentCount < TARGET_COUNT && attempts < maxAttempts) {
    attempts++;
    console.log(`\n--- Attempt ${attempts}/${maxAttempts} ---`);
    console.log(`Current count: ${currentCount}, Target: ${TARGET_COUNT}`);

    const success = await runIngestion(BACKFILL_DAYS);
    if (!success) {
      console.log('No new articles inserted in this attempt');
    }

    // Wait a bit between attempts
    await new Promise(resolve => setTimeout(resolve, 2000));

    currentCount = await getArticleCount();
  }

  console.log(`\n=== Backfill Complete ===`);
  console.log(`Final article count: ${currentCount}`);
  console.log(`Target was: ${TARGET_COUNT}`);

  if (currentCount < TARGET_COUNT) {
    console.log('Warning: Target not reached after maximum attempts');
    process.exit(1);
  }
}

main().catch(console.error);
