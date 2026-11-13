import { useEffect, useState } from 'react';
import { EVENT, SESSIONS } from './config.js';
import { getAvailability } from './api.js';
import { LANGS, useI18n } from './i18n.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
import Logos from './components/Logos.jsx';

import heroWide from './assets/img/hero-wide.jpg';
import heroTall from './assets/img/hero-tall.jpg';
import imgDusk from './assets/img/balloon-dusk.jpg';
import imgFabric from './assets/img/balloon-fabric.jpg';
import imgPink from './assets/img/balloon-pink.jpg';
import imgFlight from './assets/img/balloon-flight.jpg';
import imgGroup from './assets/img/balloon-group.jpg';
import imgMan from './assets/img/balloon-man.jpg';
import imgCrew from './assets/img/balloon-crew.jpg';
import imgGround from './assets/img/balloon-ground.jpg';
import imgYellowPink from './assets/img/balloon-yellow-pink.jpg';
import imgPortrait from './assets/img/balloon-portrait.jpg';

const STEP_IMGS = [imgDusk, imgFabric, imgPink];
const STRIP = [imgFlight, imgMan, imgYellowPink, imgCrew, imgGround, imgGroup];

export default function App() {
  const { t, lang, setLang } = useI18n();
  const [availability, setAvailability] = useState(null);
  const [solidBar, setSolidBar] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolidBar(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    getAvailability().then((a) => alive && setAvailability(a));
    return () => {
      alive = false;
    };
  }, []);

  const steps = t('steps');
  const alts = t('stepAlts');

  return (
    <>
      <a className="skip" href="#apply">
        {t('skip')}
      </a>

      <header className={`topbar ${solidBar ? 'topbar--solid' : ''}`}>
        <a href="#top" className="topbar__brand">
          <Logos size="sm" />
        </a>
        <nav className="topbar__nav">
          <div className="lang" role="group" aria-label={t('langLabel')}>
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={`lang__btn ${lang === l ? 'is-active' : ''}`}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="topbar__cta" href="#apply">
            {t('navApply')}
          </a>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <picture className="hero__media">
            <source media="(min-width: 820px)" srcSet={heroWide} />
            <img src={heroTall} alt={t('heroImgAlt')} />
          </picture>
          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__content wrap">
            <p className="eyebrow">{t('heroKicker')}</p>
            <h1 id="hero-title" className="hero__title">
              {t('heroTitle')[0]}
              <br />
              {t('heroTitle')[1]}
            </h1>
            <div className="hero__foot">
              <p className="hero__lede">{t('heroLede')}</p>
              <a className="btn btn--neon" href="#apply">
                {t('heroCta')}
              </a>
            </div>
            <dl className="hero__meta">
              {t('heroMeta').map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* INTRO */}
        <section className="intro wrap grid" aria-label={t('introLabel')}>
          <p className="col-label">{t('introLabel')}</p>
          <p className="intro__statement col-main">{t('intro')}</p>
        </section>

        {/* STORY — lookbook dizisi */}
        <section className="story" aria-labelledby="story-title">
          <div className="wrap grid story__head">
            <h2 id="story-title" className="col-label">
              {t('storyLabel')}
            </h2>
          </div>
          <ol className="story__row">
            {steps.map((s, i) => (
              <li key={i} className="frame">
                <img className="frame__img" src={STEP_IMGS[i]} alt={alts[i]} loading="lazy" />
                <div className="frame__cap">
                  <span className="frame__n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="frame__title">{s.title}</h3>
                    <p className="frame__text">{s.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* STRIP */}
        <section className="strip" aria-label={t('stripCaption')}>
          <div className="strip__track" aria-hidden="true">
            {[...STRIP, ...STRIP].map((src, i) => (
              <img key={i} src={src} alt="" loading="lazy" />
            ))}
          </div>
          <p className="strip__caption wrap">{t('stripCaption')}</p>
        </section>

        {/* DETAILS */}
        <section className="details wrap grid" aria-labelledby="details-title">
          <h2 id="details-title" className="col-label">
            {t('detailsLabel')}
          </h2>
          <div className="col-main">
            <dl className="facts">
              <div className="fact">
                <dt>{t('factDate')}</dt>
                <dd>{t('factDateValue')}</dd>
              </div>
              <div className="fact">
                <dt>{t('factPlace')}</dt>
                <dd>
                  {EVENT.location}
                  {EVENT.address && <span className="fact__sub">{EVENT.address}</span>}
                  {EVENT.mapsUrl && (
                    <a className="fact__link" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">
                      {t('mapLink')} ↗
                    </a>
                  )}
                </dd>
              </div>
              <div className="fact">
                <dt>{t('factSessions')}</dt>
                <dd>
                  {SESSIONS.map((s) => (
                    <span key={s.id} className="fact__line">
                      <span className="fact__idx">{t('sessionLabel', s.id)}</span>
                      {s.time[lang]}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="fact">
                <dt>{t('factCapacity')}</dt>
                <dd>{t('factCapacityValue', EVENT.capacityPerSession)}</dd>
              </div>
            </dl>

            <aside className="req">
              <p className="req__label">{t('reqLabel')}</p>
              <p className="req__title">{t('reqTitle')}</p>
              <p className="req__text">{t('reqText')}</p>
            </aside>
          </div>
        </section>

        {/* FORM */}
        <section id="apply" className="register" aria-labelledby="register-title">
          <div className="register__grid wrap">
            <figure className="register__media">
              <img src={imgPortrait} alt="" loading="lazy" />
            </figure>
            <div className="register__panel">
              <RegistrationForm availability={availability} />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <Logos size="lg" className="on-dark" />
          <div className="footer__cols">
            <p>
              {EVENT.location}
              <br />
              {t('footerCity')}
            </p>
            <p>
              <a href={EVENT.instagramUrl} target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
