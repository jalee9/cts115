/* =====================================================================
   CTS 115 Study Guide — glossary.js
   ---------------------------------------------------------------------
   Powers the searchable glossary page (glossary.html).

   WHERE DOES THE DATA COME FROM?
   js/glossary-data.js defines one big array called GLOSSARY. Each item
   looks like:  { term: "Moore's Law", def: "...", module: 3 }
   That file is loaded BEFORE this one in glossary.html, so GLOSSARY
   already exists when this code runs.

   WHAT THIS CODE DOES:
     1. Reads what you type in the search box and the module dropdown
     2. Filters the GLOSSARY array to matching terms
     3. Builds the HTML list of results and puts it on the page
   ===================================================================== */
"use strict";

const searchInput = document.querySelector("#glossary-search");
const moduleSelect = document.querySelector("#glossary-module");
const resultsList = document.querySelector("#glossary-results");
const resultCount = document.querySelector("#glossary-count");

// Sort terms A–Z once. localeCompare handles capital letters and accents
// properly; "sensitivity: base" means "A" and "a" sort together.
const sortedTerms = [...GLOSSARY].sort((a, b) =>
  a.term.localeCompare(b.term, "en", { sensitivity: "base" })
);

/* Safety step: before putting text into HTML, "escape" characters like
   < and & so they show up as text instead of being treated as code.
   This prevents a class of security bugs called XSS. */
function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Wraps the search words in <mark> so matches are highlighted.
   We escape regex special characters (like . or ?) so a search for
   "e.g." doesn't break the pattern. */
function highlight(text, query) {
  const safe = escapeHTML(text);
  if (!query) return safe;
  const pattern = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safe.replace(new RegExp(`(${pattern})`, "gi"), "<mark>$1</mark>");
}

// Turns 3 into "03" so links match file names like module-03.html
function pad(num) {
  return String(num).padStart(2, "0");
}

/* The main function: filter, then draw the results */
function render() {
  const query = searchInput.value.trim().toLowerCase();
  const moduleFilter = moduleSelect.value; // "all" or a module number

  // .filter() keeps only the items where our test returns true
  const matches = sortedTerms.filter((item) => {
    const inModule = moduleFilter === "all" || item.module === Number(moduleFilter);
    const inText =
      item.term.toLowerCase().includes(query) ||
      item.def.toLowerCase().includes(query);
    return inModule && inText;
  });

  // .map() turns each term object into a string of HTML;
  // .join("") glues all those strings together.
  resultsList.innerHTML = matches
    .map(
      (item) => `
      <li class="glossary-item">
        <h3>${highlight(item.term, query)}</h3>
        <p>${highlight(item.def, query)}</p>
        <a href="modules/module-${pad(item.module)}.html">Module ${item.module}</a>
      </li>`
    )
    .join("");

  // This element has aria-live="polite", so screen readers announce
  // the new count after each search without the user moving focus.
  resultCount.textContent =
    matches.length === 1 ? "1 term found" : `${matches.length} terms found`;
}

// "input" fires on every keystroke; "change" fires when the dropdown changes
searchInput.addEventListener("input", render);
moduleSelect.addEventListener("change", render);

// Let other pages link here with a search already filled in,
// e.g. glossary.html?q=cloud  (URLSearchParams reads the ?q= part)
const startingQuery = new URLSearchParams(window.location.search).get("q");
if (startingQuery) searchInput.value = startingQuery;

render(); // draw the full list when the page first loads
