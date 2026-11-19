/* =====================================================================
   CTS 115 Study Guide — main.js
   ---------------------------------------------------------------------
   This one file powers the interactive parts of every page:
     1. Mobile menu button
     2. "On this page" sidebar highlighting
     3. Flashcards (click to flip)
     4. Self-check quizzes
     5. Progress tracking ("Mark module complete")

   HOW IT WORKS: Each feature looks for special HTML attributes (like
   data-quiz or data-flashcard). If a page doesn't have that feature,
   the code simply finds nothing and does nothing. That way, one script
   can safely run on every page.

   The page still WORKS without JavaScript (you can read everything) —
   JavaScript only adds the extras. This is called
   "progressive enhancement."
   ===================================================================== */

// "use strict" turns on stricter rules that catch common mistakes,
// like using a variable you forgot to declare.
"use strict";

/* ---------------------------------------------------------------------
   1. MOBILE MENU BUTTON
   On small screens, the nav links are hidden behind a "Menu" button.
   We flip the button's aria-expanded attribute between "true" and
   "false". The CSS uses that attribute to show or hide the links, and
   screen readers announce it ("Menu, expanded").
   --------------------------------------------------------------------- */
const navToggle = document.querySelector(".nav-toggle");

// The "if" check means: only run this if the button exists on the page.
if (navToggle) {
  navToggle.addEventListener("click", () => {
    // getAttribute returns a STRING, so we compare to the string "true"
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
  });
}


/* ---------------------------------------------------------------------
   2. "ON THIS PAGE" HIGHLIGHTING
   An IntersectionObserver tells us when an element scrolls into view.
   When a lesson section becomes visible, we highlight its link in the
   sidebar so students always know where they are.
   --------------------------------------------------------------------- */
const tocLinks = document.querySelectorAll(".toc a");

if (tocLinks.length > 0 && "IntersectionObserver" in window) {
  // Build a lookup: section id -> its sidebar link
  const linkFor = {};
  tocLinks.forEach((link) => {
    // link.hash is the "#section-id" part of the href; slice(1) drops the "#"
    linkFor[link.hash.slice(1)] = link;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Remove the highlight from all links, then add it to this one
          tocLinks.forEach((l) => l.classList.remove("is-active"));
          const active = linkFor[entry.target.id];
          if (active) active.classList.add("is-active");
        }
      });
    },
    // rootMargin shrinks the "viewport" so a section counts as active
    // when it reaches the upper part of the screen.
    { rootMargin: "-20% 0px -70% 0px" }
  );

  // Watch every section that has a matching sidebar link
  Object.keys(linkFor).forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}


/* ---------------------------------------------------------------------
   3. FLASHCARDS
   Each flashcard is a <button aria-pressed="false">. Clicking toggles
   aria-pressed, and the CSS flips the card when it's "true".
   Because it's a real <button>, it works with the keyboard
   (Tab to it, then Enter or Space) for free!
   --------------------------------------------------------------------- */
document.querySelectorAll("[data-flashcard]").forEach((card) => {
  card.addEventListener("click", () => {
    const flipped = card.getAttribute("aria-pressed") === "true";
    card.setAttribute("aria-pressed", String(!flipped));
  });
});

// "Shuffle" button: randomly re-orders the cards in the list
const shuffleBtn = document.querySelector("[data-shuffle]");
if (shuffleBtn) {
  shuffleBtn.addEventListener("click", () => {
    const list = document.querySelector(".flashcards");
    // Array.from turns the list's children into a real array we can sort
    const items = Array.from(list.children);
    // Fisher–Yates shuffle: walk backward, swapping each item with a
    // random earlier one. It's the standard fair way to shuffle.
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]]; // swap using destructuring
    }
    // appendChild MOVES an existing element, so this re-orders the list
    items.forEach((item) => {
      item.querySelector("[data-flashcard]").setAttribute("aria-pressed", "false");
      list.appendChild(item);
    });
  });
}


/* ---------------------------------------------------------------------
   4. SELF-CHECK QUIZZES
   Quiz markup (see any module page):
     <form data-quiz>
       <fieldset data-answer="b" data-explain="Why b is right...">
         <label class="quiz__option"><input type="radio" value="a"> ...
         <p class="quiz__feedback" aria-live="polite"></p>
       </fieldset>
       ...
   The correct answer is stored in data-answer. (Yes, you can find it by
   viewing the source — this quiz is for practice, not a grade!)
   --------------------------------------------------------------------- */
