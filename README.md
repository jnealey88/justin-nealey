# Justin Nealey

Portfolio and project showcase. Principal Product Manager at GoDaddy, vibe coder, creator of DesignSetGo.

Built with [Astro](https://astro.build).

## Running Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Adding a Project

Add an entry to `src/data/projects.ts` — the site generates project cards automatically. Each project needs a title, description, tags, tech stack, and graphic configuration. If the project has a canvas animation, add the draw function to `src/components/ProjectCanvases.astro`.

## Structure

```text
src/
  layouts/Layout.astro        Base HTML shell
  pages/index.astro           Main page composing all sections
  components/
    Nav.astro                 Navigation with scroll behavior
    Hero.astro                Hero section with particle canvas
    About.astro               About section with counting animation
    Marquee.astro             Scrolling keyword ticker
    Projects.astro            Projects section (renders ProjectCard list)
    ProjectCard.astro         Data-driven project card component
    ProjectCanvases.astro     All project card canvas animations
    Contact.astro             Contact section
    Footer.astro              Footer (auto-updates year)
    CustomCursor.astro        Custom cursor effect
    ScrollReveal.astro        Intersection observer reveal animations
  data/projects.ts            Project data array
  styles/global.css           All styles
```
