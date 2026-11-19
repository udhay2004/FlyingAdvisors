// Content for every inner page. Rendered by scripts/build-pages.mjs.
//
// Rules for anything written here:
//   - Facts about Flying Advisors come only from the existing site or the owner.
//     Unverified network figures (aircraft/operator counts, response times) are
//     deliberately NOT repeated on these pages; see docs/owner-questions.md.
//   - General aviation facts (typical ranges, how empty legs work) are labelled
//     as indicative.
//   - No prices, ratings, awards or certifications unless the owner supplies them.
//   - Each page opens with a direct answer (about 40–60 words) that an AI
//     assistant or search snippet can quote on its own.
//
// Fields: path, label (short name), summary (one line, for cards and llms.txt),
// title (<60 chars), description (<160 chars), eyebrow, h1, answer, body (HTML),
// faqs [{q, a}], related [paths], parent (path), service {name, type},
// image {slug, alt}, cta {label, href}, updated (YYYY-MM-DD).

export const SITE = {
  url: 'https://flyingadvisors.com',
  updated: '2026-11-19',
  homeUpdated: '2026-11-19',
  ogImage: '/assets/share/og-home-v1.jpg',
};

const INDICATIVE =
  '<p class="page-note">Figures are indicative manufacturer-type values for typical models in the category. Real range and capacity depend on the exact aircraft, its cabin configuration, passengers, baggage, weather and the airports involved. Your advisor confirms the numbers for your specific trip.</p>';

const QUOTE = (tab) => ({ label: tab === 'sell' ? 'Value my aircraft' : tab === 'buy' ? 'Start an acquisition brief' : 'Request a quote', href: `/?enquiry=${tab}#quote` });

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

