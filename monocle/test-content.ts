import { getAllArticles, getArticleBySlug } from './lib/content';

console.log('--- Testing getAllArticles ---');
const articles = getAllArticles();
console.log(`Found ${articles.length} articles.`);
articles.forEach(a => console.log(`- Slug: ${a.slug}, Title: ${a.title}`));

console.log('\n--- Testing getArticleBySlug ---');
if (articles.length > 0) {
    const slug = articles[0].slug;
    console.log(`Fetching slug: ${slug}`);
    const article = getArticleBySlug(slug);
    if (article) {
        console.log(`Success! Found: ${article.title}`);
    } else {
        console.error(`Failed to find article for slug: ${slug}`);
    }
} else {
    console.log('No articles to test getArticleBySlug');
}
