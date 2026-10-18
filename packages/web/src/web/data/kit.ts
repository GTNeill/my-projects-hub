/**
 * Every word and number on the media kit lives here.
 * Edit this file to change copy — no component edits needed.
 *
 * VERIFY BEFORE YOU PUBLISH:
 *  - `packages` — deliberately contains NO money language, per George. It describes three ways
 *    of working together instead. Don't reintroduce prices or fees here.
 *  - `quotes` — empty on purpose. Fill this array with real quotes and the "In Their Words"
 *    section appears between the case studies and the packages. Leave it empty and the section
 *    is not rendered at all.
 *  - `stats` — every figure below was read off the live sites on 2026-10-15. Re-check them or
 *    swap them for the ones you actually want to lead with.
 */

export const profile = {
  name: "George Neill",
  wordmark: { before: "tech", accent: "by", after: "George" },
  location: "Chicago, Illinois",
  email: "george@gneill.net",
  bookingUrl: "https://tidycal.com/gneill",
  bookingLabel: "Book a 30-minute call",
  portfolioUrl: "https://tech.gneill.net",
  photosUrl: "https://gneill.net",
  kitYear: "2026",
};

export const hero = {
  kicker: `Media kit · ${profile.kitYear}`,
  title:
    "I help community groups and nonprofits find — or build — the tools that support their mission.",
  standfirst:
    "I've done a lot of different things in technology over a long career: websites, donor systems, CRM integrations, and the slow work of finding the right tool for a need that nothing off the shelf covered. Most of it was for nonprofits and community groups. I'm retired now, with time on my hands and a long memory of how tight things really are in organizations like yours.",
  credentials: [
    "A career in technology",
    "Websites · donor systems · CRMs",
    "Community & nonprofit work",
    "Retired, with time to help",
  ],
  jumpLinks: [
    { label: "The work", href: "#work" },
    { label: "The numbers", href: "#numbers" },
    { label: "Ways to work", href: "#packages" },
    { label: "Start a project", href: "#start" },
  ],
};

export const nav = [
  { id: "numbers", label: "Numbers" },
  { id: "work", label: "Work" },
  { id: "shelf", label: "The shelf" },
  { id: "background", label: "Background" },
  { id: "packages", label: "Ways to work" },
  { id: "process", label: "Process" },
  { id: "start", label: "Start" },
];

export const stats = {
  kicker: "01 — The numbers",
  title: "Small tools, real usage. Every figure here is live and clickable.",
  note: "Read off the live sites on October 15, 2026. Check any of them yourself — the links are in The shelf.",
  strip: {
    points: [
      {
        title: "One person, start to finish.",
        body: "No agency, no account manager, no handoff to a junior after the pitch. The person who scopes your project is the person who builds it, and the person you email when something needs changing.",
      },
      {
        title: "Nothing here needs a system administrator.",
        body: "Nothing to install, nothing to renew, no dashboard nobody logs into, no training session you have to schedule. If a tool can't be run by the person who already answers your email — on a phone, in five spare minutes — it isn't finished.",
      },
    ],
  },
  items: [
    {
      figure: "14",
      label: "Tools shipped",
      detail: "In production, on real domains, used by real people. Not a portfolio of mockups.",
    },
    {
      figure: "3",
      label: "Organizations running them",
      detail:
        "The Greater Rockwell Organization, the 40th Ward office, and a citywide civic project.",
    },
    {
      figure: "138",
      label: "Items in one lending library",
      detail:
        "Ladders, canoes, saws and stand mixers shared between neighbors in Greater Rockwell. Every one listed, borrowed and returned by volunteers.",
    },
    {
      figure: "107",
      label: "Ballots cast in the open",
      detail:
        "Ranked-choice straw polls counted round by round in public — 5 races, every transfer and exhausted ballot shown.",
    },
  ],
};

export type CaseStudy = {
  index: string;
  client: string;
  title: string;
  year: string;
  tags: string[];
  problem: string;
  solution: string;
  outcome: string;
  shot: string;
  shotAlt: string;
  url: string;
  urlLabel: string;
};

