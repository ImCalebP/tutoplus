# Référencement Tuto+

Le domaine canonique est https://tutoplus.ca. Les métadonnées sont centralisées dans src/lib/seo.ts.
Les pages publiques indexables sont l’accueil, l’orthopédagogie, les conditions et la confidentialité.
Chaque page possède son propre titre, sa description et son URL canonique. Les pages de compte ont noindex.
Les aperçus Netlify (CONTEXT différent de production) ont noindex et un sitemap vide. Ne pas définir CONTEXT manuellement sur production dans les aperçus.
robots.txt laisse les pages HTML explorables pour que les moteurs puissent lire noindex. Cette directive ne remplace pas l’authentification.

## Validation après publication

- Vérifier /robots.txt et /sitemap.xml sur le domaine de production.
- Vérifier le HTML de / et /orthopedagogie : titre distinct, canonical correct, robots index.
- Vérifier /connexion, /tuteur, /admin : robots noindex.
- Vérifier un aperçu Netlify : robots noindex sur toutes les pages.
- Dans Google Search Console, vérifier la propriété du domaine et soumettre https://tutoplus.ca/sitemap.xml.
- Inspecter les deux pages commerciales et suivre impressions, clics et requêtes locales.
- Tester les données structurées avec Schema Markup Validator. Organization/Service ne garantissent pas un résultat enrichi.
- Contrôler les Core Web Vitals avec PageSpeed Insights sur mobile ; aucune mesure de performance n’est incluse dans cette modification.

Les données structurées reprennent uniquement les services, régions et coordonnées publics. Ne pas ajouter d’avis, de notes, d’adresse physique ou de certifications non vérifiés.
L’orthopédagogie en personne est décrite à Gatineau, conformément aux modalités visibles.