const SERVICES = [
  {
    path: '/private-jet-charter/',
    label: 'Private jet charter',
    summary: 'On-demand one-way, return and multi-leg flights, compared across operators.',
    title: 'Private Jet Charter, Worldwide | Flying Advisors',
    description: 'Charter a private jet one-way, return or multi-leg. Flying Advisors compares vetted operators and confirms your flight with an all-inclusive quote.',
    eyebrow: 'On-demand charter',
    h1: 'Private jet charter, <em>on your schedule.</em>',
    answer:
      'Private jet charter means hiring a whole aircraft, with its crew, for your own journey: you choose the route, the departure time and who flies. Flying Advisors is an independent broker, so we compare suitable aircraft from vetted operators, then confirm one all-inclusive quote for one-way, return or multi-leg trips.',
    service: { name: 'Private jet charter', type: 'Private aircraft charter brokerage' },
    cta: QUOTE('fly'),
    body: `
      <section class="page-section">
        <h2>How charter works with us</h2>
        <ol class="page-steps">
          <li><strong>Tell us the trip.</strong> Route, dates, number of guests, baggage and anything special, such as pets or catering. One line on WhatsApp is enough to start.</li>
          <li><strong>We compare the market.</strong> Your advisor matches the aircraft category to the mission, checks which suitable aircraft are available and positioned well, and compares operators.</li>
          <li><strong>You approve one clear quote.</strong> Aircraft, crew, fuel, fees, taxes and handling are shown upfront, with optional extras listed separately.</li>
          <li><strong>We look after the flight.</strong> Your advisor and the global desk follow the trip from door to door, and line up a replacement aircraft if the original goes technical.</li>
        </ol>
      </section>

      <section class="page-section">
        <h2>One-way, return or multi-leg</h2>
        <p><strong>One-way</strong> suits a single journey, or a return you want to keep flexible. <strong>Return</strong> keeps the same aircraft and crew, which is often better value when the gap between flights is short. <strong>Multi-leg</strong> covers roadshows, tours and itineraries with several stops, planned as one operation.</p>
      </section>

      <section class="page-section">
        <h2>Choosing the right aircraft</h2>
        <p>We match the aircraft to the mission, not to an inventory we need to fill. Distance, guests, baggage, runway length and the cabin you want all narrow the choice. As a rule of thumb, turboprops and light jets suit hops of up to about three hours, midsize and super-midsize jets cover regional and transcontinental flights, and heavy and ultra-long-range jets fly intercontinental routes non-stop.</p>
        <p><a class="link-arrow" href="/aircraft/">Compare the aircraft categories →</a></p>
      </section>

      <section class="page-section">
        <h2>What affects the price</h2>
        <p>Charter is priced per trip rather than per seat. The main factors are the aircraft category, the flying hours (including any positioning to collect you), airport, landing and handling fees, crew overnights on multi-day trips, taxes, and demand on the dates you need. Flexibility helps: a nearby airport, a slightly different time or an <a href="/empty-leg-flights/">empty leg</a> can lower the cost noticeably.</p>
      </section>

      <section class="page-section">
        <h2>Safety and who operates your flight</h2>
        <p>Flying Advisors acts as your broker and agent; we do not operate aircraft. Each flight is performed by an operator holding the required air operator certification in its country of registry (in India, a DGCA Non-Scheduled Operator permit), which keeps full operational control. Operators are reviewed for certification, insurance, crew qualifications and safety history before they fly our clients.</p>
      </section>`,
    faqs: [
      { q: 'How much does it cost to charter a private jet?', a: 'It depends mainly on the aircraft category and the hours flown, including any positioning, plus airport fees, crew costs and taxes. Because every trip is different, we quote each one individually and all-inclusive, so the price you approve is the price you pay.' },
      { q: 'How far in advance should I book?', a: 'Many flights can be arranged for the same or next day, subject to aircraft position, permits and airport slots. Booking earlier gives more choice, especially at peak dates and for larger aircraft.' },
      { q: 'Can I bring pets on a private jet?', a: 'Often, yes. Many operators accept pets in the cabin, subject to the aircraft, the operator and the import rules of the destination. Tell us when you request a quote and we will confirm what applies.' },
      { q: 'Do you own the aircraft?', a: 'No. As an independent broker we choose from many operators for each journey, so the aircraft fits your trip rather than an inventory we need to fill.' },
    ],
    related: ['/empty-leg-flights/', '/aircraft/', '/group-charter/'],
  },
  {
    path: '/empty-leg-flights/',
    label: 'Empty leg flights',
    summary: 'Repositioning flights at preferential rates, for travellers with flexible plans.',
    title: 'Empty Leg Private Jet Flights | Flying Advisors',
    description: 'What empty leg flights are, how much flexibility they need, and how to get current empty legs from Flying Advisors on WhatsApp.',
    eyebrow: 'Empty legs',
    h1: 'Empty leg flights, <em>released to you first.</em>',
    answer:
      'An empty leg is a private flight that would otherwise fly without passengers, usually because an aircraft must return home or reposition for its next charter. Operators offer these legs at preferential rates. They suit travellers with flexible dates, and Flying Advisors shares current empty legs with clients on request and by WhatsApp alerts.',
    service: { name: 'Empty leg flights', type: 'Private jet empty leg brokerage' },
    cta: { label: 'Get empty-leg alerts on WhatsApp', href: 'https://wa.me/18635121034' },
    body: `
      <section class="page-section">
        <h2>Current empty legs</h2>
        <p>Empty legs appear and disappear daily as charter schedules change, so we do not publish a static list. <strong>Message us with the routes and dates you are interested in</strong> and your advisor will send what is available now, or alert you when a match appears.</p>
        <p><a class="button button--primary" href="https://wa.me/18635121034" target="_blank" rel="noopener">Ask for today's empty legs on WhatsApp</a></p>
      </section>

      <section class="page-section">
        <h2>Why empty legs exist</h2>
        <p>When a client charters a one-way flight, the aircraft often has to fly back to its base, or on to collect the next client, without passengers. Rather than fly empty, operators sell that leg at a reduced rate. The route and timing are set by the original booking, which is why empty legs reward flexibility.</p>
      </section>

      <section class="page-section">
        <h2>What to know before you book</h2>
        <ul>
          <li><strong>The route and time are mostly fixed.</strong> Small changes may be possible, but the leg exists because of someone else's trip.</li>
          <li><strong>It can change.</strong> If the original charter moves or cancels, the empty leg can move or cancel too. Have a back-up plan for time-critical travel.</li>
          <li><strong>You still get the whole aircraft.</strong> The same crew, cabin and operator standards apply as on any charter.</li>
          <li><strong>Return flights are separate.</strong> An empty leg is usually one-way; we can quote the return as a normal charter or watch for another empty leg.</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>Who empty legs suit</h2>
        <p>Empty legs work well for leisure trips, flexible business travel, and anyone who can move a day either way. For a fixed meeting or an event you cannot miss, a standard <a href="/private-jet-charter/">charter</a> gives certainty.</p>
      </section>`,
    faqs: [
      { q: 'What is an empty leg flight?', a: 'A private flight that would otherwise fly with no passengers, usually because the aircraft is returning to base or repositioning for its next booking. Operators offer these legs at preferential rates.' },
      { q: 'Are empty legs cheaper than a normal charter?', a: 'Usually, yes, because the operator would otherwise fly the leg empty. The exact saving varies by route, aircraft and timing, so we confirm the price for each leg.' },
      { q: 'Can an empty leg be cancelled?', a: 'Yes. If the original charter changes, the empty leg can change or be cancelled. For travel that cannot move, we recommend a standard charter or a back-up plan.' },
      { q: 'How do I hear about empty legs?', a: 'Message the 24/7 desk on WhatsApp at +1 863 512 1034 with the routes and dates you are interested in, and we will send current options and alerts.' },
    ],
    related: ['/private-jet-charter/', '/aircraft/', '/faq/'],
  },
  {
    path: '/buy-private-jet/',
    label: 'Buy a private jet',
    summary: 'Mission profiling, on- and off-market search, valuation, inspection and closing.',
    title: 'Buy a Private Jet: Acquisition Advisory | Flying Advisors',
    description: 'Buying a private jet with Flying Advisors: mission and budget profile, on- and off-market search, valuation, pre-purchase inspection, escrow and delivery.',
    eyebrow: 'Aircraft acquisition',
    h1: 'Buying a private jet, <em>with nothing left to chance.</em>',
    answer:
      'Buying a private jet starts with your mission: how far, how often and with how many people you fly. Flying Advisors turns that into a shortlist, searches on- and off-market aircraft worldwide, negotiates the price, arranges the pre-purchase inspection and handles closing and delivery, acting for you as buyer.',
    service: { name: 'Aircraft acquisition advisory', type: 'Aircraft purchase brokerage' },
    cta: QUOTE('buy'),
    body: `
      <section class="page-section">
        <h2>Should you buy, or keep chartering?</h2>
        <p>Ownership starts to make sense when you fly often enough, on predictable missions, that having an aircraft available matters more than flexibility. It also brings fixed costs: crew, hangar, insurance, maintenance and management. We give you a straight comparison of charter, jet card and ownership for your actual flying before recommending a purchase.</p>
      </section>

      <section class="page-section">
        <h2>The acquisition process</h2>
        <ol class="page-steps">
          <li><strong>Mission and budget profile.</strong> Typical routes, guests, runway needs, cabin, budget and how the aircraft will be operated and managed.</li>
          <li><strong>On- and off-market search.</strong> Listed aircraft, plus aircraft whose owners are open to selling but have not advertised.</li>
          <li><strong>Valuation and negotiation.</strong> Comparable sales, maintenance status and records inform the offer, and we negotiate terms on your behalf.</li>
          <li><strong>Inspection, escrow and delivery.</strong> Independent pre-purchase inspection, deposit and funds held through an escrow agent until closing, then registration and delivery.</li>
        </ol>
      </section>

      <section class="page-section">
        <h2>What to check in any aircraft</h2>
        <ul>
          <li>Complete maintenance records and the status of major inspections</li>
          <li>Engine and APU programme enrolment and hours</li>
          <li>Damage history and any outstanding airworthiness items</li>
          <li>Avionics and connectivity, and any upgrades due</li>
          <li>Registration, import and tax implications for where it will be based</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>Confidential throughout</h2>
        <p>Names and transactions stay private, and we sign NDAs on request. You can start with a short, no-obligation conversation.</p>
      </section>`,
    faqs: [
      { q: 'How do I buy a private jet?', a: 'Define your mission and budget, compare suitable models, search listed and off-market aircraft, agree a price, complete an independent pre-purchase inspection, then close through escrow and take delivery. An advisor can manage each step for you.' },
      { q: 'What is a pre-purchase inspection?', a: 'An independent technical inspection of the aircraft and its records before the sale completes. It confirms condition and maintenance status, and often shapes the final price.' },
      { q: 'What does off-market mean?', a: 'An aircraft whose owner is open to selling but has not listed it publicly. Off-market options can widen your choice and keep both sides private.' },
    ],
    related: ['/sell-private-jet/', '/aircraft/', '/private-jet-charter/'],
  },
  {
    path: '/sell-private-jet/',
    label: 'Sell your aircraft',
    summary: 'Confidential marketing to qualified buyers, valuation and negotiation.',
    title: 'Sell Your Private Jet Confidentially | Flying Advisors',
    description: 'Sell your aircraft with Flying Advisors: market valuation, confidential presentation to qualified buyers and operators, negotiation, escrow and closing.',
    eyebrow: 'Aircraft sales',
    h1: 'Selling your aircraft, <em>quietly.</em>',
    answer:
      'To sell a private jet well, you need an accurate market valuation, complete records and access to buyers who are ready to act. Flying Advisors values the aircraft, presents it privately to qualified buyers and operators, never advertising without your consent, then negotiates and manages inspection, escrow and closing.',
    service: { name: 'Aircraft sales brokerage', type: 'Aircraft sale brokerage' },
    cta: QUOTE('sell'),
    body: `
      <section class="page-section">
        <h2>How a sale works</h2>
        <ol class="page-steps">
          <li><strong>Valuation.</strong> Comparable transactions, hours and cycles, maintenance status, programmes and specification set a price the market will defend.</li>
          <li><strong>Preparation.</strong> Records reviewed and organised, and any items a buyer's inspection would raise identified early.</li>
          <li><strong>Confidential marketing.</strong> The aircraft is presented privately to qualified buyers and operators. Public listing happens only if you agree.</li>
          <li><strong>Negotiation and closing.</strong> Offers, letter of intent, pre-purchase inspection, deposit and proceeds held through an escrow agent, then transfer of title.</li>
        </ol>
      </section>

      <section class="page-section">
        <h2>Why discretion matters</h2>
        <p>An aircraft that sits publicly listed for months can lose value in buyers' eyes, and many owners prefer that a sale is not known. Presenting the aircraft first to buyers we already know keeps the process private and focused.</p>
      </section>

      <section class="page-section">
        <h2>What helps an aircraft sell</h2>
        <ul>
          <li>Complete, well-organised maintenance records</li>
          <li>Engines and APU enrolled on maintenance programmes</li>
          <li>Recent major inspections, or a clear plan for upcoming ones</li>
          <li>Realistic pricing from the start</li>
        </ul>
      </section>`,
    faqs: [
      { q: 'How is my aircraft valued?', a: 'From comparable recent transactions, adjusted for hours and cycles, maintenance status and programmes, specification, damage history and market demand for the model.' },
      { q: 'Will my aircraft be advertised publicly?', a: 'Only with your consent. We first present it privately to qualified buyers and operators.' },
      { q: 'How is the money protected?', a: 'Deposits and sale proceeds are held through an escrow agent until closing, so neither side is exposed while conditions are met.' },
    ],
    related: ['/buy-private-jet/', '/for-operators/', '/about/'],
  },
  {
    path: '/group-charter/',
    label: 'Group & event charter',
    summary: 'VIP airliners and multi-aircraft movements for weddings, delegations and tours.',
    title: 'Group & Event Charter Flights | Flying Advisors',
    description: 'Group charter for weddings, delegations, tours and events: VIP airliners and multi-aircraft movements, coordinated by Flying Advisors as one operation.',
    eyebrow: 'Group & event charter',
    h1: 'Group charter, <em>moved as one.</em>',
    answer:
      'Group charter means hiring an aircraft, or several, for a whole group travelling together: wedding guests, delegations, teams, tours or corporate events. Flying Advisors sources the right capacity, from several jets flying together to a VIP airliner, and coordinates schedules, permits and ground arrangements as one operation.',
    service: { name: 'Group and event charter', type: 'Group air charter brokerage' },
    cta: QUOTE('fly'),
    body: `
      <section class="page-section">
        <h2>Typical group journeys</h2>
        <ul>
          <li><strong>Weddings and celebrations:</strong> guests flown in from one or several cities, on schedule</li>
          <li><strong>Delegations and state travel:</strong> VIP airliners and secure, private handling</li>
          <li><strong>Corporate events and roadshows:</strong> teams moved between cities on a tight timetable</li>
          <li><strong>Sports teams, artists and tours:</strong> multi-leg itineraries with equipment</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>One large aircraft, or several smaller ones?</h2>
        <p>A <a href="/aircraft/vip-airliner/">VIP airliner</a> keeps everyone together in one cabin. Several smaller jets can depart from different cities, use smaller airports closer to the venue, and keep travel flexible for different parts of the group. We compare both and recommend what fits the schedule and budget.</p>
      </section>

      <section class="page-section">
        <h2>What we coordinate</h2>
        <p>Aircraft and crew, slots and permits, catering, baggage and equipment, ground transport and terminal arrangements at each end, so the group experiences one seamless journey.</p>
      </section>`,
    faqs: [
      { q: 'How many people can a group charter carry?', a: 'From a handful of guests in a single jet to large groups on airliners or several aircraft flying together. Capacity depends on the aircraft and its configuration, so tell us the group size and we will match it.' },
      { q: 'How early should we book a group charter?', a: 'As early as possible, especially for large aircraft, peak dates or events where many groups compete for the same airports and slots.' },
    ],
    related: ['/aircraft/vip-airliner/', '/private-jet-charter/', '/contact/'],
  },
  {
    path: '/air-ambulance-medical-flights/',
    label: 'Medical & urgent flights',
    summary: 'Air-ambulance and repatriation flights through specialist operators, around the clock.',
    title: 'Air Ambulance & Medical Flights | Flying Advisors',
    description: 'Flying Advisors arranges air-ambulance and medical repatriation flights through specialist operators, around the clock. How it works and what to have ready.',
    eyebrow: 'Medical & urgent',
    h1: 'Medical and urgent flights, <em>when every hour matters.</em>',
    answer:
      'An air-ambulance flight moves a patient by air with medical care on board, for transfer between hospitals or repatriation home. Flying Advisors arranges air-ambulance and repatriation flights through specialist operators around the clock: we find an available aircraft and medical team, and coordinate permits and ground ambulances at both ends.',
    service: { name: 'Air ambulance and medical repatriation arrangement', type: 'Air ambulance brokerage' },
    cta: { label: 'Message the 24/7 desk', href: 'https://wa.me/18635121034' },
    body: `
      <section class="page-section page-section--notice">
        <p><strong>In a medical emergency, contact local emergency services first.</strong> We arrange flights between facilities and for repatriation; we are not an emergency response service.</p>
      </section>

      <section class="page-section">
        <h2>How we help</h2>
        <ul>
          <li>Air-ambulance flights operated by specialist medical aviation operators, with medical crew and equipment suited to the patient</li>
          <li>Repatriation of patients to their home country</li>
          <li>Urgent passenger flights when family or specialists need to travel at short notice</li>
          <li>Coordination of permits, hospital handovers and ground ambulances at both ends</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>What to have ready</h2>
        <ul>
          <li>Patient's current location (hospital and city) and destination</li>
          <li>A short medical summary from the treating doctor, and whether the patient is stable to fly</li>
          <li>Number of companions travelling</li>
          <li>Passport and visa details for international flights</li>
          <li>Insurance details, if an insurer is involved</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>Who decides if a patient can fly</h2>
        <p>The specialist operator's medical team assesses each case with the treating doctors and decides the medical crew and equipment needed. We coordinate everything around that decision.</p>
      </section>`,
    faqs: [
      { q: 'What is the difference between an air ambulance and a private jet charter?', a: 'An air ambulance carries a patient with medical crew and equipment, operated by a specialist medical operator. A private charter carries passengers. For urgent travel by family or specialists, a standard charter can be arranged alongside.' },
      { q: 'Can you arrange medical repatriation from abroad?', a: 'Yes. We arrange repatriation flights through specialist operators and coordinate permits, hospital handovers and ground ambulances at both ends.' },
      { q: 'Is the service available at night and on weekends?', a: 'Yes. The global desk can be reached around the clock on WhatsApp at +1 863 512 1034.' },
    ],
    related: ['/private-jet-charter/', '/contact/', '/about/'],
  },
];