export const cases: CaseStudy[] = [
  {
    index: "01",
    client: "The Greater Rockwell Organization",
    title: "A neighborhood library of things, run by volunteers",
    year: "2026",
    tags: ["Community", "Lending library", "Member portal"],
    problem:
      "The association had a shed full of donated tools and no way for neighbors to see what was in it. Borrowing ran on text messages and memory — nobody knew who had the ladder, and the spreadsheet nobody updated was doing more harm than good.",
    solution:
      "A members-only library: browse by category, request an item, see who has what. Photo upload straight from a phone camera, downscaled in the browser so listing something works on block wifi. Behind it, an admin console, an audit log, welcome email, privacy statement and terms.",
    outcome:
      "138 items in active rotation across six categories, maintained entirely by volunteers with no paid staff. Replaced the off-the-shelf app the group had outgrown.",
    shot: "/shots/grolot.jpg",
    shotAlt: "GRO LOT library of things homepage",
    url: "https://grolot.thegreaterrockwell.org",
    urlLabel: "grolot.thegreaterrockwell.org",
  },
  {
    index: "02",
    client: "40th Ward",
    title: "One calendar for a neighborhood that had five",
    year: "2026",
    tags: ["Civic", "Calendar aggregation", "Volunteer scheduling"],
    problem:
      "Ward news lived in five places — the alderperson's site, the neighborhood association, the park district, the library, the block clubs. Residents missed things they'd have gone to. Volunteer coverage for ward events ran on a shared Google Sheet that somebody had to rebuild every month.",
    solution:
      "A combined calendar that reads the feeds other organizations already publish, with category filters, search, and a one-tap add-to-your-own-calendar. Alongside it, shift sign-ups with caps, automatic waitlists, email confirmations and reminders, and a weekly template organizers generate weeks ahead from.",
    outcome:
      "One place residents check instead of five. Organizers set a week's coverage once rather than rebuilding a spreadsheet, and volunteers release shifts knowing the waitlist picks it up.",
    shot: "/shots/calendar.jpg",
    shotAlt: "Lincoln Square community calendar",
    url: "https://community-calendar.up.railway.app",
    urlLabel: "community-calendar.up.railway.app",
  },
  {
    index: "03",
    client: "Residents, citywide",
    title: "City open data, made personal in one address field",
    year: "2025–2026",
    tags: ["Civic data", "Public information", "Email reminders"],
    problem:
      "Chicago publishes early-voting locations and street-sweeping schedules as open data. In that form it is useful to nobody: a resident wants to know which site is closest and open now, and whether their car needs to move on Wednesday.",
    solution:
      "Address in, answer out. The nearest early-voting site with hours, a map and directions, emailable to yourself or a neighbor. Sweeping dates for your exact block, with reminders a week and a day ahead so you can move the car — plus the live location of sweepers in the ward.",
    outcome:
      "Runs on the city's own feeds, refreshes weekly, and needs no staff to operate. It keeps working when nobody is paying attention to it, which is the whole point.",
    shot: "/shots/chivotes.jpg",
    shotAlt: "ChiVotes early voting site finder",
    url: "https://chivotes.fyi",
    urlLabel: "chivotes.fyi",
  },
];

