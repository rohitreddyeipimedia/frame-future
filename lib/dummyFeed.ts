export interface Article {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  image_url: string;
  published_at: string;
  tags: string[];
}

export const dummyArticles: Article[] = [
  {
    id: '1',
    title: 'OpenAI Releases GPT-4 Turbo with 128K Context Window',
    summary: 'The new model features significantly improved performance, longer context understanding, and updated knowledge cutoff. Developers can now process entire documents in a single prompt.',
    source_name: 'OpenAI Blog',
    source_url: 'https://openai.com/blog',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['MODELS', 'RESEARCH']
  },
  {
    id: '2',
    title: 'Midjourney V6 Launches with Photorealistic Image Generation',
    summary: 'Latest version brings unprecedented realism, better text rendering, and more accurate prompt following. The update represents a major leap in AI image synthesis capabilities.',
    source_name: 'Midjourney',
    source_url: 'https://midjourney.com',
    image_url: 'https://images.unsplash.com/photo-1686191128892-3b37add4a934?w=800&q=80',
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    tags: ['TOOLS', 'CREATOR']
  },
  {
    id: '3',
    title: 'EU AI Act Passes Final Vote: What It Means for Developers',
    summary: 'Comprehensive AI regulation establishes risk-based categories and compliance requirements. Companies building high-risk AI systems face strict transparency obligations.',
    source_name: 'TechCrunch',
    source_url: 'https://techcrunch.com',
    image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80',
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    tags: ['LEGAL', 'BUSINESS']
  },
  {
    id: '4',
    title: 'Runway Gen-2: AI Video Generation Reaches Cinema Quality',
    summary: 'New model generates 4-second video clips with unprecedented consistency and motion quality. Filmmakers are already integrating it into pre-visualization workflows.',
    source_name: 'Runway ML',
    source_url: 'https://runwayml.com',
    image_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    tags: ['FILMMAKING', 'TOOLS']
  },
  {
    id: '5',
    title: 'Anthropic Claude 3 Shows Strong Reasoning Capabilities',
    summary: 'Benchmarks reveal impressive performance on complex reasoning tasks and long-document analysis. The model demonstrates strong capabilities in legal and scientific domains.',
    source_name: 'Anthropic',
    source_url: 'https://anthropic.com',
    image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    tags: ['MODELS', 'RESEARCH']
  },
  {
    id: '6',
    title: 'Stability AI Releases Stable Video Diffusion',
    summary: 'Open-source video generation model enables developers to build custom video applications. The release includes both image-to-video and text-to-video variants.',
    source_name: 'Stability AI',
    source_url: 'https://stability.ai',
    image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    tags: ['TOOLS', 'FILMMAKING']
  },
  {
    id: '7',
    title: 'NVIDIA H200 GPUs Promise 2x AI Training Speed',
    summary: 'New HBM3e memory configuration delivers breakthrough bandwidth for large language model training. Cloud providers are already taking pre-orders for early 2024 deployment.',
    source_name: 'NVIDIA Blog',
    source_url: 'https://blogs.nvidia.com',
    image_url: 'https://images.unsplash.com/photo-1555664424-778a69022365?w=800&q=80',
    published_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    tags: ['BUSINESS', 'RESEARCH']
  },
  {
    id: '8',
    title: 'Adobe Firefly Integrated into Creative Cloud Suite',
    summary: 'Generative AI tools now available across Photoshop, Illustrator, and Premiere Pro. Commercial-safe training data addresses enterprise copyright concerns.',
    source_name: 'Adobe Blog',
    source_url: 'https://blog.adobe.com',
    image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    published_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    tags: ['CREATOR', 'TOOLS']
  },
  {
    id: '9',
    title: 'Google DeepMind AlphaFold 3 Predicts All Biomolecules',
    summary: 'Major expansion predicts structures of DNA, RNA, and small molecules alongside proteins. Breakthrough expected to accelerate drug discovery significantly.',
    source_name: 'DeepMind',
    source_url: 'https://deepmind.google',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    published_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    tags: ['RESEARCH', 'MODELS']
  },
  {
    id: '10',
    title: 'Microsoft Copilot Pro Launches for Power Users',
    summary: '$20/month subscription brings GPT-4 Turbo access and custom GPT creation to individuals. Integration spans Office 365, Windows, and Edge browser.',
    source_name: 'Microsoft',
    source_url: 'https://blogs.microsoft.com',
    image_url: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80',
    published_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    tags: ['BUSINESS', 'TOOLS']
  }
];