// ---------------------------------------------------------------------------
// Company pages
// ---------------------------------------------------------------------------

const COMPANY = [
  {
    path: '/for-operators/',
    label: 'For operators',
    summary: 'Join the operator network: fill empty sectors and reach clients on other continents.',
    title: 'For Aircraft Operators & Owners | Flying Advisors',
    description: 'Aircraft operators and owners: join the Flying Advisors network to fill empty sectors, reach charter clients on other continents and grow utilisation.',
    eyebrow: 'Operator network',
    h1: 'For operators who want <em>better utilisation.</em>',
    answer:
      'Flying Advisors works with certified aircraft operators and owners worldwide. Joining the network gives your aircraft access to charter clients on other continents, a channel for empty sectors, and a broker that represents them professionally. Operators keep full operational control; we bring demand and handle the client relationship.',
    cta: { label: 'Apply to join the network', href: '/contact/' },
    body: `
      <section class="page-section">
        <h2>What the network offers operators</h2>
        <ul>
          <li><strong>Demand from other regions:</strong> clients who would not find your aircraft directly</li>
          <li><strong>Empty sectors filled:</strong> repositioning legs offered to clients first, as <a href="/empty-leg-flights/">empty legs</a></li>
          <li><strong>Well-briefed trips:</strong> clear requirements, confirmed passengers and a single point of contact</li>
          <li><strong>Sales and acquisition reach:</strong> owners in the network can buy or sell aircraft through the same relationship</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>What we ask of operators</h2>
        <p>Before flying our clients, every operator is reviewed for its air operator certification, insurance, crew qualifications and safety history, and reviewed again over time. Operators keep full operational control of every flight.</p>
      </section>

      <section class="page-section">
        <h2>How to apply</h2>
        <p>Send your company name, air operator certificate details, fleet and base airports through the <a href="/contact/">contact page</a> or on WhatsApp. Our network team will come back to you.</p>
      </section>`,
    faqs: [
      { q: 'Who keeps operational control of flights?', a: 'The operator, always. Flying Advisors acts as broker and agent for clients and does not operate aircraft.' },
      { q: 'Which operators can join?', a: 'Operators holding the required air operator certification in their country of registry, with appropriate insurance and a sound safety record.' },
    ],
    related: ['/empty-leg-flights/', '/sell-private-jet/', '/about/'],
  },
  {
    path: '/about/',
    label: 'About Flying Advisors',
    summary: 'An independent private aviation broker, based in Noida, India, serving clients worldwide.',
    title: 'About Flying Advisors: Independent Private Aviation Broker',
    description: 'Flying Advisors is an independent private aviation broker based in Noida, India: charter, empty legs, and aircraft buying and selling through vetted operators.',
    eyebrow: 'About us',
    h1: 'An independent broker, <em>built as an ecosystem.</em>',
    answer:
      'Flying Advisors is an independent private aviation broker based in Noida, Uttar Pradesh, India, serving clients worldwide. We arrange private jet charter, empty legs, group and medical flights, and aircraft acquisition and sales. We do not own or operate aircraft; certified operators fly every trip, and we act for the client.',
    heroActions: false,
    body: `
      <section class="page-section">
        <h2>What we do</h2>
        <p>One advisor handles everything private aviation offers: <a href="/private-jet-charter/">on-demand charter</a>, <a href="/empty-leg-flights/">empty legs</a>, <a href="/group-charter/">group and event charter</a>, <a href="/air-ambulance-medical-flights/">medical and urgent flights</a>, and <a href="/buy-private-jet/">buying</a> or <a href="/sell-private-jet/">selling</a> an aircraft.</p>
      </section>

      <section class="page-section">
        <h2>How we work: the brokerage model</h2>
        <p>Flying Advisors acts as broker and agent for its clients and does not itself operate aircraft. Every flight is performed by an operator holding the required air operator certification in its country of registry (in India, a DGCA Non-Scheduled Operator permit), which retains full operational control.</p>
        <p>Because we are not tied to our own fleet, we can choose the aircraft that fits each journey, rather than the one we need to fill.</p>
      </section>

      <section class="page-section">
        <h2>Our commitments</h2>
        <ul>
          <li><strong>Operator safety vetting:</strong> certification, insurance, crew and safety history reviewed before any operator flies a client</li>
          <li><strong>All-inclusive quotes:</strong> fees, taxes, crew and handling shown upfront</li>
          <li><strong>Back-up aircraft:</strong> a replacement sourced quickly if an aircraft goes technical</li>
          <li><strong>Flight following:</strong> your advisor and the global desk watch each flight from door to door</li>
          <li><strong>Protected transactions:</strong> aircraft deposits and sale proceeds held through an escrow agent until closing</li>
          <li><strong>Confidential by default:</strong> names, itineraries and transactions protected; NDAs on request</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>Where we are</h2>
        <p>Our office is at A-143, Sector 63, Noida, Uttar Pradesh 201301, India. Clients are served worldwide, with regular work across the Americas, Europe, the Middle East and Africa, India and South Asia, and Asia-Pacific.</p>
        <p><a class="link-arrow" href="/contact/">Contact details and directions →</a></p>
      </section>`,
    faqs: [
      { q: 'Is Flying Advisors an airline or operator?', a: 'No. Flying Advisors is an independent broker and agent. Certified operators perform every flight and keep operational control.' },
      { q: 'Where is Flying Advisors based?', a: 'In Noida, Uttar Pradesh, India, at A-143, Sector 63, 201301. We serve clients worldwide.' },
    ],
    related: ['/private-jet-charter/', '/contact/', '/faq/'],
  },
  {
    path: '/contact/',
    label: 'Contact',
    summary: 'Phones, WhatsApp, email and the Noida office address, with directions.',
    title: 'Contact Flying Advisors: Phone, WhatsApp, Email & Office',
    description: 'Contact Flying Advisors: +91 93543 73625 (calls and WhatsApp), +1 863 512 1034 (WhatsApp, 24/7), concierge@flyingadvisors.com. Office in Noida, India.',
    eyebrow: 'Contact',
    h1: 'Speak to an advisor, <em>any hour.</em>',
    answer:
      'You can reach Flying Advisors by phone or WhatsApp on +91 93543 73625, on WhatsApp around the clock at +1 863 512 1034, or by email at concierge@flyingadvisors.com. Our office is at A-143, Sector 63, Noida, Uttar Pradesh 201301, India. For a flight quote, the request form is fastest.',
    heroActions: false,
    cta: { label: 'Request a quote', href: '/#quote' },
    body: `
      <section class="page-section">
        <h2>Contact details</h2>
        <dl class="contact-dl">
          <div><dt>Calls &amp; WhatsApp</dt><dd><a href="tel:+919354373625">+91 93543 73625</a> · <a href="https://wa.me/919354373625" target="_blank" rel="noopener">WhatsApp</a></dd></div>
          <div><dt>Global desk · WhatsApp only, 24/7</dt><dd><a href="https://wa.me/18635121034" target="_blank" rel="noopener">+1 863 512 1034</a></dd></div>
          <div><dt>Email</dt><dd><a href="mailto:concierge@flyingadvisors.com">concierge@flyingadvisors.com</a></dd></div>
          <div><dt>Office</dt><dd><address>Flying Advisors<br />A-143, Sector 63<br />Noida, Uttar Pradesh 201301<br />India</address></dd></div>
        </dl>
        <p><a class="button button--quiet" href="https://www.google.com/maps/search/?api=1&amp;query=A-143%2C%20Sector%2063%2C%20Noida%2C%20Uttar%20Pradesh%20201301" target="_blank" rel="noopener">Get directions in Google Maps</a></p>
      </section>

      <section class="page-section">
        <h2>Send a request</h2>
        <ul>
          <li><a href="/?enquiry=fly#quote">Request a flight quote</a> (route, dates, guests)</li>
          <li><a href="/?enquiry=buy#quote">Start an aircraft purchase</a></li>
          <li><a href="/?enquiry=sell#quote">Value or sell your aircraft</a></li>
          <li><a href="/#contact">Send a general message</a></li>
        </ul>
      </section>

      <section class="page-section">
        <h2>Service area</h2>
        <p>We arrange flights and aircraft transactions worldwide, with regular work in the Americas (New York, Miami, Los Angeles, São Paulo), Europe (London, Geneva, Nice, Paris), the Middle East and Africa (Dubai, Riyadh, Doha, Nairobi), India and South Asia (Mumbai, Delhi, Bengaluru, Colombo) and Asia-Pacific (Singapore, Hong Kong, Tokyo, Sydney).</p>
      </section>`,
    faqs: [
      { q: 'What is the fastest way to reach you?', a: 'WhatsApp. The global desk at +1 863 512 1034 is available 24/7, and +91 93543 73625 takes both calls and WhatsApp.' },
      { q: 'Can I visit the office?', a: 'Yes, by appointment. The office is at A-143, Sector 63, Noida, Uttar Pradesh 201301, India.' },
    ],
    related: ['/private-jet-charter/', '/about/', '/faq/'],
  },
  {
    path: '/faq/',
    label: 'FAQ',
    summary: 'Answers to the questions clients ask first: safety, pricing, timing, empty legs and ownership.',
    title: 'Private Jet Charter FAQ | Flying Advisors',
    description: 'Answers to common private aviation questions: who operates the flight, safety, pricing, how fast a jet can be arranged, empty legs, pets and buying a jet.',
    eyebrow: 'Before you fly',
    h1: 'Questions clients <em>ask us first.</em>',
    answer:
      'Most clients first ask who actually flies them, how safety is checked, what is included in the price and how quickly a flight can be arranged. In short: certified operators fly every trip, operators are vetted before they fly our clients, quotes are all-inclusive, and many flights can be confirmed for the same or next day.',
    body: `
      <section class="page-section">
        <p>Can't find your question? <a href="/contact/">Ask an advisor</a>: we reply personally.</p>
      </section>`,
    faqs: [
      { q: 'Do you own the aircraft we fly on?', a: 'No, and that is deliberate. As an independent broker we are free to choose the best aircraft from many operators for each journey, rather than the one we need to fill.' },
      { q: 'Who operates my flight?', a: 'An operator holding the required air operator certification in its country of registry (in India, a DGCA Non-Scheduled Operator permit). The operator keeps full operational control; Flying Advisors acts as your broker and agent.' },
      { q: 'How do you make sure an operator is safe?', a: 'Every operator is reviewed for certification, insurance, crew qualifications and safety history before joining the network, and reviewed again over time.' },
      { q: 'How quickly can you arrange a flight?', a: 'Options usually arrive quickly, and many flights can be confirmed for the same or next day, subject to aircraft position, permits and airport slots.' },
      { q: 'Is the quote all-inclusive?', a: 'Yes. Quotes show the aircraft, crew, fuel, fees, taxes and handling, with anything optional such as special catering listed separately.' },
      { q: 'How much does it cost to charter a private jet?', a: 'It depends on the aircraft category, the hours flown including positioning, airport and handling fees, crew costs, taxes and demand on your dates. We quote every trip individually and all-inclusive.' },
      { q: 'What is an empty leg?', a: 'A private flight that would otherwise fly without passengers, usually while the aircraft returns to base or repositions. Operators offer these legs at preferential rates; they suit flexible travellers.' },
      { q: 'Can you fly us internationally, from any country?', a: 'Yes. The network spans every major region, and we handle overflight and landing permits, customs coordination and ground arrangements at both ends.' },
      { q: 'Can I bring my pet?', a: 'Often, yes, subject to the aircraft, the operator and the destination\'s import rules. Mention pets when you request a quote.' },
      { q: 'Do you help buy or sell aircraft?', a: 'Yes. We handle mission profiling, search, valuation, negotiation, pre-purchase inspection, escrow and closing for buyers, and confidential marketing to qualified buyers for sellers.' },
    ],
    related: ['/private-jet-charter/', '/empty-leg-flights/', '/buy-private-jet/'],
  },
];