document.querySelectorAll("[data-quiz]").forEach((quiz) => {
  const questions = quiz.querySelectorAll("fieldset");
  const scoreBox = quiz.querySelector(".quiz__score");

  // "submit" fires when the Check button is clicked (or Enter is pressed)
  quiz.addEventListener("submit", (event) => {
    // Stop the browser from reloading the page (a form's default behavior)
    event.preventDefault();

    let score = 0;

    questions.forEach((q) => {
      const answer = q.dataset.answer;   // dataset reads data-* attributes
      const chosen = q.querySelector("input:checked");
      const feedback = q.querySelector(".quiz__feedback");

      // Clear any colors from a previous attempt
      q.querySelectorAll(".quiz__option").forEach((opt) => {
        opt.classList.remove("is-correct", "is-wrong");
      });

      if (!chosen) {
        feedback.className = "quiz__feedback is-wrong";
        feedback.textContent = "Pick an answer for this one.";
        return; // "return" inside forEach skips to the next question
      }

      // Always highlight the correct option in green
      const correctInput = q.querySelector(`input[value="${answer}"]`);
      correctInput.closest(".quiz__option").classList.add("is-correct");

      if (chosen.value === answer) {
        score++;
        feedback.className = "quiz__feedback is-correct";
        feedback.textContent = "Correct! " + q.dataset.explain;
      } else {
        chosen.closest(".quiz__option").classList.add("is-wrong");
        feedback.className = "quiz__feedback is-wrong";
        feedback.textContent = "Not quite. " + q.dataset.explain;
      }
    });

    // Template literal: backticks let us drop variables in with ${ }
    scoreBox.textContent = `You got ${score} of ${questions.length} correct.`;
  });

  // The "Try again" button is type="reset", which clears the radio
  // buttons automatically. We also clear our colors and messages.
  quiz.addEventListener("reset", () => {
    quiz.querySelectorAll(".quiz__option").forEach((opt) => {
      opt.classList.remove("is-correct", "is-wrong");
    });
    quiz.querySelectorAll(".quiz__feedback").forEach((f) => {
      f.textContent = "";
      f.className = "quiz__feedback";
    });
    scoreBox.textContent = "";
  });
});


/* ---------------------------------------------------------------------
   5. PROGRESS TRACKING
   We save which modules are complete in localStorage — a small storage
   space in YOUR browser. Nothing is sent to a server. Note: it's saved
   per browser, so progress on your phone won't show on your laptop.

   localStorage only stores strings, so we convert our array to text
   with JSON.stringify and back with JSON.parse.
   --------------------------------------------------------------------- */
const STORAGE_KEY = "cts115-completed-modules";

// try/catch: if storage is blocked (e.g., some private-browsing modes),
// we fall back to an empty list instead of crashing the whole script.
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveProgress(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    /* Storage unavailable — the button still works for this visit. */
  }
}

// --- On a module page: the "Mark complete" button ---
const completeBtn = document.querySelector("[data-complete]");

if (completeBtn) {
  const moduleNum = Number(completeBtn.dataset.complete);

  // Updates the button's text and pressed state to match saved progress
  function renderButton() {
    const done = loadProgress().includes(moduleNum);
    completeBtn.setAttribute("aria-pressed", String(done));
    completeBtn.textContent = done ? "✓ Completed — click to undo" : "Mark module complete";
  }

  completeBtn.addEventListener("click", () => {
    let list = loadProgress();
    if (list.includes(moduleNum)) {
      list = list.filter((n) => n !== moduleNum); // remove it
    } else {
      list.push(moduleNum);                         // add it
    }
    saveProgress(list);
    renderButton();
  });

  renderButton(); // run once when the page loads
}

// --- On the home page: show badges and fill the progress bar ---
const progressFill = document.querySelector(".progress__fill");

if (progressFill) {
  const done = loadProgress();
  const cards = document.querySelectorAll("[data-module]");

  cards.forEach((card) => {
    const badge = card.querySelector(".module-card__done");
    if (done.includes(Number(card.dataset.module))) badge.hidden = false;
  });

  const percent = Math.round((done.length / cards.length) * 100);
  progressFill.style.width = percent + "%";
  document.querySelector(".progress__label").textContent =
    `${done.length} of ${cards.length} modules complete (${percent}%)`;

  // Keep the screen-reader value of the progress bar in sync
  document.querySelector(".progress__track").setAttribute("aria-valuenow", percent);
}
