'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 400);
      setNavScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRegistration = () => {
    document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      {/* Navigation */}
      <nav className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <a href="#" className="nav-logo">
              <Image src="/logo.jpg" alt="Tutoplus" width={40} height={40} style={{ borderRadius: '8px' }} />
              Tutoplus
            </a>
            <div className="nav-links">
              <a href="#services" className="nav-link">Services</a>
              <a href="#about" className="nav-link">À Propos</a>
              <a href="#demarche" className="nav-link">Démarche</a>
              <a href="#politiques" className="nav-link">Politiques</a>
              <Link href="/connexion" className="btn btn-primary">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        {/* Animated Background Lines and Shapes - MANY MORE LINES */}
        <div className="hero-lines" style={{ opacity: 0.8 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            {/* 15 wavy horizontal lines - much more visible */}
            {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90].map((y, i) => (
              <path
                key={`h-${i}`}
                d={`M 0 ${y} Q 25 ${y - 5} 50 ${y} T 100 ${y}`}
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeWidth: i % 3 === 0 ? '0.35' : '0.25',
                  stroke: i % 3 === 0 ? 'var(--primary-green)' : i % 3 === 1 ? 'var(--primary-gold)' : 'var(--accent-green)',
                  fill: 'none',
                  opacity: 0.7 + (i % 3) * 0.1
                }}>
                <animate
                  attributeName="d"
                  dur={`${6 + i * 0.3}s`}
                  repeatCount="indefinite"
                  values={`
                    M 0 ${y} Q 25 ${y - 5} 50 ${y} T 100 ${y};
                    M 0 ${y} Q 25 ${y + 5} 50 ${y} T 100 ${y};
                    M 0 ${y} Q 25 ${y - 5} 50 ${y} T 100 ${y}
                  `}
                />
              </path>
            ))}

            {/* Diagonal flowing lines */}
            <path d="M 0 0 Q 30 25 60 15 T 100 40" vectorEffect="non-scaling-stroke" style={{ strokeWidth: '0.3', stroke: 'var(--primary-green)', opacity: 0.7, fill: 'none' }}>
              <animate attributeName="d" dur="12s" repeatCount="indefinite"
                values="M 0 0 Q 30 25 60 15 T 100 40; M 0 5 Q 30 35 60 25 T 100 50; M 0 0 Q 30 25 60 15 T 100 40" />
            </path>

            <path d="M 0 100 Q 30 75 60 85 T 100 60" vectorEffect="non-scaling-stroke" style={{ strokeWidth: '0.3', stroke: 'var(--primary-gold)', opacity: 0.7, fill: 'none' }}>
              <animate attributeName="d" dur="11s" repeatCount="indefinite"
                values="M 0 100 Q 30 75 60 85 T 100 60; M 0 95 Q 30 65 60 75 T 100 50; M 0 100 Q 30 75 60 85 T 100 60" />
            </path>

            <path d="M 0 30 Q 50 20 100 35" vectorEffect="non-scaling-stroke" style={{ strokeWidth: '0.25', stroke: 'var(--accent-green)', opacity: 0.6, fill: 'none' }}>
              <animate attributeName="d" dur="13s" repeatCount="indefinite"
                values="M 0 30 Q 50 20 100 35; M 0 30 Q 50 40 100 35; M 0 30 Q 50 20 100 35" />
            </path>

            <path d="M 0 70 Q 50 80 100 65" vectorEffect="non-scaling-stroke" style={{ strokeWidth: '0.25', stroke: 'var(--light-gold)', opacity: 0.6, fill: 'none' }}>
              <animate attributeName="d" dur="14s" repeatCount="indefinite"
                values="M 0 70 Q 50 80 100 65; M 0 70 Q 50 60 100 65; M 0 70 Q 50 80 100 65" />
            </path>

            {/* Animated circles */}
            {[[15, 25, 4], [85, 75, 5], [50, 12, 3], [30, 88, 4.5], [70, 40, 3.5], [40, 60, 4], [60, 20, 3.5]].map(([cx, cy, maxR], i) => (
              <circle key={`c-${i}`} cx={cx} cy={cy} r="0" style={{ stroke: i % 2 === 0 ? 'var(--primary-green)' : 'var(--primary-gold)', fill: 'none', strokeWidth: '0.15' }}>
                <animate attributeName="r" dur={`${5 + i}s`} repeatCount="indefinite" values={`0; ${maxR}; 0`} begin={`${i * 0.5}s`} />
                <animate attributeName="opacity" dur={`${5 + i}s`} repeatCount="indefinite" values="0; 0.75; 0" begin={`${i * 0.5}s`} />
              </circle>
            ))}

            {/* Curved connecting lines */}
            <path d="M 10 45 Q 50 25 90 45" vectorEffect="non-scaling-stroke" style={{ strokeWidth: '0.25', stroke: 'var(--primary-gold)', opacity: 0.65, fill: 'none' }}>
              <animate attributeName="d" dur="10s" repeatCount="indefinite"
                values="M 10 45 Q 50 25 90 45; M 10 45 Q 50 65 90 45; M 10 45 Q 50 25 90 45" />
            </path>

            <path d="M 20 55 Q 50 35 80 55" vectorEffect="non-scaling-stroke" style={{ strokeWidth: '0.2', stroke: 'var(--accent-green)', opacity: 0.6, fill: 'none' }}>
              <animate attributeName="d" dur="11s" repeatCount="indefinite"
                values="M 20 55 Q 50 35 80 55; M 20 55 Q 50 75 80 55; M 20 55 Q 50 35 80 55" />
            </path>
          </svg>
        </div>

        <div className="container">
          <div className="hero-content">
            <h1 className="pencil-title">Tutoplus</h1>
            <p className="hero-subtitle">
              <span className="pencil-underline active">Excellence académique</span> à domicile.<br />
              Votre <span className="pencil-circle">succès scolaire</span> commence ici.
            </p>
            <div className="location-badges">
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
            </div>
            <div style={{ marginTop: '2.5rem' }}>
              <button onClick={scrollToRegistration} className="btn btn-primary btn-large">
                Commencer Maintenant
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services">
        <div className="container">
          <div className="section-header">
            <h2>Nos Services de Tutorat</h2>
            <p className="section-subtitle">
              Des solutions d'apprentissage personnalisées pour tous les niveaux scolaires,
              adaptées à vos besoins et votre emploi du temps.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-wrapper">
                <svg className="service-icon" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <h3 className="service-title">En Ligne</h3>
              <span className="service-price">30$</span>
              <p className="service-description">
                Séances de tutorat virtuelles flexibles pour tous les niveaux. Apprenez confortablement de chez vous avec des outils interactifs modernes.
              </p>
              <ul className="service-features">
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Horaires flexibles
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Outils interactifs
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Tous niveaux
                </li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <svg className="service-icon" viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3 className="service-title">Primaire Présentiel</h3>
              <span className="service-price">35$</span>
              <p className="service-description">
                Accompagnement personnalisé à domicile pour les élèves du primaire. Renforcement des bases et aide aux devoirs dans un environnement familier.
              </p>
              <ul className="service-features">
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  À domicile
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Aide aux devoirs
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Renforcement des bases
                </li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <svg className="service-icon" viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3 className="service-title">Secondaire Présentiel</h3>
              <span className="service-price">38$</span>
              <p className="service-description">
                Soutien académique à domicile pour les élèves du secondaire. Préparation aux examens et maîtrise des matières complexes.
              </p>
              <ul className="service-features">
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Toutes matières
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Préparation examens
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Méthodologie
                </li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <svg className="service-icon" viewBox="0 0 24 24">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3 className="service-title">Cégep</h3>
              <span className="service-price">40$</span>
              <p className="service-description">
                Tutorat spécialisé pour étudiants du cégep, disponible en présentiel ou en ligne. Expertise dans les matières avancées.
              </p>
              <ul className="service-features">
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Présentiel & en ligne
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Matières avancées
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Expertise spécialisée
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Qui Sommes-Nous?</h2>
            <p className="section-subtitle">
              Une équipe passionnée dédiée à votre réussite académique
            </p>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              Chez <strong className="gradient-text">Tutoplus</strong>, nous croyons que chaque étudiant mérite
              un accompagnement de qualité pour atteindre son plein potentiel. Avec plus de <strong className="gold-gradient-text">100 heures d'expérience en tutorat</strong>,
              nous avons développé une approche pédagogique éprouvée qui s'adapte aux besoins uniques de chaque élève.
            </p>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-medium)' }}>
              Notre mission est de rendre l'éducation de qualité accessible à tous, en offrant des services
              professionnels à des tarifs compétitifs, sans jamais compromettre l'excellence de notre enseignement.
            </p>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Heures d'Expérience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Services Offerts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2</span>
              <span className="stat-label">Régions Desservies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us">
        <div className="container">
          <div className="section-header">
            <h2>Pourquoi Nous Choisir?</h2>
            <p className="section-subtitle">
              Des avantages concrets qui font la différence dans votre parcours académique
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3>Prix Compétitifs</h3>
              <p>
                Les tarifs les plus avantageux du marché sans compromis sur la qualité.
                Nous croyons que l'excellence éducative doit être accessible à tous les budgets.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3>Expérience Éprouvée</h3>
              <p>
                Plus de 100 heures d'expérience en tutorat nous permettent de comprendre
                les défis d'apprentissage et d'adapter nos méthodes pour des résultats concrets.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3>Service à Domicile</h3>
              <p>
                Profitez du confort de votre foyer avec nos services à domicile dans les régions
                de Val-des-Monts et Gatineau. Pas de déplacements, nous venons à vous.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Approche Personnalisée</h3>
              <p>
                Chaque élève est unique. Nous adaptons nos séances selon les besoins spécifiques,
                le rythme d'apprentissage et les objectifs individuels de chaque étudiant.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3>Flexibilité Maximale</h3>
              <p>
                Options en ligne et présentiel pour s'adapter à votre emploi du temps
                et vos préférences d'apprentissage. Vous choisissez ce qui vous convient le mieux.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3>Environnement Bienveillant</h3>
              <p>
                Nous prenons en compte les besoins particuliers de chaque élève et offrons
                un environnement d'apprentissage inclusif, respectueux et encourageant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="demarche" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Notre Démarche</h2>
            <p className="section-subtitle">
              Un processus simple et transparent pour commencer votre parcours vers la réussite
            </p>
          </div>

          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Remplissez le Formulaire</h4>
                <p>
                  Complétez notre formulaire d'inscription en ligne avec vos informations et celles de l'élève.
                  Précisez le service souhaité et votre adresse pour les services à domicile.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Confirmation Rapide</h4>
                <p>
                  Nous vous contacterons dans les 24 heures pour confirmer votre demande,
                  discuter de vos besoins spécifiques et vérifier nos disponibilités.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Planification Personnalisée</h4>
                <p>
                  Ensemble, nous établirons un horaire adapté à votre emploi du temps.
                  Nous discuterons des objectifs d'apprentissage et des matières à couvrir.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Début du Parcours</h4>
                <p>
                  Démarrez vos séances de tutorat personnalisées et constatez les progrès.
                  Nous maintenons une communication continue avec les parents pour suivre l'évolution.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={scrollToRegistration} className="btn btn-secondary btn-large">
              Commencer Maintenant
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section id="inscription">
        <div className="container">
          <div className="section-header">
            <h2>Prêt à Commencer?</h2>
            <p className="section-subtitle">
              Créez votre compte pour soumettre votre demande d'inscription et démarrer votre parcours vers la réussite
            </p>
          </div>

          <div className="registration-section" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ marginBottom: '2rem' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--dark-green)' }}>
                  Inscription Simple et Rapide
                </h3>
                <p style={{ color: 'var(--text-medium)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  En créant votre compte, vous pourrez soumettre votre demande d'inscription et suivre son statut en temps réel.
                  Notre équipe vous contactera dans les 24 à 48 heures pour confirmer votre inscription.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/inscription" className="btn btn-primary btn-large">
                  Créer un compte
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/connexion" className="btn btn-secondary btn-large">
                  Déjà un compte? Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section id="politiques" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Nos Politiques</h2>
            <p className="section-subtitle">
              Des règles claires et transparentes pour une collaboration harmonieuse
            </p>
          </div>

          <div className="policies-grid">
            <div className="policy-item">
              <div className="policy-icon-wrapper">
                <svg className="policy-icon" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <h4>Politique d'Annulation</h4>
              <p>
                Les annulations doivent être effectuées au moins 24 heures à l'avance.
                Les annulations de dernière minute peuvent entraîner des frais.
              </p>
            </div>

            <div className="policy-item">
              <div className="policy-icon-wrapper">
                <svg className="policy-icon" viewBox="0 0 24 24">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <path d="M1 10h22" />
                </svg>
              </div>
              <h4>Politique de Paiement</h4>
              <p>
                Le paiement est dû à la fin de chaque séance. Nous acceptons les paiements
                en espèces, par Interac ou virement bancaire.
              </p>
            </div>

            <div className="policy-item">
              <div className="policy-icon-wrapper">
                <svg className="policy-icon" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h4>Confidentialité</h4>
              <p>
                Toutes les informations personnelles et académiques sont strictement confidentielles.
                Nous respectons votre vie privée et celle de votre enfant.
              </p>
            </div>

            <div className="policy-item">
              <div className="policy-icon-wrapper">
                <svg className="policy-icon" viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h4>Matériel Pédagogique</h4>
              <p>
                Nous utilisons le matériel scolaire de l'élève ainsi que nos propres ressources.
                Aucun frais supplémentaire pour le matériel pédagogique.
              </p>
            </div>

            <div className="policy-item">
              <div className="policy-icon-wrapper">
                <svg className="policy-icon" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4>Communication Parents</h4>
              <p>
                Nous maintenons une communication ouverte avec les parents pour suivre
                les progrès et adapter nos approches selon les besoins.
              </p>
            </div>

            <div className="policy-item">
              <div className="policy-icon-wrapper">
                <svg className="policy-icon" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h4>Services à Domicile</h4>
              <p>
                Pour les services à domicile, nous demandons un environnement calme et approprié.
                Services disponibles à Val-des-Monts et Gatineau uniquement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo-wrapper">
              <Image
                src="/logo.jpg"
                alt="Tutoplus Logo"
                width={80}
                height={80}
                style={{ display: 'block' }}
              />
            </div>
            <h3>Tutoplus</h3>
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
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} Tutoplus. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Registration Button */}
      {showStickyButton && (
        <div className="sticky-register">
          <button onClick={scrollToRegistration} className="btn btn-secondary">
            S'inscrire
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </button>
        </div>
      )}
    </main>
  );
}