// ---------------------------------------------------------------------------
// Aircraft categories
// ---------------------------------------------------------------------------

function aircraft({ slug, path, label, short, guests, models, range, speed, sweet, routes, intro, best, cabin, faqs, image, related }) {
  return {
    path,
    parent: '/aircraft/',
    label,
    summary: `${guests} · ${models}`,
    title: `${label} Charter Guide | Flying Advisors`,
    description: `${label} charter guide: typical seats, range and example models (${models}), when the category makes sense and sample routes.`,
    eyebrow: 'Aircraft guide',
    h1: `${label} <em>charter.</em>`,
    answer: intro,
    image: image ?? { slug, alt: `${label} private aircraft` },
    cta: QUOTE('fly'),
    body: `
      <section class="page-section">
        <h2>${short} at a glance</h2>
        <table class="spec-table">
          <tbody>
            <tr><th scope="row">Guests</th><td>${guests}</td></tr>
            <tr><th scope="row">Example models</th><td>${models}</td></tr>
            <tr><th scope="row">Typical range</th><td>${range}</td></tr>
            <tr><th scope="row">Typical cruise speed</th><td>${speed}</td></tr>
            <tr><th scope="row">Best for</th><td>${sweet}</td></tr>
          </tbody>
        </table>
        ${INDICATIVE}
      </section>

      <section class="page-section">
        <h2>When ${short.toLowerCase()} make sense</h2>
        ${best}
      </section>

      <section class="page-section">
        <h2>Cabin and comfort</h2>
        ${cabin}
      </section>

      <section class="page-section">
        <h2>Example routes</h2>
        <ul>${routes.map((r) => `<li>${r}</li>`).join('')}</ul>
        <p>Not sure which category fits? <a href="/aircraft/">Compare all categories</a> or <a href="/?enquiry=fly#quote">ask an advisor</a>.</p>
      </section>`,
    faqs,
    related: related ?? ['/aircraft/', '/private-jet-charter/', '/empty-leg-flights/'],
  };
}