export const shelf = {
  kicker: "03 — The shelf",
  title: "The rest of the shelf.",
  standfirst:
    "Everything is live. Click any of them — that is the whole point of putting them on one page.",
  items: [
    {
      name: "Community Bulletin Boards",
      blurb:
        "The flyer wall by the checkout, online. Neighbors post events and services; the organizer approves what goes up and expired notices come down on their own.",
      url: "https://boards.gneill.net",
      urlLabel: "boards.gneill.net",
      tag: "Community",
      shot: "/shots/boards.jpg",
    },
    {
      name: "Chicago Votes",
      blurb:
        "Nearest early-voting site with hours, directions and an email-to-yourself option.",
      url: "https://chivotes.fyi",
      urlLabel: "chivotes.fyi",
      tag: "Civic",
      shot: "/shots/chivotes.jpg",
    },
    {
      name: "Street Sweeper Schedule",
      blurb:
        "Your block's sweeping dates, with reminders a week and a day before, and live sweeper locations.",
      url: "https://chistreetsweeper.date",
      urlLabel: "chistreetsweeper.date",
      tag: "Civic",
      shot: "/shots/sweeper.jpg",
    },
    {
      name: "Community Calendar",
      blurb:
        "Feeds from other neighborhood organizations, merged into one filtered, searchable view.",
      url: "https://community-calendar.up.railway.app",
      urlLabel: "community-calendar.up.railway.app",
      tag: "Community",
      shot: "/shots/calendar.jpg",
    },
    {
      name: "Volunteer Shift Sign-Up",
      blurb:
        "Shift caps, automatic waitlists, email confirmations and reminders, recurring weekly templates.",
      url: "https://shifts.gneill.net",
      urlLabel: "shifts.gneill.net",
      tag: "Community",
      shot: "/shots/shifts.jpg",
    },
    {
      name: "Library of Things",
      blurb: "Borrow the ladder, lend the canoe. Members-only, volunteer-run, no deposits.",
      url: "https://grolot.thegreaterrockwell.org",
      urlLabel: "grolot.thegreaterrockwell.org",
      tag: "Community",
      shot: "/shots/grolot.jpg",
    },
    {
      name: "Our Election",
      blurb:
        "Free online elections for clubs, boards and communities. Private ballots, ranked choice built in, and a round-by-round count anyone can follow.",
      url: "https://ourelection.app",
      urlLabel: "ourelection.app",
      tag: "Civic",
      shot: "/shots/ourelection.jpg",
    },
    {
      name: "Ranked Choice Voting Live",
      blurb:
        "A live straw poll counted round by round in the open, with every transfer shown.",
      url: "https://rcv.live",
      urlLabel: "rcv.live",
      tag: "Civic",
      shot: "/shots/rcvlive.jpg",
    },
    {
      name: "Ranked Choice Voting Demo",
      blurb: "The same count, explained, for anyone who has never ranked a ballot.",
      url: "https://rcv2028.win",
      urlLabel: "rcv2028.win",
      tag: "Civic",
      shot: "",
    },
    {
      name: "Photo Tour Map",
      blurb:
        "An itinerary from a photographer's workshop site, turned into a mapped route with info cards.",
      url: "https://thedigitaltrekker.com",
      urlLabel: "thedigitaltrekker.com",
      tag: "Travel",
      shot: "",
    },
    {
      name: "Help Desk",
      blurb:
        "Keeps requests for help from friends and family out of my inbox, with a one-click remote session.",
      url: "https://help.gneill.net",
      urlLabel: "help.gneill.net",
      tag: "Internal",
      shot: "",
    },
    {
      name: "Job Scheduler",
      blurb: "Centralised jobs with logs and notifications, so cron doesn't live on five machines.",
      url: "https://cron.gneill.net",
      urlLabel: "cron.gneill.net",
      tag: "Internal",
      shot: "",
    },
    {
      name: "photos by George",
      blurb: "My photography portfolio — copy photos to a folder, the site builds itself.",
      url: "https://gneill.net",
      urlLabel: "gneill.net",
      tag: "Photography",
      shot: "/shots/photos.jpg",
    },
    {
      name: "This portfolio",
      blurb: "The page all of this hangs off.",
      url: "https://tech.gneill.net",
      urlLabel: "tech.gneill.net",
      tag: "Tech",
      shot: "/shots/tech.jpg",
    },
  ],
};

export const packages = {
  kicker: "05 — Ways to work",
  title: "Three ways to work together.",
  standfirst:
    "Most groups start with the first one. It's the quickest, because a lot of what you need may already exist.",
  note: {
    headline: "Small organizations, and the reality of running one.",
    detail:
      "I've worked with enough of them to know the arithmetic: volunteers doing three jobs, decisions made by whoever happens to be free on a Tuesday, and no appetite for anything that has to be looked after. So I build the smallest thing that does the job, I do the looking-after myself, and I don't hand over anything that turns into a new responsibility for you. I'm retired, I have the time, and I like this work.",
  },
  terms: [
    {
      index: "A",
      name: "The Community Stack",
      best: "Best when the tool you need already exists.",
      body: "You pick from what I have already built — bulletin board, community calendar, volunteer shifts, lending library — and I set it up for your organization: your name, your colors, your domain, your categories. Live in days, not months.",
      includes: [
        "Your choice of anything already on the shelf",
        "Set up for your organization and your domain",
        "Your logo, colors and category list",
        "A handover session with your volunteers",
        "Fixes and adjustments after launch",
      ],
    },
    {
      index: "B",
      name: "The Data Tool",
      best: "Best when you're sitting on information people need.",
      body: "You have a spreadsheet, a PDF, a dataset or a city open-data feed — and people who need an answer from it, not a download link. I build the thing that turns one into the other, and it keeps itself current.",
      includes: [
        "Your data, cleaned and connected",
        "Address in, answer out",
        "Email or calendar reminders for whoever wants them",
        "An admin page so your staff can edit it without me",
        "Automatic refresh from the source",
      ],
    },
    {
      index: "C",
      name: "The Custom Build",
      best: "Best when nobody has solved your particular problem.",
      body: "A program, a grant deliverable, a workflow that lives in three inboxes and a whiteboard. We scope it together — usually in one sitting — and I build it. You own the code, the domain and the data.",
      includes: [
        "A scoping session with the people who do the work",
        "A written scope you can take to a funder",
        "Build, test and launch",
        "Documentation your successor can read",
        "You own the code, the domain and the data",
      ],
    },
  ],
};

