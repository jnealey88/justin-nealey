export interface Project {
  title: string;
  description: string;
  tags: [string, string];
  tech: string[];
  graphicClass: string;
  graphicLabel: string;
  canvasId?: string;
  /** Link on the title text (opens in new tab) */
  titleLink?: string;
  /** Link wrapping the entire card (opens in new tab) */
  cardLink?: string;
  /** If true, render the DSG CSS grid instead of a canvas */
  useDsgGrid?: boolean;
}

export const projects: Project[] = [
  {
    title: 'DesignSetGo',
    description:
      'A WordPress plugin that streamlines the design-to-launch workflow, helping users go from concept to live site faster than ever.',
    tags: ['Side Project', 'WordPress Plugin'],
    tech: ['PHP', 'WordPress', 'JavaScript', 'CSS'],
    graphicClass: 'designsetgo-graphic',
    graphicLabel: 'DSG',
    titleLink: 'https://github.com/jnealey-godaddy/designsetgo/',
    useDsgGrid: true,
  },
  {
    title: 'Airo for WordPress',
    description:
      'An AI multi-agent WordPress builder that orchestrates specialized agents to design, build, and launch websites — turning a single prompt into a fully realized site.',
    tags: ['My Product', 'GoDaddy'],
    tech: ['AI Agents', 'WordPress', 'LLMs', 'Product Strategy'],
    graphicClass: 'airo-graphic',
    graphicLabel: 'AIRO',
    canvasId: 'airo-canvas',
    cardLink: 'https://www.godaddy.com/hosting/wordpress-hosting',
  },
  {
    title: 'Market Research Report',
    description:
      'An AI-powered tool on the Hub by GoDaddy Pro that helps web designers and agencies quickly research their leads — becoming instant experts before every client conversation.',
    tags: ['My Product', 'GoDaddy'],
    tech: ['AI', 'GoDaddy Pro', 'Market Research', 'Product Strategy'],
    graphicClass: 'mrr-graphic',
    graphicLabel: 'MRR',
    canvasId: 'mrr-canvas',
  },
  {
    title: 'Site RPG Block',
    description:
      'A WordPress Gutenberg block that gamifies your site — turning it into an RPG character with stats, XP leveling, and a hack & slash mini-game driven by real engagement metrics.',
    tags: ['Side Project', 'WordPress Plugin'],
    tech: ['JavaScript', 'PHP', 'React', 'WordPress'],
    graphicClass: 'rpg-graphic',
    graphicLabel: 'RPG',
    canvasId: 'rpg-canvas',
    cardLink: 'https://github.com/jnealey-godaddy/site-rpg-block',
  },
  {
    title: 'Obsidian Claude Code',
    description:
      'An Obsidian plugin that integrates Claude AI into your vault — chat with an assistant that can read, write, and edit your notes with custom Skills for specialized workflows.',
    tags: ['Side Project', 'Obsidian Plugin'],
    tech: ['TypeScript', 'Claude API', 'Obsidian', 'CSS'],
    graphicClass: 'obsidian-graphic',
    graphicLabel: '>_',
    canvasId: 'obsidian-canvas',
    cardLink: 'https://github.com/jnealey-godaddy/obsidian-claude-code',
  },
  {
    title: 'First Draft Feed',
    description:
      'A WordPress block that renders a post\'s revision history as a readable, chronological feed — each revision timestamped with visual diffs showing how the writing evolved.',
    tags: ['Side Project', 'WordPress Plugin'],
    tech: ['PHP', 'WordPress', 'JavaScript', 'REST API'],
    graphicClass: 'fdf-graphic',
    graphicLabel: 'FDF',
    canvasId: 'fdf-canvas',
    titleLink: 'https://github.com/jnealey-godaddy/first-draft-feed',
  },
  {
    title: 'Vantalyze',
    description:
      'AI-powered Opportunity Solution Trees — a product discovery tool that helps teams map outcomes to opportunities and solutions with intelligent analysis.',
    tags: ['Side Project', 'SaaS'],
    tech: ['AI', 'Product Discovery', 'OST', 'SaaS'],
    graphicClass: 'vantalyze-graphic',
    graphicLabel: 'VNT',
    canvasId: 'vantalyze-canvas',
    cardLink: 'https://vantalyze.com/',
  },
];