const AIRCRAFT = [
  aircraft({
    slug: 'turboprop',
    path: '/aircraft/turboprop/',
    label: 'Turboprop',
    short: 'Turboprops',
    guests: 'Up to 8 guests',
    models: 'King Air 350 · Pilatus PC-12',
    range: 'About 2,800–3,300 km (1,500–1,800 nm)',
    speed: 'About 500–580 km/h (270–310 knots)',
    sweet: 'Regional hops of one to three hours, short runways',
    intro:
      'A turboprop is a propeller aircraft driven by a jet-turbine engine. Models such as the King Air 350 and Pilatus PC-12 seat up to about eight guests and are ideal for regional flights of one to three hours, especially into short or remote runways that jets cannot use.',
    best: '<p>Turboprops shine on short regional routes and at small airports: island strips, mountain airfields and runways too short for most jets. They are efficient on hops of up to a few hundred kilometres, where a jet\'s extra speed saves little time.</p>',
    cabin: '<p>Cabins are compact but comfortable, typically in a club seating layout. The Pilatus PC-12 has a large cargo door, useful for bulky baggage or sports equipment. Most do not have a full stand-up cabin.</p>',
    routes: ['Mumbai to Goa', 'Delhi to Dehradun or Jaipur', 'Nice to Saint-Tropez region airfields', 'Miami to the Bahamas'],
    faqs: [
      { q: 'Are turboprops safe?', a: 'Yes. Modern turboprops such as the King Air and PC-12 are widely used in business and regional aviation. As with every flight, the operator must hold the required certification and is vetted before flying our clients.' },
      { q: 'Why choose a turboprop over a light jet?', a: 'For short trips and small or short runways. A turboprop can reach airfields many jets cannot, and on short hops the time difference is small.' },
    ],
  }),
  aircraft({
    slug: 'very-light-jet',
    path: '/aircraft/very-light-jet/',
    label: 'Very Light Jet',
    short: 'Very light jets',
    guests: 'Up to 5 guests',
    models: 'HondaJet · Phenom 100 · Citation M2',
    range: 'About 2,000–2,900 km (1,100–1,550 nm)',
    speed: 'About 720–780 km/h (390–420 knots)',
    sweet: 'Quick city-to-city trips of up to about two and a half hours',
    intro:
      'A very light jet is the smallest class of private jet, seating up to about five guests. Models such as the HondaJet, Phenom 100 and Citation M2 suit quick city-to-city trips of up to about two and a half hours, offering jet speed for small groups at the lower end of jet charter costs.',
    best: '<p>Very light jets make sense for one to four travellers on short business or leisure trips where a jet\'s speed and comfort matter but a larger cabin does not. They can use many smaller airports closer to your final destination.</p>',
    cabin: '<p>The cabin is intimate, usually four club seats, with limited baggage space. Some models have a small private lavatory. Pack soft bags where possible.</p>',
    routes: ['Delhi to Lucknow or Chandigarh', 'London to Paris', 'Mumbai to Ahmedabad', 'New York to Washington, D.C.'],
    faqs: [
      { q: 'How many people fit in a very light jet?', a: 'Typically up to four or five guests, depending on the model and configuration. Baggage space is limited, so tell us what you are bringing.' },
      { q: 'How far can a very light jet fly?', a: 'Roughly 2,000 to 2,900 km in good conditions, which covers most domestic and short international hops.' },
    ],
  }),
  aircraft({
    slug: 'light-jet',
    path: '/aircraft/light-jet/',
    label: 'Light Jet',
    short: 'Light jets',
    guests: 'Up to 7 guests',
    models: 'Phenom 300 · Citation CJ3',
    range: 'About 3,500–3,700 km (1,900–2,000 nm)',
    speed: 'About 760–830 km/h (410–450 knots)',
    sweet: 'Short regional flights of up to about three and a half hours',
    intro:
      'A light jet seats up to about seven guests and flies regional trips of up to about three and a half hours. Models such as the Phenom 300 and Citation CJ3 combine jet speed, a private lavatory and good runway performance, making them one of the most popular choices for business and weekend travel.',
    best: '<p>Light jets are the workhorses of short regional charter: domestic business days, weekend trips and hops between neighbouring countries for small groups. They balance cost, speed and access to smaller airports.</p>',
    cabin: '<p>Expect a club seating layout, a private lavatory on most models and room for a few suitcases. The cabin is seated rather than stand-up.</p>',
    routes: ['Delhi to Mumbai', 'London to Nice', 'Mumbai to Bengaluru', 'Dubai to Muscat or Doha'],
    faqs: [
      { q: 'How far can a light jet fly non-stop?', a: 'Roughly 3,500 km in good conditions, enough for most domestic routes in India and many regional international flights.' },
      { q: 'Does a light jet have a toilet?', a: 'Most light jets, including the Phenom 300 and Citation CJ3, have a private lavatory. We confirm the details for the specific aircraft.' },
    ],
  }),
  aircraft({
    slug: 'midsize-jet',
    path: '/aircraft/midsize-jet/',
    label: 'Midsize Jet',
    short: 'Midsize jets',
    guests: 'Up to 9 guests',
    models: 'Hawker 900XP · Citation XLS+',
    range: 'About 3,700–5,400 km (2,000–2,900 nm)',
    speed: 'About 800–850 km/h (430–460 knots)',
    sweet: 'Domestic and regional flights of three to five hours',
    intro:
      'A midsize jet seats up to about nine guests and covers domestic and regional flights of three to five hours. Models such as the Hawker 900XP and Citation XLS+ add a taller cabin, more baggage space and longer range than light jets, at a lower cost than super-midsize aircraft.',
    best: '<p>Midsize jets suit longer domestic routes and regional international flights, groups of five to nine, and trips where more cabin space and baggage capacity make a real difference.</p>',
    cabin: '<p>Cabins are taller than light jets, with near stand-up headroom on many models, a private lavatory, a refreshment area and more baggage space.</p>',
    routes: ['Dubai to Mumbai', 'New York to Miami', 'Delhi to Bengaluru', 'London to Geneva'],
    faqs: [
      { q: 'Midsize or light jet: which should I choose?', a: 'Choose midsize for more guests, more baggage, a taller cabin or a longer flight. For short trips with a small group, a light jet is often better value.' },
      { q: 'Can a midsize jet fly Dubai to Mumbai non-stop?', a: 'Yes, typical midsize jets have the range for Dubai to Mumbai, subject to passengers, baggage and conditions on the day.' },
    ],
  }),
  aircraft({
    slug: 'super-midsize-jet',
    path: '/aircraft/super-midsize-jet/',
    label: 'Super-Midsize Jet',
    short: 'Super-midsize jets',
    guests: 'Up to 10 guests',
    models: 'Challenger 350 · Citation Longitude',
    range: 'About 5,900–6,500 km (3,200–3,500 nm)',
    speed: 'About 830–870 km/h (450–470 knots)',
    sweet: 'Transcontinental flights of five to seven hours',
    intro:
      'A super-midsize jet seats up to about ten guests in a stand-up, flat-floor cabin and flies five to seven hours non-stop. Models such as the Challenger 350 and Citation Longitude can cross continents, such as coast to coast in the United States, with the comfort of a larger jet.',
    best: '<p>Super-midsize jets are the choice for long regional and transcontinental trips where comfort matters: a stand-up cabin, space to work or rest, and range to skip a fuel stop.</p>',
    cabin: '<p>Expect a wide, flat-floor stand-up cabin, a full galley, a private lavatory, in-flight connectivity on many aircraft, and large, accessible baggage space.</p>',
    routes: ['Dubai to Mumbai or Delhi', 'Geneva to Riyadh', 'New York to Los Angeles', 'Singapore to Hong Kong'],
    faqs: [
      { q: 'Can a super-midsize jet fly coast to coast in the US?', a: 'Typically yes, non-stop, subject to passengers, baggage and winds on the day.' },
      { q: 'Is a super-midsize jet worth it over a midsize?', a: 'For flights over about four hours, or when you want a stand-up, flat-floor cabin, usually yes. For shorter trips a midsize jet is often enough.' },
    ],
  }),
  aircraft({
    slug: 'heavy-jet',
    path: '/aircraft/heavy-jet/',
    label: 'Heavy Jet',
    short: 'Heavy jets',
    guests: 'Up to 14 guests',
    models: 'Falcon 7X · Challenger 650',
    range: 'About 7,400–11,000 km (4,000–5,950 nm)',
    speed: 'About 850–900 km/h (460–490 knots)',
    sweet: 'Intercontinental flights in comfort',
    intro:
      'A heavy jet, or large-cabin jet, seats up to about fourteen guests and flies intercontinental routes in comfort. Models such as the Falcon 7X and Challenger 650 offer separate cabin zones, space to sleep, a full galley and the range for flights such as Singapore to Delhi or London to Dubai.',
    best: '<p>Heavy jets suit long international trips, larger groups, and travellers who want separate zones to work, dine and sleep. Range varies widely within the class, so we match the specific aircraft to your route.</p>',
    cabin: '<p>Large cabins with several seating zones, divans that convert into beds, a full galley for hot meals, an enclosed lavatory and generous baggage space.</p>',
    routes: ['Singapore to Delhi', 'London to Dubai', 'Mumbai to London (model dependent)', 'Riyadh to Geneva'],
    faqs: [
      { q: 'Can I sleep on a heavy jet?', a: 'Yes. Most heavy jets have divans or seats that convert into flat beds, and some have separate cabin zones for privacy.' },
      { q: 'What is the difference between a heavy jet and an ultra-long-range jet?', a: 'Range. Ultra-long-range jets fly further non-stop, linking cities such as Mumbai and New York, and usually have even larger cabins.' },
    ],
  }),
  aircraft({
    slug: 'ultra-long-range',
    path: '/aircraft/ultra-long-range-jet/',
    label: 'Ultra-Long-Range Jet',
    short: 'Ultra-long-range jets',
    guests: 'Up to 19 guests',
    models: 'Gulfstream G650ER · Global 7500',
    range: 'About 13,000–14,200 km (7,000–7,700 nm)',
    speed: 'About 900–950 km/h (490–510 knots)',
    sweet: 'The longest non-stop routes, such as Mumbai to New York',
    intro:
      'An ultra-long-range jet is the largest purpose-built business jet class, seating up to about nineteen guests and flying over 13,000 km non-stop. Models such as the Gulfstream G650ER and Bombardier Global 7500 connect cities like Mumbai and New York, or Singapore and London, without a fuel stop.',
    image: { slug: 'ultra-long-range', alt: 'Ultra-long-range private jet' },
    best: '<p>Ultra-long-range jets are for the longest trips, where a non-stop flight saves hours, and for travellers who want the most space and the quietest, most refined cabins.</p>',
    cabin: '<p>Multiple living areas, a dedicated bedroom on some aircraft, a full galley, crew rest and a shower on certain models, plus high-speed connectivity.</p>',
    routes: ['Mumbai to New York', 'Singapore to London', 'Delhi to Los Angeles (model dependent)', 'Dubai to São Paulo (model dependent)'],
    faqs: [
      { q: 'Can a private jet fly Mumbai to New York non-stop?', a: 'Yes. Ultra-long-range jets such as the Gulfstream G650ER and Global 7500 can, subject to passengers, baggage and winds on the day.' },
      { q: 'How many people can an ultra-long-range jet carry?', a: 'Up to about nineteen guests in typical layouts, fewer when beds and private suites are configured. We confirm the layout of the specific aircraft.' },
    ],
  }),
  aircraft({
    slug: 'vip-airliner',
    path: '/aircraft/vip-airliner/',
    label: 'VIP Airliner',
    short: 'VIP airliners',
    guests: 'Groups and delegations (depends on configuration)',
    models: 'Boeing BBJ · Airbus ACJ',
    range: 'Varies by model; many fly about 11,000 km (6,000 nm) or more',
    speed: 'About 830–870 km/h (450–470 knots)',
    sweet: 'Delegations, state and corporate travel, large private groups',
    intro:
      'A VIP airliner is a commercial airliner, such as a Boeing Business Jet or Airbus Corporate Jet, fitted with a private cabin. It carries delegations and large groups in one aircraft, with lounges, dining areas and bedrooms. Capacity depends entirely on how each aircraft is configured.',
    best: '<p>VIP airliners suit heads of state and government delegations, corporate leadership teams, sports teams and large private groups who need to travel together in privacy and comfort.</p>',
    cabin: '<p>Configurations vary: typically a master suite, lounge and dining areas, conference space and business-class style seating for staff or guests.</p>',
    routes: ['Delegation travel between capitals', 'Wedding or event groups between continents', 'Corporate leadership roadshows', 'Sports team tours'],
    faqs: [
      { q: 'How many passengers does a VIP airliner carry?', a: 'It depends entirely on the configuration of the individual aircraft. Tell us the group size and we will find aircraft laid out to suit it.' },
      { q: 'What is a BBJ or ACJ?', a: 'Boeing Business Jet (BBJ) and Airbus Corporate Jet (ACJ) are VIP versions of Boeing and Airbus airliners, fitted with private cabins.' },
    ],
    related: ['/group-charter/', '/aircraft/', '/private-jet-charter/'],
  }),
];

