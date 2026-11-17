// Everything you are likely to tune lives here.

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------

/**
 * Both forms are emailed through Web3Forms (https://web3forms.com).
 * The access key comes from the VITE_WEB3FORMS_ACCESS_KEY environment variable
 * (Railway service variables, or .env.local on your machine). It is read at
 * build time, so rebuild after changing it.
 */
export const WEB3FORMS_ACCESS_KEY: string = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '';
export const FORM_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * While true, submitting skips the network and shows the success state after a
 * short pause. Keep false so enquiries are actually sent.
 */
export const SIMULATE_SUBMIT = false;

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
