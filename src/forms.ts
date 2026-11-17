import { gsap } from 'gsap';
import { FORM_ENDPOINT, SIMULATE_SUBMIT, WEB3FORMS_ACCESS_KEY } from './config';

type Control = HTMLInputElement | HTMLTextAreaElement;
type Messages = Record<string, Partial<Record<keyof ValidityState, string>>>;

const MESSAGES: Messages = {
  from: { valueMissing: 'Please add a city or airport.' },
  to: { valueMissing: 'Please add a city or airport.' },
  departure: { valueMissing: 'Please choose a date.', rangeUnderflow: 'Please choose a future date.' },
  return: { valueMissing: 'Please choose a return date.', rangeUnderflow: 'Return must be after departure.' },
  mission: { valueMissing: 'A short description is enough.' },
  model: { valueMissing: 'Please add the make and model.' },
  year: { patternMismatch: 'Please use four digits, e.g. 2018.' },
  mobile: {
    valueMissing: 'Please add a number with country code.',
    patternMismatch: 'Please check the number.',
  },
  name: { valueMissing: 'Please tell us your name.' },
  email: {
    valueMissing: 'Please add your email address.',
    typeMismatch: 'That email address does not look right.',
  },
  message: { valueMissing: 'A line or two is enough.' },
};

const SUBJECTS: Record<string, string> = {
  fly: 'New enquiry: Fly (charter)',
  buy: 'New enquiry: Buy an aircraft',
  sell: 'New enquiry: Sell an aircraft',
};

const CTA_LABELS: Record<string, string> = {
  fly: 'Submit your query',
  buy: 'Submit your query',
  sell: 'Submit your query',
};

// Readable labels for the enquiry email (Web3Forms prints field names as-is).
const EMAIL_LABELS: Record<string, string> = {
  type: 'Enquiry type',
  trip: 'Trip',
  from: 'From',
  to: 'To',
  departure: 'Departure',
  return: 'Return',
  guests: 'Guests',
  baggage: 'Baggage',
  pets: 'Travelling with pets',
  petCount: 'Number of pets',
  mission: 'Mission',
  budget: 'Budget',
  timeline: 'Timeline',
  model: 'Aircraft make & model',
  year: 'Year',
  basedAt: 'Based in',
  mobile: 'Mobile / WhatsApp',
  name: 'Name',
  message: 'Message',
};

// Fields Web3Forms reads itself, sent under their own names.
const WEB3FORMS_FIELDS = new Set(['access_key', 'subject', 'from_name', 'botcheck', 'email']);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function messageFor(control: Control): string {
  const map = MESSAGES[control.name] ?? {};
  for (const key of Object.keys(map) as (keyof ValidityState)[]) {
    if (control.validity[key]) return map[key]!;
  }
  return control.validationMessage;
}

// ---------------------------------------------------------------------------
// Shared validation + submit
// ---------------------------------------------------------------------------

function wireForm(form: HTMLFormElement, endpoint: string): void {
  const key = form.querySelector<HTMLInputElement>('[data-access-key]');
  if (key) key.value = WEB3FORMS_ACCESS_KEY;
  if (!WEB3FORMS_ACCESS_KEY && !SIMULATE_SUBMIT) {
    console.warn('VITE_WEB3FORMS_ACCESS_KEY is not set: form submissions will fail.');
  }
  const wrap = form.parentElement!;
  const status = form.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const success = wrap.querySelector<HTMLElement>('[data-success]');
  const touched = new WeakSet<Control>();

  const controls = () =>
    Array.from(form.querySelectorAll<Control>('.field__input')).filter((c) => !c.matches(':disabled'));

  function setStatus(text: string, isError = false) {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('is-error', isError);
  }

  function validate(control: Control): boolean {
    const field = control.closest<HTMLElement>('[data-field]');
    const error = field?.querySelector<HTMLElement>('[data-field-error]');
    if (control.required && control.value.trim() === '') control.value = '';
    const valid = control.checkValidity();
    field?.classList.toggle('is-invalid', !valid);
    control.setAttribute('aria-invalid', String(!valid));
    if (error) error.textContent = valid ? '' : messageFor(control);
    return valid;
  }

  form.addEventListener('focusout', (event) => {
    const control = event.target as Control;
    if (!control.classList?.contains('field__input')) return;
    touched.add(control);
    validate(control);
  });

  form.addEventListener('input', (event) => {
    const control = event.target as Control;
    if (touched.has(control)) validate(control);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const list = controls();
    const results = list.map(validate);
    list.forEach((c) => touched.add(c));
    const firstInvalid = list[results.indexOf(false)];
    if (firstInvalid) {
      setStatus('Please check the highlighted fields.', true);
      firstInvalid.focus();
      return;
    }

    if (submit) submit.disabled = true;
    setStatus('Sending');
    const payload: Record<string, string> = {};
    for (const [name, value] of new FormData(form).entries()) {
      if (typeof value !== 'string' || (name !== 'botcheck' && value.trim() === '')) continue;
      payload[WEB3FORMS_FIELDS.has(name) ? name : (EMAIL_LABELS[name] ?? name)] = value.trim();
    }

    try {
      if (SIMULATE_SUBMIT) {
        await wait(900);
      } else {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(`Form failed: ${response.status} ${result.message ?? ''}`);
        }
      }

      setStatus('');
      gsap.to(form, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          form.hidden = true;
          if (!success) return;
          success.hidden = false;
          gsap.fromTo(success, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });
          success.focus({ preventScroll: true });
        },
      });
    } catch (error) {
      console.error(error);
      if (submit) submit.disabled = false;
      setStatus('That did not go through. Please try again in a moment.', true);
    }
  });
}