const AIRCRAFT_INDEX = {
  path: '/aircraft/',
  label: 'Aircraft guide',
  summary: 'Eight private aircraft categories compared: seats, range and typical use.',
  title: 'Private Jet Types & Sizes Guide | Flying Advisors',
  description: 'Compare private aircraft categories, from turboprops and light jets to ultra-long-range jets and VIP airliners: seats, range, example models and best use.',
  eyebrow: 'Aircraft guide',
  h1: 'Private aircraft, <em>matched to the mission.</em>',
  answer:
    'Private aircraft fall into categories by size and range: turboprops and very light jets for short hops, light and midsize jets for regional flights, super-midsize and heavy jets for transcontinental and intercontinental trips, and ultra-long-range jets and VIP airliners for the longest routes and largest groups.',
  cta: QUOTE('fly'),
  body: `
      <section class="page-section">
        <h2>Categories compared</h2>
        <div class="table-scroll">
          <table class="spec-table spec-table--compare">
            <thead><tr><th scope="col">Category</th><th scope="col">Guests</th><th scope="col">Typical range</th><th scope="col">Example models</th></tr></thead>
            <tbody>
              ${AIRCRAFT.map((a) => {
                const range = a.body.match(/Typical range<\/th><td>([^<]+)/)[1].replace(/ \(.*\)/, '');
                const guests = a.body.match(/Guests<\/th><td>([^<]+)/)[1];
                const models = a.body.match(/Example models<\/th><td>([^<]+)/)[1];
                return `<tr><th scope="row"><a href="${a.path}">${a.label}</a></th><td>${guests}</td><td>${range}</td><td>${models}</td></tr>`;
              }).join('\n              ')}
            </tbody>
          </table>
        </div>
        ${INDICATIVE}
      </section>

      <section class="page-section">
        <h2>How to choose</h2>
        <ul>
          <li><strong>Distance first:</strong> pick a category that flies the route non-stop with your passengers and baggage.</li>
          <li><strong>Then people and baggage:</strong> seats are only part of it; golf bags, skis and large suitcases need space.</li>
          <li><strong>Then the airports:</strong> short or remote runways favour turboprops and smaller jets.</li>
          <li><strong>Then the cabin:</strong> on longer flights a stand-up cabin, galley and beds make a real difference.</li>
        </ul>
        <p>We match the aircraft to the mission, not to an inventory. <a href="/?enquiry=fly#quote">Tell us your trip</a> and an advisor will recommend the right category.</p>
      </section>`,
  faqs: [
    { q: 'What size private jet do I need?', a: 'Start with the distance and number of guests. As a rough guide, light jets suit trips of up to about three hours with up to seven guests, midsize and super-midsize jets cover regional and transcontinental flights, and heavy and ultra-long-range jets fly intercontinental routes.' },
    { q: 'What is the largest private jet?', a: 'Purpose-built business jets top out with ultra-long-range models such as the Global 7500. Larger still are VIP airliners such as the Boeing BBJ and Airbus ACJ, which are airliners fitted with private cabins.' },
  ],
  related: ['/private-jet-charter/', '/empty-leg-flights/', '/group-charter/'],
};