export const process = {
  kicker: "06 — Process",
  title: "How it goes.",
  steps: [
    {
      n: "01",
      title: "A 30-minute call",
      body: "You tell me what people keep asking you for and what you keep doing by hand. No slides, no pitch.",
    },
    {
      n: "02",
      title: "A plan, and a straight answer",
      body: "Usually within a few days. What it does, what it doesn't, what it takes to keep running, and whether it's worth doing at all — in writing, so you can take it to a board or a funder.",
    },
    {
      n: "03",
      title: "I build it",
      body: "Two to four weeks for most projects. You see it working on a real link from the first week, not at the end.",
    },
    {
      n: "04",
      title: "Launch, then hand it over",
      body: "It goes on your domain. I walk your volunteers through it, write down how it works, and the code is yours.",
    },
  ],
};

export type Quote = { text: string; name: string; role: string };

/** Fill this in and the section renders. Empty = section hidden. */
export const quotes: Quote[] = [];

export const background = {
  kicker: "04 — Background",
  title: "A lot of different work, all of it pointed the same direction.",
  standfirst:
    "I care about community, about connection, and about social justice. That has been the constant across everything I've done, whatever the job title was at the time.",
  capabilities: [
    {
      label: "Websites",
      body: "First sites, redesigns and rescues — many of them for organizations with nobody to hand it off to afterwards.",
    },
    {
      label: "Donor systems",
      body: "Choosing one, moving onto it, and making it fit the way your organization actually raises money.",
    },
    {
      label: "CRM & integrations",
      body: "Getting tools that don't talk to each other to talk to each other, so somebody stops retyping names.",
    },
    {
      label: "Finding the tool",
      body: "Knowing what already exists, what it takes to live with, and whether you need it at all. Often the answer is no.",
    },
    {
      label: "Building the tool",
      body: "When nothing off the shelf fits, I build the small thing that does — for the specific need, not the general case.",
    },
    {
      label: "Untangling",
      body: "Inherited systems, half-finished migrations, the website someone's cousin built in 2014. I like these.",
    },
  ],
  paras: [
    "The range has been wide. Small businesses getting their first computers. Years inside a Fortune 50 company. A farmer cooperative built on trust and slim margins. Websites, donor systems and integrations for nonprofits of every size. Now community tools on Chicago's North Side. Different worlds — and the same thread through all of them: people trying to hold something together with fewer hands and fewer hours than the job actually needs.",
    "I served on the board of Defense of Democracy, a national nonprofit, and helped the organization implement Google Workspace and integrate donation data from Givebutter into Little Green Light.",
    "That's as true of a nonprofit as it is of a block club. So I build for the situation that actually exists. Nothing I hand over comes with a renewal your volunteers have to remember, a dashboard nobody logs into, or a training session you have to schedule. It should be run by the person who already answers your email, on a phone, in the five minutes they have.",
    "I'm also a photographer, which is where the design sense comes from — an eye for what people actually look at, and for treating the people in front of you as the point rather than the decoration.",
  ],
  facts: [
    { k: "Based", v: "Chicago, Illinois" },
    { k: "Focus", v: "Community groups & nonprofits" },
    { k: "Time", v: "Retired — plenty of it for this" },
    { k: "Also", v: "Photographer — gneill.net" },
  ],
  photos: [
    { src: "/images/p1.jpg", alt: "Photograph by George Neill" },
    { src: "/images/p2.jpg", alt: "Photograph by George Neill" },
    { src: "/images/p3.jpg", alt: "Photograph by George Neill" },
  ],
  offer: {
    title: "Tell me what your group is stuck on.",
    body: "I won't try to sell you a system. Usually one conversation is enough to say whether it's worth building, what it takes to keep running, and whether something you already have is good enough. If it isn't worth building, I'll tell you that instead.",
    cta: "Tell me about it",
  },
};

