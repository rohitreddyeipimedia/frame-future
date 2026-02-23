import crypto from 'crypto';

export function generateHash(title: string, url: string): string {
  // Extract domain from URL
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    // Normalize title (lowercase, remove extra spaces)
    const normalizedTitle = title.toLowerCase().trim().replace(/\s+/g, ' ');
    const data = `${normalizedTitle}|${domain}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
  } catch {
    // Fallback if URL parsing fails
    const normalizedTitle = title.toLowerCase().trim().replace(/\s+/g, ' ');
    return crypto.createHash('sha256').update(normalizedTitle).digest('hex').substring(0, 32);
  }
}

export async function checkDuplicate(
  supabase: any,
  sourceUrl: string,
  hash: string
): Promise<boolean> {
  // Check if source_url exists
  const { data: urlCheck } = await supabase
    .from('articles')
    .select('id')
    .eq('source_url', sourceUrl)
    .maybeSingle();

  if (urlCheck) {
    return true;
  }

  // Check if hash exists
  const { data: hashCheck } = await supabase
    .from('articles')
    .select('id')
    .eq('hash', hash)
    .maybeSingle();

  if (hashCheck) {
    return true;
  }

  return false;
}