// ---------------------------------------------------------------------------
// Legal (factual descriptions of how the site handles data)
// ---------------------------------------------------------------------------

const LEGAL = [
  {
    path: '/privacy/',
    label: 'Privacy',
    summary: 'What personal information Flying Advisors collects, why, and your choices.',
    title: 'Privacy Notice | Flying Advisors',
    description: 'How Flying Advisors handles the personal information you share through this website, WhatsApp, phone and email, and how to contact us about it.',
    eyebrow: 'Legal',
    h1: 'Privacy notice',
    answer:
      'Flying Advisors collects only the information you choose to send us, such as your name, contact details and trip or aircraft details, and uses it to respond to your enquiry and arrange the services you ask for. We do not sell personal information, and this website uses no tracking or advertising cookies.',
    heroActions: false,
    noCta: true,
    body: `
      <section class="page-section">
        <h2>What we collect</h2>
        <ul>
          <li><strong>Information you send us:</strong> through the quote and contact forms (for example name, email, mobile number, route, dates, number of guests, baggage, pets, or aircraft details), and when you call, WhatsApp or email us.</li>
          <li><strong>Technical information:</strong> our hosting and security providers process standard request data such as IP address and browser type to deliver and protect the website.</li>
        </ul>
        <p>This website does not use analytics, advertising or tracking cookies, and does not load third-party tracking scripts.</p>
      </section>

      <section class="page-section">
        <h2>How we use it</h2>
        <ul>
          <li>To reply to your enquiry and prepare quotes</li>
          <li>To arrange the flights or aircraft transactions you request, which can mean sharing necessary details (such as passenger names and travel dates) with aircraft operators, airports, handling agents and authorities</li>
          <li>To meet legal, accounting and regulatory obligations</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>Service providers</h2>
        <ul>
          <li><strong>Web3Forms</strong> delivers website form submissions to our inbox by email.</li>
          <li><strong>Cloudflare</strong> provides content delivery and security for the website.</li>
          <li><strong>Railway</strong> hosts the website.</li>
          <li><strong>WhatsApp</strong> (Meta) carries messages if you contact us there.</li>
        </ul>
      </section>

      <section class="page-section">
        <h2>Your choices and rights</h2>
        <p>You can ask to see, correct or delete the personal information we hold about you, or withdraw consent for its use, subject to any legal obligation to keep it. Email <a href="mailto:concierge@flyingadvisors.com">concierge@flyingadvisors.com</a>.</p>
      </section>

      <section class="page-section">
        <h2>Contact</h2>
        <p>Flying Advisors, A-143, Sector 63, Noida, Uttar Pradesh 201301, India · <a href="mailto:concierge@flyingadvisors.com">concierge@flyingadvisors.com</a></p>
      </section>`,
    related: ['/cookies/', '/contact/'],
  },
  {
    path: '/cookies/',
    label: 'Cookies',
    summary: 'This website uses no tracking or advertising cookies.',
    title: 'Cookie Notice | Flying Advisors',
    description: 'flyingadvisors.com does not use analytics, advertising or tracking cookies. Our security provider may set a strictly necessary cookie to protect the site.',
    eyebrow: 'Legal',
    h1: 'Cookie notice',
    answer:
      'flyingadvisors.com does not use analytics, advertising or tracking cookies, so there is nothing to opt out of. Our security provider, Cloudflare, may set a strictly necessary cookie to tell genuine visitors from automated traffic. It does not track you across websites and is not used for marketing.',
    heroActions: false,
    noCta: true,
    body: `
      <section class="page-section">
        <h2>Cookies on this site</h2>
        <table class="spec-table">
          <thead><tr><th scope="col">Cookie</th><th scope="col">Set by</th><th scope="col">Purpose</th></tr></thead>
          <tbody>
            <tr><th scope="row">__cf_bm, cf_clearance (only in some cases)</th><td>Cloudflare</td><td>Strictly necessary security: distinguishing visitors from bots</td></tr>
          </tbody>
        </table>
        <p>We do not use cookies for analytics, advertising or personalisation. Fonts are served from our own website, not from third-party font services.</p>
      </section>

      <section class="page-section">
        <h2>Managing cookies</h2>
        <p>You can block or delete cookies in your browser settings. Blocking strictly necessary security cookies may occasionally cause a verification check to appear.</p>
      </section>`,
    related: ['/privacy/', '/contact/'],
  },
];

export const PAGES = [...SERVICES, ...COMPANY, AIRCRAFT_INDEX, ...AIRCRAFT, ...LEGAL];
