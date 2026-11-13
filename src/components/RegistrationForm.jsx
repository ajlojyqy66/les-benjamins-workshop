import { useRef, useState } from 'react';
import { EVENT, LEGAL, SESSIONS } from '../config.js';
import { buildPayload, isMock, submitRegistration } from '../api.js';
import { useI18n } from '../i18n.jsx';
import { kvkkSections } from '../legal.js';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  instagram: '',
  session: '',
  canSew: false,
  sewingExperience: '',
  selfOnly: false,
  kvkk: false,
  marketing: false,
  website: '', // honeypot: gerçek kullanıcılar görmez
};

const FIELD_ORDER = ['session', 'firstName', 'lastName', 'email', 'phone', 'canSew', 'sewingExperience', 'selfOnly', 'kvkk'];

function validate(v) {
  const e = {};
  if (!v.session) e.session = true;
  if (v.firstName.trim().length < 2) e.firstName = true;
  if (v.lastName.trim().length < 2) e.lastName = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = true;
  const digits = v.phone.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');
  if (!/^5\d{9}$/.test(digits)) e.phone = true;
  if (!v.canSew) e.canSew = true;
  if (v.canSew && v.sewingExperience.trim().length < 10) e.sewingExperience = true;
  if (!v.selfOnly) e.selfOnly = true;
  if (!v.kvkk) e.kvkk = true;
  return e;
}

function formatPhone(raw) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('90')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  d = d.slice(0, 10);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(' ');
}

