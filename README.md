# nicolebusquant.fr

Site of Nicole Busquant, psychotherapist and psychoanalyst in Redon and Vannes.
Static HTML, CSS and JS: no build step and no dependencies.

## Structure

```
index.html                 Home: hero, addresses, gallery, FAQ, appointment
pages/qui-suis-je.html     Same URLs as the old site (/pages/qui-suis-je)
pages/consultations.html
legal.html                 /legal
404.html                   Served by GitHub Pages for any missing URL (absolute paths)
assets/css/style.css       Design tokens at the top (colors, fonts)
assets/js/main.js          Fade-in reveals, line drawing, lightbox, mobile menu
assets/img/                Vector logo (logo-nb.svg), favicons, optimized webp photos, og-image
assets/fonts/              Cormorant Garamond, EB Garamond, Jost (self-hosted, OFL)
medias/                    Original files (not used by the site)
```

The line illustrations (divan, book, face-to-face armchairs) are inline SVG in the pages. Each stroke carries
`pathLength="1"` so it can be "drawn" in CSS.

## Deploy on GitHub Pages

1. Push to GitHub, then *Settings → Pages → Deploy from a branch → `main` / root*.
2. Custom domain: enter `nicolebusquant.fr` in *Settings → Pages → Custom domain*
   (GitHub creates the `CNAME` file), then at the registrar:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `<user>.github.io`
   - Enable *Enforce HTTPS* once the certificate is issued.

Local preview: `python3 -m http.server` then http://localhost:8000.
