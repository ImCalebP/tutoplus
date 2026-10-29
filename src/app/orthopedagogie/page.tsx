'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CookieConsent from '@/components/CookieConsent';

export default function Orthopedagogie() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <Link href="/" className="nav-logo">
              <Image src="/logo.jpg" alt="Tuto+" width={40} height={40} style={{ borderRadius: '8px' }} />
              Tuto+
            </Link>
            <div className="nav-links">
              <Link href="/#services" className="nav-link">Services</Link>
              <Link href="/#about" className="nav-link">À Propos</Link>
              <Link href="/#demarche" className="nav-link">Démarche</Link>
              <Link href="/#politiques" className="nav-link">Politiques</Link>
              <Link href="/connexion" className="btn btn-primary">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '60vh', paddingTop: '120px' }}>
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="pencil-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>Orthopédagogie</h1>
            <p className="hero-subtitle">
              Un accompagnement spécialisé pour les élèves qui rencontrent des <span className="pencil-circle">difficultés persistantes</span>.
            </p>
            <p style={{ fontSize: '1.2rem', marginTop: '2rem', color: 'var(--text-dark)' }}>
              Chez Tuto+, nous offrons maintenant un service d'orthopédagogie pour les élèves qui ont besoin d'un accompagnement plus spécialisé. Ce service s'adresse aux élèves qui rencontrent des difficultés persistantes en lecture, écriture ou mathématiques, malgré leurs efforts.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ background: 'white', padding: 'var(--section-padding) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            {/* C'est quoi ? */}
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>C'est quoi l'orthopédagogie ?</h2>
              <p>
                L'orthopédagogie est un service spécialisé pour aider les élèves en difficulté à mieux comprendre et progresser à l'école. Contrairement au tutorat, elle vise à <strong>travailler en profondeur</strong> les difficultés et à développer des stratégies adaptées pour favoriser l'autonomie et la confiance.
              </p>
            </div>
            
            {/* Pourquoi consulter ? */}
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Pourquoi consulter ?</h2>
              <p>
                Consulter en orthopédagogie permet d'aller plus loin qu'un simple soutien scolaire. Ce service est particulièrement utile lorsque les difficultés persistent malgré les efforts. 
              </p>
              <p>
                Il permet de mieux comprendre les besoins de l'élève, de mettre en place des stratégies adaptées et de l'aider à reprendre confiance dans ses capacités. L'objectif est d'accompagner l'élève de façon ciblée pour favoriser des progrès durables et une plus grande autonomie.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--cream)', padding: 'var(--section-padding) 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Pour qui ce service s'adresse-t-il ?</h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card" style={{ padding: '1.5rem' }}>
               <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="2">
                   <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                 </svg>
                 Difficultés scolaires
               </h4>
               <p style={{ marginTop: '0.5rem' }}>Élèves ayant des difficultés en lecture, écriture ou mathématiques.</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem' }}>
               <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="2">
                   <circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>
                 </svg>
                 Confiance en soi
               </h4>
               <p style={{ marginTop: '0.5rem' }}>Élèves qui manquent de confiance à l'école.</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem' }}>
               <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="2">
                   <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                 </svg>
                 Organisation
               </h4>
               <p style={{ marginTop: '0.5rem' }}>Ceux qui ont de la difficulté à s'organiser ou à comprendre la matière.</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem' }}>
               <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="2">
                   <circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>
                 </svg>
                 Troubles d'apprentissage
               </h4>
               <p style={{ marginTop: '0.5rem' }}>Présentant des troubles (dyslexie, dysorthographie, dyscalculie, etc.).</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem' }}>
               <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="2">
                   <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
                 </svg>
                 Plan d'intervention
               </h4>
               <p style={{ marginTop: '0.5rem' }}>Élèves avec un plan d'intervention (PI / IEP) ou des besoins particuliers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profil Orthopédagogue & Tarifs */}
      <section style={{ background: 'white', padding: 'var(--section-padding) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            
            {/* Profil */}
            <div style={{ background: 'var(--cream)', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Notre Orthopédagogue</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary-gold)', flexShrink: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/linda-lacoste.png" alt="Linda Lacoste" width={80} height={80} style={{ objectFit: 'cover', width: '100%', height: '100%', objectPosition: 'top' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Linda Lacoste</h3>
                  <p style={{ margin: 0, color: 'var(--text-medium)', fontSize: '1.05rem' }}>Enseignante & Maîtrise en enseignement</p>
                </div>
              </div>
              <p>
                Linda possède <strong className="gold-gradient-text">plus de 400 heures d'expérience</strong> en tutorat et plusieurs autres en orthopédagogie auprès d'élèves du primaire.
              </p>
              <p>
                Elle accompagne les élèves avec <strong>patience et rigueur</strong> en mettant en place des stratégies adaptées à leurs besoins. Son objectif est d'aider chaque élève à mieux comprendre, à développer de bonnes méthodes de travail et à gagner en confiance.
              </p>
            </div>

            {/* Tarifs */}
            <div className="service-card" style={{ border: '2px solid var(--primary-gold)', transform: 'scale(1.02)' }}>
              <div className="service-icon-wrapper" style={{ background: 'var(--gradient-gold)' }}>
                <svg className="service-icon" viewBox="0 0 24 24" style={{ stroke: '#fff' }}>
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="service-title">Tarifs</h3>
              <p className="service-description" style={{ marginBottom: '1.5rem', background: 'var(--pale-gold)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--dark-green)', fontWeight: 600 }}>
                Uniquement pour les élèves du primaire.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--dark-green)' }}>En Ligne</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-gold)' }}>80$</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--dark-green)' }}>Présentiel</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-gold)' }}>90$</span>
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', background: '#eefcf5', borderLeft: '4px solid var(--primary-green)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--dark-green)' }}>
                  <strong>Remarque :</strong> Les services en orthopédagogie peuvent être déductibles des impôts et couverts par la plupart des assurances.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Démarche & Inscription */}
      <section style={{ background: 'var(--cream)', padding: 'var(--section-padding) 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Prêt à commencer ?</h2>
            <p className="section-subtitle">Voici comment se déroule la démarche</p>
          </div>

          <div className="process-steps" style={{ marginBottom: '4rem' }}>
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Procédure</h4>
                <p>
                  Un membre de notre équipe entre en contact avec vous pour discuter des modalités. Ensuite, une orthopédagogue vous contacte pour planifier la première rencontre dans un délai d'environ 3 jours.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Déroulement</h4>
                <p>
                  Rencontres en ligne ou dans un cubicule de travail dans l'une des bibliothèques municipales de Gatineau. Lors d'une séance, l'orthopédagogue observe les besoins, identifie les difficultés et accompagne l'élève à l'aide de stratégies adaptées.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/inscription" className="btn btn-primary btn-large" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
              S'inscrire
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '0.5rem' }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Bannière FAQ */}
      <section style={{ background: 'var(--primary-green)', padding: '4rem 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h3 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Vous avez des questions ?</h3>
          <p style={{ color: 'var(--pale-gold)', fontSize: '1.2rem', marginBottom: '2rem' }}>
            N'hésitez pas à nous poser vos questions à notre adresse courriel.
          </p>
          <a href="mailto:tutoplus2025@gmail.com" className="btn btn-secondary" style={{ background: 'white', color: 'var(--primary-green)' }}>
            Nous contacter
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '0.5rem' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo-wrapper">
              <Image
                src="/logo.jpg"
                alt="Tuto+ Logo"
                width={80}
                height={80}
                style={{ display: 'block' }}
              />
            </div>
            <h3>Tuto+</h3>
            <p>Votre succès scolaire commence ici</p>
            <div className="footer-locations">
              <div className="location-badge">
                <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Val-des-Monts
              </div>
              <div className="location-badge">
                <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Gatineau
              </div>
              <div className="location-badge">
                <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Longueuil – Brossard et environs
              </div>
            </div>
            <div className="footer-contact" style={{ marginTop: '1rem' }}>
              <a href="mailto:tutoplus2025@gmail.com" style={{ color: 'var(--pale-gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                tutoplus2025@gmail.com
              </a>
            </div>
            <div className="footer-links" style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <Link href="/conditions-utilisation" style={{ color: 'var(--pale-gold)', fontSize: '0.9rem' }}>
                Conditions d'utilisation
              </Link>
              <Link href="/politique-de-confidentialite" style={{ color: 'var(--pale-gold)', fontSize: '0.9rem' }}>
                Politique de confidentialité
              </Link>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} Tuto+. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
      
      <CookieConsent />
    </main>
  );
}
