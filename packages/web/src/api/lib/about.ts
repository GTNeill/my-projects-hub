/**
 * Default copy for the About card.
 *
 * This is the text the site ships with. It is what the API returns until an
 * admin saves an edit, and what the admin console's "restore default text"
 * puts back, so it stays the single source of truth for the original wording
 * rather than being duplicated into the component.
 */
export const DEFAULT_ABOUT = {
  heading: "George Neill",
  bio: [
    "I'm a retired IT guy with over 45 years doing IT stuff as a small business for small businesses, banks, pharmacies, shipyards, doctors, credit unions, libraries, and more. I also spent years on the IT team for a Fortune 50 grocery distributor, developing RF warehouse apps, frequent shopper tracking, activity-based costing, and warehouse labor reporting — and served as IT Director for the largest organic farmer cooperative in the country.",
    "I'm passionate about social justice and enjoy volunteering in my community, helping nonprofits maximize their use of technology by providing support, implementing systems, and developing tools that connect people and make life easier.",
    "I'm also a decent amateur photographer and love taking photos of family and friends and traveling around the world.",
  ].join("\n\n"),
  linkedinUrl: "https://linkedin.com/in/georgeneill",
};

/**
 * Splits the stored bio into paragraphs on blank lines, so the admin writes in
 * a plain textarea and the card still renders separate <p> elements.
 */
export function bioParagraphs(bio: string): string[] {
  return bio
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
