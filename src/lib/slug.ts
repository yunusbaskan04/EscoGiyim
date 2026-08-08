/**
 * Converts strings to SEO-friendly slugs with full support for Turkish characters.
 * Example: "Esco Giyim Okul Kıyafetleri!" -> "esco-giyim-okul-kiyafetleri"
 */
export function slugify(text: string): string {
  if (!text) return '';

  const turkishCharMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  };

  const converted = text
    .split('')
    .map((char) => turkishCharMap[char] || char)
    .join('');

  return converted
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric except whitespace & hyphen
    .replace(/[\s_-]+/g, '-') // collapse whitespace and underscores into single hyphens
    .replace(/^-+|-+$/g, '');  // trim hyphens
}

/**
 * Ensures slug uniqueness by checking against existing database records.
 * Appends a numeric suffix (-1, -2, etc.) if a duplicate exists.
 */
export async function generateUniqueSlug(
  baseName: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slugify(baseName) || 'item';
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
