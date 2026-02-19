import fs from 'fs';
import path from 'path';

// Define the content directory
const contentDirectory = path.join(process.cwd(), 'lib/content');

export interface Article {
    slug: string;
    title: string;
    description: string;
    category: string;
    order: number;
    content: string;
}

export function getAllArticles(): Article[] {
    if (!fs.existsSync(contentDirectory)) return [];

    const fileNames = fs.readdirSync(contentDirectory);
    const allArticlesData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Parse Frontmatter manually (simple regex)
        const titleMatch = fileContents.match(/title: "(.*?)"/);
        const descMatch = fileContents.match(/description: "(.*?)"/);
        const catMatch = fileContents.match(/category: "(.*?)"/);
        const orderMatch = fileContents.match(/order: (\d+)/);

        const title = titleMatch ? titleMatch[1] : slug;
        const description = descMatch ? descMatch[1] : '';
        const category = catMatch ? catMatch[1] : 'General';
        const order = orderMatch ? parseInt(orderMatch[1]) : 99;

        // Remove frontmatter from content
        const content = fileContents.replace(/---[\s\S]*?---/, '').trim();

        return {
            slug,
            title,
            description,
            category,
            order,
            content,
        };
    });

    // Sort by order
    return allArticlesData.sort((a, b) => a.order - b.order);
}

export function getArticleBySlug(slug: string): Article | null {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse Frontmatter
    const titleMatch = fileContents.match(/title: "(.*?)"/);
    const descMatch = fileContents.match(/description: "(.*?)"/);
    const catMatch = fileContents.match(/category: "(.*?)"/);
    const orderMatch = fileContents.match(/order: (\d+)/);

    const title = titleMatch ? titleMatch[1] : slug;
    const description = descMatch ? descMatch[1] : '';
    const category = catMatch ? catMatch[1] : 'General';
    const order = orderMatch ? parseInt(orderMatch[1]) : 99;

    const content = fileContents.replace(/---[\s\S]*?---/, '').trim();

    return {
        slug,
        title,
        description,
        category,
        order,
        content,
    };
}
