/* ===========================================================================
   content.js — MY TREASURE VALLEY HANDYMAN

   Everything the client says about themselves. Re-skin surface #2 of 2
   (the other is assets/tokens.css §1).

   PROVENANCE RULE FOR THIS FILE
   Every factual claim below is marked:
     [V]  verified 2026-09-11 from the client's own live site / listings
     [D]  draft copy written for client approval — true in substance, his words to okay
     [!]  PLACEHOLDER — renders visibly as a placeholder. MUST NOT SHIP.
            See ../HANDOFF.md "Collect from Robbie".
   Do not promote a [!] to a fact without the client's evidence in hand.
   =========================================================================== */

window.SITE = {

  /* --- identity ---------------------------------------------------------- */
  business:  "My Treasure Valley Handyman",          /* [V] */
  trade:     "Handyman and home repairs",            /* [V] the two-second answer, part 1 */
  legalName: "My Treasure Valley Handyman",          /* [V] */
  since:     null,                                   /* [!] founding year unverified — masthead
                                                        shows the 2026 award instead. */
  strapline: "Love people. Do great work.",          /* [V] their own stated purpose */

  /* The number. Written once, rendered in 5 places.
     THIS CLIENT TAKES TEXTS — the live site's primary contact is an sms: link and
     the copy says "send a text or call". Both are offered; text is given equal
     weight, which no Treasure Valley rival does. */
  phone: { tel: "+12085841452", display: "(208) 584-1452", sms: "+12085841452" },  /* [V] */
  email: null,                                        /* [!] no public email found — ask */

  /* --- where -------------------------------------------------------------
     Base is Meridian: their own page titles and h2s all read "... in Meridian, ID". */
  base: "Meridian, Idaho",                            /* [V] */
  address: { street: "420 W Carlton Ave", city: "Meridian", region: "ID", postal: "83642" }, /* [V] */
  radiusMiles: 25,                                    /* [D] derived from the town list — confirm */
  towns: ["Meridian", "Boise", "Nampa", "Eagle", "Kuna", "Caldwell"],   /* [V] exactly what they claim */
  notServing: "If your town isn't on that list, text us and we'll tell you straight. We'd rather say no than turn up late.",  /* [D] */

  /* --- trust marks. These sit in the masthead, above the fold.
     All three are VERIFIED off the client's own site. Measured: 8 of 12 trade
     sites and 3 of 4 Treasure Valley rivals show NOTHING here. */
  guarantee: "12-month guarantee",                    /* [V] /about-us: materials AND workmanship, in writing */
  backgroundChecked: "Background-checked crew",       /* [V] homepage */
  award: "Idaho's Best 2026",                         /* [V] "Idaho's Best — Treasure Valley Handyman, Winner 2026" */

  /* Idaho requires DOPL contractor registration for work over $2,000, and Boise
     requires a Home Occupation Permit. The number is the first thing a suspicious
     homeowner checks and template/README.md forbids faking it. */
  licence: "[ Idaho RCE # — ask Robbie ]",            /* [!] */
  insured: "[ confirm liability + workers' comp ]",   /* [!] */
  bonded:  false,                                     /* [!] unknown */

  /* --- reviews ------------------------------------------------------------
     PROVENANCE — read this before changing either number.

     ratingValue 4.9 · reviewCount 300 · source Facebook

     CONFIRMED BY JOSIAH YORK (the owner's son) on 2026-09-12, relayed via the
     coordinator: "that review count number was correct. I know that for sure."
     The ORIGINAL source was a web search result citing their Facebook page —
     300 reviews over about three and a half years, 297 of them five-star.
     NO SCREENSHOT IS ON FILE YET, and one is still on the collect list.

     So this is a VOUCHED number, not a CHECKED one. Those are different things
     and this file should not blur them: somebody who knows the business says it
     is right; nobody has yet put the figure on screen next to it. The screenshot
     costs nothing and turns the first into the second.

     HOW 4.9 WAS DERIVED, because "297 of 300 are five-star" is not a rating:
       the other 3 reviews are unknown, so the true average is bounded:
         all 3 at 1-star -> (297x5 + 3x1) / 300 = 4.9600
         all 3 at 4-star -> (297x5 + 3x4) / 300 = 4.9900
       the true value is therefore somewhere in [4.96, 4.99].
     4.9 is true under EVERY assumption about those 3, and understates by
     0.06-0.09. Understating is the safe direction: structured data that
     OVERstates a rating is the thing Google takes manual action on. If the real
     average ever arrives from the platform itself, replace 4.9 with it.

     PLATFORM: Facebook, not Google. The markup hard-coded "Google reviews" and
     would have published a Facebook figure under a Google label. Worth asking
     whether he ALSO has Google reviews — those are what feed the local pack,
     and GBP-CHECKLIST.md item 4.1 is where they would come from. */
  reviews: {
    rating: 4.9,                                      /* [V] see provenance above */
    count: 300,                                       /* [V] see provenance above */
    source: "Facebook",                               /* [V] NOT Google — see above */
    url: null,                                        /* [!] GBP review link still needed */
    quotes: [
      { text: "[ PLACEHOLDER — 3 real reviews still needed, with first name, town and job. The rating is structured data; the quotes are what a nervous homeowner actually reads. ]",
        who: "—", town: "—", job: "—" }
    ]
  },

  /* --- services -----------------------------------------------------------
     Rendered as numbered LINE ITEMS with a price BASIS, not icon cards.
     Grouped from the 13 service pages + the FAQ on the live site. [V] on scope.

     `basis` is [!] throughout: LESSONS.md §4 is explicit that a price BASIS is
     what stops the tyre-kicker calls that waste a working day, but I have no
     real figures. Get one line from Robbie per service — "one-hour minimum,
     from $X" — and this becomes the most useful column on the page. */
  services: [
    { slug: "drywall", name: "Drywall repair & installation",
      scope: "Dents, holes, cracks and full sheet replacement. Taped, textured and left ready to paint — we match the existing texture.",
      basis: "[ basis — ask Robbie ]", photo: "repairs.jpg" },

    { slug: "painting", name: "Interior & exterior painting",
      scope: "Whole rooms, whole houses, trim and doors. Prep is the job — filling, caulking and sanding before anything gets opened.",
      basis: "[ basis — ask Robbie ]", photo: "kitchens.jpg" },

    { slug: "repairs", name: "General repairs & maintenance",
      scope: "The list on the fridge. Sticking doors, shelving, TV mounting, furniture assembly, caulking, smart locks, gutter clearing, hauling the junk away after.",
      basis: "[ basis — ask Robbie ]", photo: "carpentry.jpg" },

    { slug: "fencing", name: "Fences, gates & siding",
      scope: "Wood and vinyl fence repair, full runs, gates that have dropped, and siding after a storm has been through it.",
      basis: "[ basis — ask Robbie ]", photo: "decks.jpg" },

    { slug: "tile-floors", name: "Tile, grout & LVP flooring",
      scope: "Tile and grout repair or replacement, custom tile and glass showers, and luxury vinyl plank laid through a whole floor.",
      basis: "[ basis — ask Robbie ]", photo: "job-kitchen.jpg" },

    { slug: "christmas-lights", name: "Christmas light installation",
      scope: "Hung in November, taken down and boxed in January. Your lights or ours. Books up early — get on the list in October.",
      basis: "[ basis — ask Robbie ]", photo: "emergency.jpg", urgent: true }
  ],

  /* --- proof --------------------------------------------------------------
     [!] ALL SIX ARE PLACEHOLDER PHOTOS shipped with the template. The captions
     below are structurally right and factually invented.

     This is the highest-value thing to collect after the reviews. 20+ real
     photos with job / town / month. The caption is what turns a phone snapshot
     into evidence, and it puts Treasure Valley town names on the page honestly
     rather than as keyword stuffing. */
  jobs: [
    { photo: "job-kitchen.jpg", alt: "[ replace with a real job photo ]",
      job: "[ job ]", town: "Meridian", date: "[ month ]", days: null },
    { photo: "job-door.jpg",    alt: "[ replace with a real job photo ]",
      job: "[ job ]", town: "Boise",    date: "[ month ]", days: null },
    { photo: "job-fence.jpg",   alt: "[ replace with a real job photo ]",
      job: "[ job ]", town: "Nampa",    date: "[ month ]", days: null },
    { photo: "job-sills.jpg",   alt: "[ replace with a real job photo ]",
      job: "[ job ]", town: "Eagle",    date: "[ month ]", days: null },
    { photo: "job-deck.jpg",    alt: "[ replace with a real job photo ]",
      job: "[ job ]", town: "Kuna",     date: "[ month ]", days: null },
    { photo: "job-stairs.jpg",  alt: "[ replace with a real job photo ]",
      job: "[ job ]", town: "Caldwell", date: "[ month ]", days: null }
  ],

  /* --- TOWN PAGES ---------------------------------------------------------
     PLAYBOOK.md: service x location pages are where local ranking actually comes
     from. They are ALSO how a site gets penalised: doorway pages — many near-identical
     pages differing only by a town name — have been actioned by Google for over a
     decade, and fifty thin pages leave the client worse off than six real ones.

     THE RULE ENFORCED BY tools/town-gate.js: a town page ships only when it carries
     evidence that is TRUE OF THAT TOWN and appears on no other page. In practice that
     means at least two real jobs done there, with photo, month and a line about the job.
     Nothing else on the page — services, trust marks, contact — differs between towns,
     so nothing else can carry the specificity.

     `ready: false` means the gate refuses to publish it. That is the correct state for
     five of these six right now, and it is not a defect: it is the difference between a
     page that earns a ranking and one that costs him the domain.

     ALREADY LIVE ON HIS CURRENT SITE: /boise-handyman, /nampa-handyman, /eagle-handyman,
     /kuna-handyman — none linked from the nav. Meridian (his BASE) and Caldwell have no
     page at all despite both being named in his hero. That is the free win.

     `milesFromBase`: only Boise and Caldwell have a verifiable source. The rest are null
     rather than estimated — a wrong drive time on a tradesman's site is the kind of small
     lie a local customer catches immediately. Ask Robbie; he drives it weekly. */
  townPages: [
    /* MERIDIAN — PUBLISHED WITHOUT JOB EVIDENCE, BY CLIENT DECISION.
       Josiah York, 2026-09-12: "publish it without job evidence." Made with the
       doorway-page warning in front of him, so it is an informed call and his to make.

       town-gate.js still REJECTS this town on its own measure and says so out loud; the
       override below is what lets it through, and the gate PRINTS it as an exception. The
       threshold was not lowered — a gate relaxed to let one thing through stops protecting
       everything else, and the next reader would never know it had been a deliberate choice.

       WHY IT IS NOT A DOORWAY PAGE ANYWAY: a doorway page is one identical to five others
       with the town name swapped. Meridian is the one town where that is not true, because
       he is BASED here — the workshop address is verified, it is the only town where that
       can be said, and it is exactly what a Meridian homeowner wants to know. The copy below
       is built on that and nothing in it could appear on another town's page.

       WHAT STILL TURNS IT FROM DEFENSIBLE INTO GOOD: two real Meridian job photographs.
       When they arrive, delete the override and let it pass on its own merit. */
    { slug: "meridian", name: "Meridian", ready: true, milesFromBase: 0,
      override: { by: "Josiah York", date: "2026-09-12",
                  reason: "Client decision: publish without job evidence. Defensible because he is BASED in Meridian — the one claim no other town page can make. Remove this override when 2 real Meridian jobs exist." },
      position: "This is home. The workshop is on W Carlton Ave, Meridian — we are not driving in from somewhere else.",
      lead: "Every other town on this site is somewhere we drive to. Meridian is where we start the day, so a Meridian job does not cost us the journey and we can usually get to you sooner. The 25-mile radius on this site is measured from here.",
      needs: "2 real Meridian job photos (job, month). Then remove `override` and it passes the gate on its own.",
      jobs: [] },

    { slug: "boise", name: "Boise", ready: false, milesFromBase: 11,       /* [V] sourced */
      position: "About 11 miles east of the shop.",
      needs: "2+ real Boise jobs. A page already exists at /boise-handyman — this replaces it, so it must be BETTER, not equal.",
      jobs: [] },

    { slug: "nampa", name: "Nampa", ready: false, milesFromBase: null,     /* [!] unverified */
      position: null,
      needs: "2+ real Nampa jobs, and the drive distance from Robbie. Existing page at /nampa-handyman.",
      jobs: [] },

    { slug: "eagle", name: "Eagle", ready: false, milesFromBase: null,     /* [!] unverified */
      position: null,
      needs: "2+ real Eagle jobs, and the drive distance. Existing page at /eagle-handyman.",
      jobs: [] },

    { slug: "kuna", name: "Kuna", ready: false, milesFromBase: null,       /* [!] unverified */
      position: null,
      needs: "2+ real Kuna jobs, and the drive distance. Existing page at /kuna-handyman.",
      jobs: [] },

    { slug: "caldwell", name: "Caldwell", ready: false, milesFromBase: 19, /* [V] sourced */
      position: "About 19 miles west of the shop — the far edge of where we go.",
      needs: "2+ real Caldwell jobs. NO page exists today despite Caldwell being named in his hero.",
      jobs: [] }
  ],

  /* --- the person ---------------------------------------------------------
     Owner name [V] (Robbie York, from two independent listings). Photo and the
     personal line are [!]. A real photo of Robbie is worth more than any stock
     image of a smiling man in a hard hat, which measurably reduces trust. */
  person: { name: "Robbie York", role: "Owner",
            photo: "dave.jpg",                        /* [!] placeholder image */
            line: "[ one or two lines from Robbie — who he is, how long on the tools ]" },

  /* --- hours + response ---------------------------------------------------- */
  hours: "Mon–Fri 8am–5pm",                           /* [V] their footer */
  responsePromise: "Text a photo and we'll usually give you a range the same day.",  /* [D] */

  /* --- values. [V] verbatim from /about-us. The best writing the business owns,
     currently buried on the page nobody reads. */
  values: [
    "We are kind and care deeply about people.",
    "We do what's right even when no one would know if we didn't.",
    "We strive to do everything with excellence — the first time and every time.",
    "We speak, dress, and act professionally because we are professionals.",
    "We work hard, work smart, and have fun in the process."
  ],

  /* --- where the leads go. app.js REFUSES to submit while this says REPLACE_ME. */
  form: {
    action: "https://formspree.io/f/REPLACE_ME",      /* [!] */
    method: "POST",
    /* Where a NO-JAVASCRIPT submit lands. Without this the browser follows the
       provider's own response and shows a stranger's branded page at the moment
       trust matters most. app.js turns it into an absolute URL at runtime. */
    thanks: "thanks.html",
    notifyBySms: true                                 /* this client lives on text — essential */
  },

  /* --- GBP. The playbook's central finding: worth more than the website.
     82% of organic leads, 95% of those convert by phone. NOT YET AUDITED. */
  gbp: {
    profileUrl: null,                                 /* [!] */
    reviewLink: null,                                 /* [!] goes on the invoice + a QR sticker */
    primaryCategory: "Handyman"
  },

  /* --- FAQ. [V] — these are the client's own answers, tightened. Feeds FAQPage schema. */
  faq: [
    { q: "What sort of jobs do you take on?",
      a: "Small to mid-size work around the house: drywall, interior and exterior painting, tile, fences and gates, door installation, LVP flooring, TV mounting, shelving, furniture assembly and smart locks." },
    { q: "Do you do bathrooms and kitchens?",
      a: "Yes — bathroom renovations, custom tile and glass showers, kitchen upgrades and small remodels." },
    { q: "Is your work guaranteed?",
      a: "All materials and workmanship are guaranteed for 12 months unless we've told you otherwise in writing. If we make a mistake, we make it right." },
    { q: "Who is coming into my house?",
      a: "Every technician is background-checked. We turn up when we said we would, in company clothing." },
    { q: "How do I get a price?",
      a: "Text a photo of the problem to (208) 584-1452. That's usually enough for a range without anyone driving out." },
    { q: "How far do you travel?",
      a: "Meridian, Boise, Nampa, Eagle, Kuna and Caldwell. If you're outside that, text us and we'll tell you straight." }
  ]
};