export default function RegistrationForm({ availability }) {
  const { t, lang } = useI18n();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | invalid | submitting | success | error
  const [serverError, setServerError] = useState('');
  const [fullIds, setFullIds] = useState([]);
  const formRef = useRef(null);
  const kvkkRef = useRef(null);

  const closed = availability?.closed === true;
  const remaining = (id) => (availability && typeof availability[id] === 'number' ? availability[id] : null);
  const isFull = (id) => fullIds.includes(id) || remaining(id) === 0;
  const allFull = SESSIONS.every((s) => isFull(s.id));

  const set = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || errors[name]) setErrors(validate(next));
  };
  const onBlur = (name) => {
    setTouched((tt) => ({ ...tt, [name]: true }));
    setErrors(validate(values));
  };
  const errMsg = (name) => ((touched[name] || status === 'invalid') && errors[name] ? t('errors')[name] : '');

  async function onSubmit(e) {
    e.preventDefault();
    if (values.website) return;
    const errs = validate(values);
    setErrors(errs);
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) {
      setStatus('invalid');
      formRef.current?.querySelector(`[data-field="${first}"]`)?.focus();
      return;
    }
    const session = SESSIONS.find((s) => s.id === values.session);
    setStatus('submitting');
    setServerError('');
    const res = await submitRegistration(buildPayload(values, session, lang));
    if (res.ok) {
      setStatus('success');
      requestAnimationFrame(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      return;
    }
    if (res.error === 'SESSION_FULL') {
      setFullIds((ids) => [...new Set([...ids, values.session])]);
      setValues((v) => ({ ...v, session: '' }));
    }
    setServerError(res.error || 'SERVER');
    setStatus('error');
  }

  if (status === 'success') {
    const session = SESSIONS.find((s) => s.id === values.session);
    return <Success name={values.firstName.trim()} email={values.email.trim()} session={session} />;
  }

  if (closed || allFull) {
    return (
      <div className="form-closed">
        <h2 id="register-title" className="register__title">
          {closed ? t('closedTitle') : t('fullTitle')}
        </h2>
        <p className="form__intro">{t('closedText')}</p>
        <a className="btn btn--dark" href={EVENT.instagramUrl} target="_blank" rel="noreferrer">
          Instagram ↗
        </a>
      </div>
    );
  }

  const submitting = status === 'submitting';
  const common = { values, set, onBlur, errMsg, submitting };

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate aria-describedby="form-intro">
      <h2 id="register-title" className="register__title">
        {t('formTitle')}
      </h2>
      <p id="form-intro" className="form__intro">
        {t('formIntro')}
      </p>

      {isMock && (
        <p className="mock-banner" role="status">
          {t('mock')}
        </p>
      )}

      {/* 01 — Oturum */}
      <fieldset className="block" aria-describedby={errMsg('session') ? 'err-session' : undefined}>
        <legend className="block__legend">
          <span className="block__n">01</span>
          {t('sessionLegend')}
        </legend>
        <div className="slots">
          {SESSIONS.map((s, i) => {
            const full = isFull(s.id);
            const left = remaining(s.id);
            const checked = values.session === s.id;
            return (
              <label key={s.id} className={`slot ${checked ? 'is-checked' : ''} ${full ? 'is-full' : ''}`}>
                <input
                  type="radio"
                  name="session"
                  value={s.id}
                  checked={checked}
                  disabled={full || submitting}
                  onChange={() => set('session', s.id)}
                  onBlur={() => onBlur('session')}
                  data-field={i === 0 ? 'session' : undefined}
                />
                <span className="slot__mark" aria-hidden="true" />
                <span className="slot__label">{t('sessionLabel', s.id)}</span>
                <span className="slot__time">{s.time[lang]}</span>
                <span className="slot__meta">
                  {full
                    ? t('sessionFull')
                    : left !== null
                      ? t('sessionLeft', left, EVENT.capacityPerSession)
                      : t('sessionCap', EVENT.capacityPerSession)}
                </span>
              </label>
            );
          })}
        </div>
        {errMsg('session') && (
          <p id="err-session" className="field__error">
            {errMsg('session')}
          </p>
        )}
      </fieldset>

      {/* 02 — Kişisel bilgiler */}
      <fieldset className="block">
        <legend className="block__legend">
          <span className="block__n">02</span>
          {t('detailsGroup')}
        </legend>
        <div className="row">
          <TextField label={t('firstName')} name="firstName" autoComplete="given-name" {...common} />
          <TextField label={t('lastName')} name="lastName" autoComplete="family-name" {...common} />
        </div>
        <TextField label={t('email')} name="email" type="email" inputMode="email" autoComplete="email" hint={t('emailHint')} {...common} />
        <div className="row">
          <TextField
            label={t('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="5XX XXX XX XX"
            prefix="+90"
            format={formatPhone}
            {...common}
          />
          <TextField label={t('instagram')} name="instagram" optional optionalLabel={t('optional')} prefix="@" autoComplete="off" {...common} />
        </div>
      </fieldset>

      {/* 03 — Dikiş deneyimi */}
      <fieldset className="block">
        <legend className="block__legend">
          <span className="block__n">03</span>
          {t('sewGroup')}
        </legend>
        <Check name="canSew" strong {...common}>
          {t('canSew')}
        </Check>
        <div className={`reveal ${values.canSew ? 'is-open' : ''}`} aria-hidden={!values.canSew}>
          <div className="reveal__inner">
            <TextArea
              label={t('sewExp')}
              name="sewingExperience"
              hint={t('sewExpHint')}
              placeholder={t('sewExpPlaceholder')}
              disabledExtra={!values.canSew}
              {...common}
            />
          </div>
        </div>
      </fieldset>

      {/* 04 — Onaylar */}
      <fieldset className="block">
        <legend className="block__legend">
          <span className="block__n">04</span>
          {t('consentGroup')}
        </legend>
        <Check name="selfOnly" {...common}>
          {t('selfOnly')}
        </Check>
        <Check name="kvkk" {...common}>
          <button type="button" className="link" onClick={() => kvkkRef.current?.showModal()}>
            {t('kvkkLink')}
          </button>
          {t('kvkkRest')}
        </Check>
        <Check name="marketing" optional {...common}>
          <a className="link" href={LEGAL.marketingNoticeUrl} target="_blank" rel="noreferrer">
            {t('marketingLink')}
          </a>
          {t('marketingRest')}
        </Check>
      </fieldset>

      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
        </label>
      </div>

      {status === 'error' && serverError && (
        <p className="form__alert" role="alert">
          {t('server')[serverError] || t('server').SERVER}
        </p>
      )}

      <button
        type="submit"
        className="btn btn--dark btn--block btn--submit"
        disabled={submitting || !values.canSew}
        aria-busy={submitting}
        aria-describedby={!values.canSew ? 'submit-note' : undefined}
      >
        <span>{submitting ? t('submitting') : t('submit')}</span>
        {submitting ? <span className="spinner" aria-hidden="true" /> : <span aria-hidden="true">→</span>}
      </button>
      {!values.canSew && (
        <p id="submit-note" className="submit-note">
          {t('sewBlocked')}
        </p>
      )}

      <dialog ref={kvkkRef} className="dialog" aria-labelledby="kvkk-title">
        <h3 id="kvkk-title">{t('kvkkTitle')}</h3>
        {/* Metin: src/legal.js — yayından önce hukuk kontrolü gerekir. */}
        <div className="dialog__body">
          {kvkkSections(lang).map((s, i) => (
            <section key={i}>
              {s.h && <h4>{s.h}</h4>}
              {s.p && <p className={s.small ? 'dialog__small' : undefined}>{s.p}</p>}
              {s.ul && (
                <ul>
                  {s.ul.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <button type="button" className="btn btn--dark" onClick={() => kvkkRef.current?.close()}>
          {t('close')}
        </button>
      </dialog>
    </form>
  );
}

function TextField({ label, name, type = 'text', hint, optional, optionalLabel, prefix, format, values, set, onBlur, errMsg, submitting, ...rest }) {
  const err = errMsg(name);
  const describedBy = [hint && `hint-${name}`, err && `err-${name}`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${err ? 'has-error' : ''}`}>
      <label className="field__label" htmlFor={`f-${name}`}>
        {label}
        {optional && <span className="field__opt"> — {optionalLabel}</span>}
      </label>
      <div className="input">
        {prefix && (
          <span className="input__prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={`f-${name}`}
          name={name}
          type={type}
          value={values[name]}
          onChange={(e) => set(name, format ? format(e.target.value) : e.target.value)}
          onBlur={() => onBlur(name)}
          aria-invalid={err ? 'true' : undefined}
          aria-describedby={describedBy}
          required={!optional}
          disabled={submitting}
          data-field={name}
          {...rest}
        />
      </div>
      {hint && !err && (
        <p id={`hint-${name}`} className="field__hint">
          {hint}
        </p>
      )}
      {err && (
        <p id={`err-${name}`} className="field__error">
          {err}
        </p>
      )}
    </div>
  );
}

function TextArea({ label, name, hint, placeholder, disabledExtra, values, set, onBlur, errMsg, submitting }) {
  const err = errMsg(name);
  return (
    <div className={`field ${err ? 'has-error' : ''}`}>
      <label className="field__label" htmlFor={`f-${name}`}>
        {label}
      </label>
      <div className="input input--area">
        <textarea
          id={`f-${name}`}
          name={name}
          rows={4}
          maxLength={600}
          value={values[name]}
          placeholder={placeholder}
          onChange={(e) => set(name, e.target.value)}
          onBlur={() => onBlur(name)}
          aria-invalid={err ? 'true' : undefined}
          aria-describedby={err ? `err-${name}` : `hint-${name}`}
          disabled={submitting || disabledExtra}
          required
          data-field={name}
        />
      </div>
      {err ? (
        <p id={`err-${name}`} className="field__error">
          {err}
        </p>
      ) : (
        <p id={`hint-${name}`} className="field__hint">
          {hint}
        </p>
      )}
    </div>
  );
}

function Check({ name, children, strong, optional, values, set, onBlur, errMsg, submitting }) {
  const err = errMsg(name);
  return (
    <div className={`check ${strong ? 'check--strong' : ''} ${err ? 'has-error' : ''}`}>
      <label className="check__row">
        <input
          type="checkbox"
          name={name}
          checked={values[name]}
          onChange={(e) => set(name, e.target.checked)}
          onBlur={() => onBlur(name)}
          aria-invalid={err ? 'true' : undefined}
          aria-describedby={err ? `err-${name}` : undefined}
          disabled={submitting}
          data-field={name}
          required={!optional}
        />
        <span className="check__box" aria-hidden="true" />
        <span className="check__text">{children}</span>
      </label>
      {err && (
        <p id={`err-${name}`} className="field__error check__error">
          {err}
        </p>
      )}
    </div>
  );
}

function Success({ name, email, session }) {
  const { t, lang } = useI18n();
  return (
    <div className="success" role="status" aria-live="polite">
      <p className="eyebrow eyebrow--dark">{t('successKicker')}</p>
      <h2 id="register-title" className="register__title">
        {t('successTitle', name)}
      </h2>
      <p className="form__intro">{t('successText', email)}</p>
      <dl className="facts facts--compact">
        <div className="fact">
          <dt>{t('successDate')}</dt>
          <dd>{t('factDateValue')}</dd>
        </div>
        <div className="fact">
          <dt>{t('successSession')}</dt>
          <dd>
            {t('sessionLabel', session.id)} — {session.time[lang]}
          </dd>
        </div>
        <div className="fact">
          <dt>{t('successPlace')}</dt>
          <dd>{EVENT.location}</dd>
        </div>
      </dl>
      <a className="btn btn--dark" href={buildIcs(session, t)} download="les-benjamins-workshop.ics">
        {t('addCal')}
      </a>
    </div>
  );
}

function buildIcs(session, t) {
  const toUtc = (iso) =>
    new Date(iso)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Les Benjamins//Workshop//TR',
    'BEGIN:VEVENT',
    `UID:lb-workshop-${session.id}@lesbenjamins`,
    `DTSTAMP:${toUtc(new Date().toISOString())}`,
    `DTSTART:${toUtc(session.start)}`,
    `DTEND:${toUtc(session.end)}`,
    `SUMMARY:Les Benjamins Workshop — ${t('sessionLabel', session.id)}`,
    `LOCATION:${EVENT.location}${EVENT.address ? ', ' + EVENT.address : ''}`,
    `DESCRIPTION:${t('calDesc')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
}
