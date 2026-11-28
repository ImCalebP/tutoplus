'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import styles from './pricing-4.module.css';

const modes = [
  { id: 'presentiel', label: 'En présentiel', description: 'Un accompagnement à domicile, dans un environnement familier.' },
  { id: 'online', label: 'En ligne', description: 'Le même accompagnement personnalisé, où que vous soyez.' },
] as const;

const plans = [
  { name: 'Primaire', description: 'Des bases solides et le plaisir d’apprendre.',
    prices: [43, 38], services: ['primaire', 'online'],
    features: ['Aide aux devoirs', 'Renforcement des bases', 'Accompagnement personnalisé'] },
  { name: 'Secondaire', description: 'De la méthode pour progresser avec confiance.',
    prices: [45, 38], services: ['secondaire', 'online'],
    features: ['Préparation aux examens', 'Compréhension des matières', 'Méthodes de travail'] },
  { name: 'CÉGEP', description: 'Un soutien ciblé pour les études collégiales.',
    prices: [45, 40], services: ['cegep', 'cegep_online'],
    features: ['Matières avancées', 'Préparation aux évaluations', 'Accompagnement spécialisé'] },
];

export default function PricingSection() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectTab = (index: number) => {
    setActive(index);
    tabs.current[index]?.focus();
  };
  return (
    <div className={styles.pricing}>
      <div className={styles.tabs} role="tablist" aria-label="Format des séances">
        <span className={styles.tabIndicator} style={{ transform: `translateX(${active * 100}%)` }} aria-hidden="true" />
        {modes.map((mode, index) => (
          <button key={mode.id} ref={element => { tabs.current[index] = element; }}
            type="button" role="tab" id={`pricing-tab-${mode.id}`}
            aria-controls={`pricing-panel-${mode.id}`} aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={event => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault(); selectTab(1 - active);
              } else if (event.key === 'Home' || event.key === 'End') {
                event.preventDefault(); selectTab(event.key === 'Home' ? 0 : 1);
              }
            }}>
            {mode.label}
          </button>
        ))}
      </div>
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${active * 100}%)` }}>
          {modes.map((mode, index) => (
            <div key={mode.id} id={`pricing-panel-${mode.id}`} role="tabpanel"
              aria-labelledby={`pricing-tab-${mode.id}`}
              aria-hidden={active !== index} inert={active !== index}
              className={styles.panel}>
              <p className={styles.modeDescription}>{mode.description}</p>
              <div className={styles.grid}>
                {plans.map((plan, planIndex) => (
                  <article key={plan.name} className={`${styles.card} ${planIndex === 1 ? styles.emphasized : ''}`}>
                    <div className={styles.cardHead}>
                      <span className={styles.format}>{mode.label}</span>
                      <h3>{plan.name}</h3>
                      <p className={styles.description}>{plan.description}</p>
                      <p className={styles.price}><span>{plan.prices[index]}</span><span className={styles.currency}>&nbsp;$</span></p>
                      <span className={styles.priceNote}>Dollars canadiens</span>
                    </div>
                    <ul className={styles.features}>
                      <li><Check />{index === 0 ? 'Séances à domicile' : 'Séances en visioconférence'}</li>
                      {plan.features.map(feature => <li key={feature}><Check />{feature}</li>)}
                    </ul>
                    <div className={styles.cardFoot}>
                      <Link href={`/inscription?service=${plan.services[index]}`}
                        className={styles.cta} aria-label={`Choisir ${plan.name} — ${mode.label}`}>
                        Choisir ce service <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Check() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" />
  </svg>;
}
