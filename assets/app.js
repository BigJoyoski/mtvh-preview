/* ===========================================================================
   app.js — renders the variable parts of the page from window.SITE (content.js),
   emits schema.org JSON-LD, handles the form, and verifies the webfont loaded.

   DESIGN NOTE, recorded so it is not "fixed" later:
   The page ships COMPLETE, VALID HTML with real content already in it. This
   script overwrites the variable parts from content.js rather than building the
   page from nothing. That means:
     - it works with JavaScript off or broken (trade traffic is old Androids on
       bad connections; a blank page is a lost call),
     - crawlers see the content without executing anything,
     - and content.js is still the ONE place a re-skin happens, because every
       value it holds is written over the top on load.
   The cost is that index.html can go stale relative to content.js for a no-JS
   visitor. `node tools/check-content.js` fails loudly when it has.
   =========================================================================== */
(function () {
  'use strict';
  var S = window.SITE;
  if (!S) { console.error('[tradesites] content.js did not load — page is showing static defaults.'); return; }

  /* XSS invariant, stated so it survives edits:
     Every value interpolated into innerHTML below goes through esc(). The only
     data source is content.js, which is first-party and authored by whoever owns
     the site — there is no user input on this page except the form, which is
     never rendered back into the DOM. If you ever render a visitor-supplied
     value (a review pulled live from an API, a URL query parameter), escape it
     here or use textContent; do not widen this invariant quietly. */
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var slot = function (name) { return $('[data-slot="' + name + '"]'); };

  /* --- scalar bindings ---------------------------------------------------- */
  var VALUES = {
    business: S.business,
    legalName: S.legalName,
    since: S.since,
    trade: S.trade,
    base: S.base,
    radius: S.radiusMiles,
    phone: S.phone.display,
    licence: S.licence,
    insured: S.insured,
    hours: S.hours,
    responsePromise: S.responsePromise,
    notServing: S.notServing,
    rating: S.reviews && S.reviews.rating,
    reviewCount: S.reviews && S.reviews.count,
    /* The platform was hard-coded as "Google" in the markup. The figures actually
       came from Facebook, so publishing them under a Google label would have been a
       small, confident lie on the most trust-bearing line of the page. */
    reviewSource: S.reviews && S.reviews.source,
    /* MTVH: three VERIFIED trust marks replace the licence/insured/bonded row in
       the masthead. Measured — 8 of 12 trade sites and 3 of 4 Treasure Valley
       rivals show nothing at all above the fold. */
    guarantee: S.guarantee,
    backgroundChecked: S.backgroundChecked,
    award: S.award,
    strapline: S.strapline,
    ownerName: S.person && S.person.name
  };
  $$('[data-bind]').forEach(function (el) {
    var k = el.getAttribute('data-bind');
    if (k === 'tel') { el.setAttribute('href', 'tel:' + S.phone.tel); return; }
    /* This client's primary contact is a TEXT — their live site's main CTA is an
       sms: link. Both are offered and the text is given equal weight, which no
       Treasure Valley rival does. */
    if (k === 'sms') { el.setAttribute('href', 'sms:' + (S.phone.sms || S.phone.tel)); return; }
    if (VALUES[k] !== undefined && VALUES[k] !== null) el.textContent = VALUES[k];
  });

  /* --- values: the client's own words, currently buried on /about-us ------- */
  var vl = slot('values');
  if (vl && S.values) vl.innerHTML = S.values.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('');

  /* --- TOWN PAGE ----------------------------------------------------------
     Selected by ?t=<slug> in development. In production each town gets its own
     file with the slug hard-coded — a real URL per town is worth more than the
     DRY, and a query string will not rank.

     The evidence section is the ONLY part of a town page that differs between
     towns. If it is empty the page is a doorway page, so the note says so
     plainly and tools/town-gate.js refuses to publish it. */
  /* A built town page ships at a real URL with no query string and declares its slug.
     Order: baked > query > first town. */
  var townSlug = window.__TOWN_SLUG || (location.search.match(/[?&]t=([^&]+)/) || [])[1];
  var town = (S.townPages || []).filter(function (t) {
    return townSlug ? t.slug === townSlug : false;
  })[0] || (S.townPages || [])[0];

  if (town && document.querySelector('[data-town]')) {
    $$('[data-town]').forEach(function (el) {
      var k = el.getAttribute('data-town');
      if (k === 'position' && !town.position) { el.textContent = 'We cover ' + town.name + '.'; return; }
      if (town[k] != null) el.textContent = town[k];
    });
    document.title = 'Handyman in ' + town.name + ', Idaho — ' + S.business;

    var tj = slot('townJobs'), tn = slot('townJobsNote');
    var real = (town.jobs || []).filter(function (j) { return j && j.job && !/^\s*\[/.test(j.job); });
    if (tj && real.length) {
      tj.innerHTML = real.map(function (j, i) {
        return '<figure class="photo" style="--ratio:4/3;margin:0">' +
          '<img src="assets/photos/' + esc(j.photo) + '" width="900" height="675" ' +
          'loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async" alt="' + esc(j.alt || j.job) + '">' +
          '<figcaption class="photo__cap"><b>' + esc(j.job) + '</b>' +
          '<span class="photo__meta"><span>' + esc(town.name) + '</span><span class="sep" aria-hidden="true">/</span>' +
          '<span class="num">' + esc(j.date) + '</span></span></figcaption></figure>';
      }).join('');
      if (tn) tn.textContent = 'Recent work in ' + town.name + '.';
    } else if (tn) {
      tn.textContent = '[ NOT READY TO PUBLISH — needs 2+ real ' + town.name +
        ' jobs with a photo and a month. ' + (town.needs || '') + ' ]';
    }

  }

  /* Cross-links to the towns. Rendered on ANY page carrying the slot — about and
     thanks want them too — excluding the current town when there is one. Keeping
     this inside the town-page branch left about.html showing a hard-coded single
     "Meridian" chip. */
  var tl = slot('townLinks');
  if (tl) {
    var here = town && document.querySelector('[data-town]') ? town.slug : null;
    tl.innerHTML = (S.townPages || []).filter(function (t) { return t.slug !== here; })
      .map(function (t) { return '<li><a href="town.html?t=' + esc(t.slug) + '">' + esc(t.name) + '</a></li>'; }).join('');
  }

  /* --- the rating block is REVEALED, never defaulted ----------------------
     data-bind only overwrites a non-null value, so any number left in the static
     HTML would survive for a client whose rating is unknown. The block therefore
     ships hidden and is shown only when both figures are real. */
  var rb = $('#ratingblock');
  if (rb) rb.hidden = !(S.reviews && S.reviews.rating && S.reviews.count);

  /* --- credentials line: only claims the client actually holds -------------
     "Bonded" used to be hard-coded in the footer and asserted itself whatever
     content.js said. A credential is a claim; it has to come from the data. */
  var cr = slot('credentials');
  if (cr) {
    var parts = [];
    if (S.licence) parts.push('Licensed <span class="num">' + esc(S.licence) + '</span>');
    if (S.insured) parts.push(esc(S.insured));
    if (S.bonded === true) parts.push('Bonded');
    cr.innerHTML = parts.join(' &middot; ');
  }

  /* --- services: numbered line items -------------------------------------- */
  var sv = slot('services');
  if (sv && S.services) {
    sv.innerHTML = S.services.map(function (s, i) {
      var n = String(i + 1).padStart(2, '0');
      return '<li class="item' + (s.urgent ? ' item--urgent' : '') + '">' +
        '<span class="item__n num">' + n + '</span>' +
        '<div class="item__body">' +
          '<h3 class="item__name"><a href="service.html?s=' + esc(s.slug) + '">' + esc(s.name) + '</a></h3>' +
          '<p class="item__scope">' + esc(s.scope) + '</p>' +
        '</div>' +
        '<p class="item__basis num">' + esc(s.basis) + '</p>' +
      '</li>';
    }).join('');
  }

  /* --- towns -------------------------------------------------------------- */
  var tw = slot('towns');
  if (tw && S.towns) tw.innerHTML = S.towns.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

  /* --- jobs: photo + job/town/date caption --------------------------------
     The caption is the treatment that makes a mediocre phone snapshot read as
     evidence rather than as filler. See SYSTEM.md §4. */
  var jb = slot('jobs');
  if (jb && S.jobs) {
    jb.innerHTML = S.jobs.map(function (j, i) {
      return '<figure class="photo" style="--ratio:4/3;margin:0">' +
        '<img src="assets/photos/' + esc(j.photo) + '" width="900" height="675" ' +
        'loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async" alt="' + esc(j.alt) + '">' +
        '<figcaption class="photo__cap">' +
          '<b>' + esc(j.job) + '</b>' +
          '<span class="photo__meta">' +
            '<span>' + esc(j.town) + '</span><span class="sep" aria-hidden="true">/</span>' +
            '<span class="num">' + esc(j.date) + '</span>' +
            (j.days ? '<span class="sep" aria-hidden="true">/</span><span class="num">' + esc(j.days) + ' day' + (j.days > 1 ? 's' : '') + '</span>' : '') +
          '</span>' +
        '</figcaption>' +
      '</figure>';
    }).join('');
  }

  /* --- review quotes ------------------------------------------------------ */
  var qt = slot('quotes');
  if (qt && S.reviews && S.reviews.quotes) {
    qt.innerHTML = S.reviews.quotes.map(function (q) {
      return '<blockquote class="quote"><p>' + esc(q.text) + '</p>' +
        '<footer><b>' + esc(q.who) + '</b> / ' + esc(q.town) + ' / ' + esc(q.job) + '</footer></blockquote>';
    }).join('');
  }

  /* --- FAQ ---------------------------------------------------------------- */
  var fq = slot('faq');
  if (fq && S.faq) {
    fq.innerHTML = S.faq.map(function (f) {
      return '<dt style="font-weight:700;margin-top:var(--s-3)">' + esc(f.q) + '</dt>' +
        '<dd class="micro" style="margin:var(--s-1) 0 0">' + esc(f.a) + '</dd>';
    }).join('');
  }

  /* --- form endpoint ------------------------------------------------------ */
  var form = $('#jobform');
  if (form && S.form && S.form.action) form.setAttribute('action', S.form.action);

  /* WITHOUT JavaScript the form posts normally and the browser follows the provider's
     response — landing a homeowner who just gave you their phone number on a
     Formspree-branded page belonging to a company they have never heard of. Formspree
     honours a `_next` field; Netlify uses the form action instead. Absolute URL, built
     from the live origin so it is right on every environment without being configured.
     Nothing here fires when JS is on: the fetch path never leaves the page. */
  if (form && S.form && S.form.thanks) {
    var nxt = document.createElement('input');
    nxt.type = 'hidden';
    nxt.name = '_next';
    nxt.value = new URL(S.form.thanks, location.href).href;
    form.appendChild(nxt);
  }

  /* =========================================================================
     SCHEMA — LocalBusiness + Service + AggregateRating + FAQPage.
     AggregateRating is emitted ONLY when a real rating and count exist in
     content.js. Asserting a rating the business does not have is a lie and a
     manual-action risk, so the absence of data must produce an absence of
     markup rather than a zero.
     ========================================================================= */
  /* A field still carrying a "[ ... ]" placeholder is NOT a fact. It may render
     on the page — where it reads visibly as unfinished and gets fixed — but it
     must never enter structured data, where Google would read it as a claim. */
  var ph = function (v) {
    return (typeof v === 'string' && /^\s*\[.*\]\s*$/.test(v)) ? undefined : (v || undefined);
  };

  var ld = {
    '@context': 'https://schema.org',
    '@graph': []
  };
  var biz = {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness', 'GeneralContractor'],
    '@id': location.origin + '/#business',
    name: S.legalName || S.business,
    alternateName: S.business,
    description: S.trade + ' in ' + S.base + ' and ' + S.radiusMiles + ' miles around.',
    telephone: S.phone.tel,
    email: S.email,
    url: location.origin + '/',
    /* A missing fact must produce ABSENT markup, never the string "null" and
       never a bracketed placeholder. `ph()` returns undefined for anything still
       unverified, and the JSON.stringify replacer below drops undefined keys. */
    foundingDate: S.since ? String(S.since) : undefined,
    areaServed: (S.towns || []).map(function (t) { return { '@type': 'City', name: t }; }),
    address: S.address
      ? { '@type': 'PostalAddress', streetAddress: S.address.street, addressLocality: S.address.city,
          addressRegion: S.address.region, postalCode: S.address.postal, addressCountry: 'US' }
      : { '@type': 'PostalAddress', addressLocality: (S.base || '').split(',')[0].trim(),
          addressRegion: ((S.base || '').split(',')[1] || '').trim(), addressCountry: 'US' },
    openingHours: S.hours,
    hasCredential: ph(S.licence),
    sameAs: S.gbp && S.gbp.profileUrl ? [S.gbp.profileUrl] : undefined
  };
  if (S.reviews && S.reviews.rating && S.reviews.count) {
    biz.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: S.reviews.rating,
      reviewCount: S.reviews.count,
      bestRating: 5, worstRating: 1
    };
  }
  ld['@graph'].push(biz);

  (S.services || []).forEach(function (s) {
    ld['@graph'].push({
      '@type': 'Service',
      name: s.name,
      description: s.scope,
      serviceType: s.name,
      provider: { '@id': location.origin + '/#business' },
      areaServed: (S.towns || []).map(function (t) { return { '@type': 'City', name: t }; })
    });
  });

  if (S.faq && S.faq.length) {
    ld['@graph'].push({
      '@type': 'FAQPage',
      mainEntity: S.faq.map(function (f) {
        return { '@type': 'Question', name: f.q,
                 acceptedAnswer: { '@type': 'Answer', text: f.a } };
      })
    });
  }

  var tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(ld, function (k, v) { return v === undefined ? undefined : v; });
  document.head.appendChild(tag);

  /* =========================================================================
     FORM SUBMIT — progressive. Without JS the form posts normally to the
     endpoint and the visitor sees the provider's page. With JS they stay here.
     ========================================================================= */
  if (form) {
    var status = $('#formstatus');
    var btn = $('.submit', form);
    form.addEventListener('submit', function (e) {
      if (!form.action || form.action.indexOf('REPLACE_ME') !== -1) {
        e.preventDefault();
        say('This form is not wired up yet — set form.action in content.js.', 'error');
        return;
      }
      var missing = ['name', 'phone', 'job'].filter(function (n) {
        var f = form.elements[n];
        return !f || !String(f.value).trim();
      });
      if (missing.length) {
        e.preventDefault();
        say('Still need: ' + missing.join(', ') + '.', 'error');
        var first = form.elements[missing[0]];
        if (first) first.focus();
        return;
      }
      if (!window.fetch) return;            /* let it post normally */
      e.preventDefault();
      btn.disabled = true;
      say('Sending…', '');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          form.reset();
          say('Got it. ' + (S.responsePromise || 'We will call you back.'), 'ok');
        })
        .catch(function (err) {
          /* Honest failure microcopy: say what happened and what to do instead.
             Never "Something went wrong." The phone number IS the fallback. */
          say('That did not send (' + err.message + '). Call ' + S.phone.display + ' instead — it is quicker anyway.', 'error');
        })
        .then(function () { btn.disabled = false; });
    });
    function say(msg, state) {
      if (!status) return;
      status.textContent = msg;
      status.setAttribute('data-state', state || '');
    }
  }

  /* =========================================================================
     CALL TRACKING — every tel: click reports where on the page it came from.
     PLAYBOOK.md §5: without this the renewal conversation is a feeling rather
     than a number. Wire `window.trackCall` to the client's analytics.
     ========================================================================= */
  $$('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var where = a.getAttribute('data-call') || 'unknown';
      if (typeof window.trackCall === 'function') window.trackCall(where);
      if (typeof window.gtag === 'function') window.gtag('event', 'call_click', { placement: where });
    });
  });

  /* =========================================================================
     FONT VERIFICATION — a bundled face nobody references looks exactly like a
     working one, and a blocked CDN looks like a design choice. Say so out loud.
     DO NOT use document.fonts.check() for this. VERIFIED 2026-09-11: on a page where
     Archivo is not declared at all, `document.fonts.check('700 16px "Archivo"')` returns
     TRUE — the API means "can this render right now without waiting", and an undeclared
     family resolves to a fallback immediately, so it is trivially ready. It reports a
     blocked CDN as a success. Enumerate the FontFaceSet instead: a page that never loaded
     the face has ZERO entries for it. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      var want = ['Archivo'];
      var have = [];
      document.fonts.forEach(function (f) {
        if (f.status === 'loaded') have.push(String(f.family).replace(/["']/g, ''));
      });
      var missing = want.filter(function (f) { return have.indexOf(f) === -1; });
      window.__fontsLoaded = want.length - missing.length;
      window.__fontsWanted = want.length;
      window.__fontFaces = have;
      if (missing.length) console.warn('[tradesites] FALLBACK IN USE, webfont did not load:', missing.join(', '));
    });
  }
})();