// ---------------------------------------------------------------------------
// Quote form: tabs, trip type, guests
// ---------------------------------------------------------------------------

export interface QuoteForm {
  selectTab: (tab: string) => void;
}

export function initQuoteForm(form: HTMLFormElement): QuoteForm {
  const tabs = Array.from(form.querySelectorAll<HTMLButtonElement>('[data-tab]'));
  const panels = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-panel]'));
  const typeInput = form.querySelector<HTMLInputElement>('[data-type-input]')!;
  const cta = form.querySelector<HTMLButtonElement>('[data-quote-cta]')!;
  const subject = form.querySelector<HTMLInputElement>('[data-subject]');

  function selectTab(name: string, focus = false) {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.hidden = !active;
      panel.disabled = !active; // hidden fields are skipped by validation and FormData
      if (active) gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    });
    typeInput.value = name;
    if (subject) subject.value = SUBJECTS[name] ?? subject.value;
    cta.textContent = CTA_LABELS[name] ?? cta.textContent;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab!));
    tab.addEventListener('keydown', (event) => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const next = tabs[(index + step + tabs.length) % tabs.length];
      selectTab(next.dataset.tab!, true);
    });
  });

  // Trip type: the return date only exists for return trips.
  const returnField = form.querySelector<HTMLElement>('[data-return-field]')!;
  const returnInput = returnField.querySelector<HTMLInputElement>('input')!;
  const departure = form.querySelector<HTMLInputElement>('#q-departure')!;
  form.querySelectorAll<HTMLInputElement>('[data-trip]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const isReturn = radio.value === 'return' && radio.checked;
      returnField.hidden = !isReturn;
      returnInput.disabled = !isReturn;
      returnInput.required = isReturn;
    });
  });

  // Dates cannot be in the past; return cannot precede departure.
  const today = new Date().toISOString().slice(0, 10);
  form.querySelectorAll<HTMLInputElement>('[data-date-min]').forEach((input) => (input.min = today));
  departure.addEventListener('change', () => {
    returnInput.min = departure.value || today;
  });

  // Steppers (guests 1–50, pets 1–10): limits come from data-min / data-max.
  form.querySelectorAll<HTMLElement>('[data-stepper]').forEach((stepper) => {
    const value = stepper.querySelector<HTMLOutputElement>('[data-step-value]')!;
    const input = stepper.querySelector<HTMLInputElement>('[data-step-input]')!;
    const min = Number(stepper.dataset.min ?? 1);
    const max = Number(stepper.dataset.max ?? 50);
    stepper.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = Math.min(max, Math.max(min, Number(input.value) + Number(button.dataset.step)));
        input.value = String(next);
        value.textContent = String(next);
      });
    });
  });

  // Furry friends: "How many?" only appears (and is only sent) when Yes is chosen.
  const petsCount = form.querySelector<HTMLElement>('[data-pets-count]')!;
  const petsInput = petsCount.querySelector<HTMLInputElement>('[data-step-input]')!;
  form.querySelectorAll<HTMLInputElement>('[data-pets]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const yes = radio.value === 'yes' && radio.checked;
      petsCount.hidden = !yes;
      petsInput.disabled = !yes;
      if (yes) gsap.fromTo(petsCount, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' });
    });
  });

  wireForm(form, FORM_ENDPOINT);
  return { selectTab: (tab: string) => selectTab(tab) };
}

export function initContactForm(form: HTMLFormElement): void {
  wireForm(form, FORM_ENDPOINT);
}

// ---------------------------------------------------------------------------
// FAQ accordion
// ---------------------------------------------------------------------------

export function initFaq(root: HTMLElement): void {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button[aria-controls]'));
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      buttons.forEach((other) => {
        const panel = document.getElementById(other.getAttribute('aria-controls')!)!;
        const open = other === button && opening;
        other.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
        if (open) gsap.fromTo(panel, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  });
}
