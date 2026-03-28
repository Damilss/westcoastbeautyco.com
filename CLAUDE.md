@AGENTS.md

---

# Context 

## Overview
This is a comprehensive transfer of front end website from shopify being converted to a nextjs framed website combined with framer motion dependencies in order to replicate some features from the original website. The current website is hosted at (westcoastbeautyco.com)[westcoastbeautyco.com]. The key main difference is that the website will not be used as a store front anymore, but rather simply a promotional website where potential clients can learn about the business. 

- Nextjs in `./` 
- Shopify in `./references/working-site`

## REFERENCES 
In `./references/working-site`, there is the full working site pulled from the shopify Admin panel including assets, config, layout, locales, sections, snippets and templates - all in folders. However all of the user inputted images are in the `./public` folder. The assets did not include the user-inputted photos.
`/assets` will contain most of the information needed in order to transfer the website over to the nextjs framework. All/most of the CSS files are in /assets, and will be needed.

---

# Rules

- Do not break existing code
- Prefer minimal changes
- Explain before large edits
- Keep files clean and modular