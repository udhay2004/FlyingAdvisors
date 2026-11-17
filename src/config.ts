// Everything you are likely to tune lives here.

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------

/**
 * STUB: where each form is POSTed as JSON. Replace with your real endpoints
 * (Formspree, a serverless function, your CRM...).
 */
export const QUOTE_ENDPOINT = '/api/quote';
export const CONTACT_ENDPOINT = '/api/contact';

/**
 * While true, submitting skips the network and shows the success state after a
 * short pause, so the flow can be tested before an endpoint exists.
 * Set to false once the endpoints above are real.
 */
export const SIMULATE_SUBMIT = true;

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

/** Lenis smoothing. Lower = heavier glide. 0.1 feels close to hype.luxury. */
export const LENIS_LERP = 0.1;

/**
 * Slow-scroll strength for every photo: the fraction of the page movement the
 * photo lags behind (0 = moves with the page, 0.5 = half speed).
 */
export const SLOW_SCROLL = { desktop: 0.4, mobile: 0.25 };