/**
 * The commercial stack, listed because a media kit is where people check
 * whether you have actually used the thing they are asking about.
 *
 * Names are spelled the way the vendors spell them. A handful below were given
 * in a shortened or misspelled form and kept close to the original — check
 * "Sent", "Chatto", "GenOffice" and "Zoner Studio" before this goes out.
 */
export const systems = {
  kicker: "Systems I've worked with",
  standfirst:
    "The commercial tools I've implemented, administered or integrated over the years. It is also how I can tell you honestly when something simpler will do the job — and when nothing off the shelf will.",
  groups: [
    { label: "CRM", tools: ["Little Green Light", "Salesforce", "Infor CRM"] },
    { label: "Donor systems", tools: ["Givebutter", "Zeffy", "Facebook"] },
    {
      label: "Project management",
      tools: ["Asana", "MS Project", "Monday", "Basecamp", "Workamajig", "ClickUp", "Clockify"],
    },
    { label: "Communication", tools: ["MS Teams", "Mattermost", "WhatsApp", "Chatto"] },
    {
      label: "Office suites",
      tools: [
        "MS Office",
        "OpenOffice",
        "GenOffice",
        "LibreOffice",
        "Google Workspace for Nonprofits",
      ],
    },
    {
      label: "Photography",
      tools: ["Adobe Creative Suite", "ON1", "Topaz Suite", "Capture One", "Zoner Studio"],
    },
    { label: "Design", tools: ["Canva", "Plasfy", "Excalidraw"] },
    {
      label: "Web tools",
      tools: [
        "WordPress",
        "Squarespace",
        "Zenfolio",
        "MS SharePoint",
        "Bootstrap Studio",
        "Cloudflare",
        "AWS",
        "GoDaddy",
        "Bluehost",
        "Railway",
        "Hostinger",
        "Vercel",
        "RackNerd",
        "Short.io",
      ],
    },
    {
      label: "Dev tools",
      tools: [
        "GitHub",
        "Docker",
        "Resend",
        "Sent",
        "Turso DB",
        "Supabase",
        "Tigris",
        "Greptile",
        "Perplexity",
        "Claude",
        "OpenCode",
        "Telnyx",
        "MySQL",
        "PostgreSQL",
        "MS SQL Server",
        "SQLite",
      ],
    },
  ],
};

export const builder = {
  kicker: "07 — Start here",
  title: "Tell me what you need. I'll write the email for you.",
  standfirst:
    "Tick what your organization is dealing with. This builds a short, specific message — the kind I can answer properly instead of asking you six questions back.",
  needs: [
    { id: "comms", label: "Our announcements don't reach people", hint: "bulletin board, newsletter, text" },
    { id: "calendar", label: "Our events are scattered across too many calendars", hint: "aggregated calendar" },
    { id: "volunteers", label: "We schedule volunteers by hand", hint: "shift sign-ups, waitlists, reminders" },
    { id: "data", label: "We have data residents keep asking us for", hint: "address-in, answer-out tool" },
    { id: "lend", label: "We lend things and lose track of them", hint: "lending library" },
    { id: "website", label: "Our website is out of date, or we don't have one", hint: "build or rebuild" },
    { id: "donors", label: "Our donor records live in three different places", hint: "donor systems, CRM, integrations" },
    { id: "custom", label: "Something else entirely", hint: "custom build" },
  ],
  orgPlaceholder: "Your organization",
  submitLabel: "Open this in my email app",
  copyLabel: "Copy the message instead",
};

export const start = {
  kicker: "08 — Contact",
  title: "Start here.",
  standfirst:
    "Half an hour, no obligation, and usually a straight answer about whether this is worth building.",
  nextSteps: [
    "We talk for 30 minutes — what people ask you for, what you do by hand.",
    "You get a written plan, what it takes to keep running, and an honest answer on whether it's worth doing.",
    "If it isn't worth building, I'll tell you that instead.",
  ],
};
