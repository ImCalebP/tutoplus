'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ConditionsUtilisationPage() {
    return (
        <main className="policy-page">
            <nav className="navbar scrolled">
                <div className="container">
                    <div className="nav-content">
                        <Link href="/" className="nav-logo">
                            <Image src="/logo.jpg" alt="Tuto+" width={40} height={40} style={{ borderRadius: '8px' }} />
                            Tuto+
                        </Link>
                        <div className="nav-links">
                            <Link href="/" className="nav-link">Accueil</Link>
                            <Link href="/connexion" className="btn btn-primary">Connexion</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
                <div className="policy-content">
                    <h1>Conditions d'Utilisation</h1>
                    <p className="policy-updated">Dernière mise à jour : {new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <section className="policy-section">
                        <h2>1. Acceptation des Conditions</h2>
                        <p>
                            En créant un compte sur <strong>Tuto+</strong> et en utilisant nos services,
                            vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez
                            pas ces conditions, veuillez ne pas utiliser notre plateforme.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>2. Description des Services</h2>
                        <p>
                            Tuto+ offre des services de tutorat personnalisé pour les élèves du primaire,
                            du secondaire et du cégep. Nos services sont disponibles :
                        </p>
                        <ul>
                            <li><strong>En ligne :</strong> Séances virtuelles via visioconférence</li>
                            <li><strong>À domicile :</strong> Dans les régions de Val-des-Monts et Gatineau</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>3. Inscription et Compte</h2>
                        <h3>3.1 Création de compte</h3>
                        <p>
                            Pour utiliser nos services, vous devez créer un compte en fournissant des informations
                            exactes et complètes. Si vous inscrivez un mineur, vous confirmez être son parent
                            ou tuteur légal et avoir l'autorité pour l'inscrire.
                        </p>

                        <h3>3.2 Responsabilité du compte</h3>
                        <p>
                            Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion
                            et de toutes les activités effectuées sous votre compte.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>4. Tarification et Paiement</h2>
                        <ul>
                            <li><strong>En ligne (tous niveaux) :</strong> 35$/heure</li>
                            <li><strong>Primaire (présentiel) :</strong> 40$/heure</li>
                            <li><strong>Secondaire (présentiel) :</strong> 42$/heure</li>
                            <li><strong>Cégep :</strong> 40$ (en ligne) à 45$ (présentiel)/heure</li>
                        </ul>
                        <p>
                            Le paiement est dû à la fin de chaque séance. Nous acceptons les paiements
                            par carte de crédit uniquement.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>5. Politique d'Annulation</h2>
                        <p>
                            Les annulations doivent être effectuées <strong>au moins 24 heures à l'avance</strong>.
                            Les annulations de dernière minute (moins de 24 heures) peuvent entraîner des frais
                            équivalents à 50% du coût de la séance.
                        </p>
                        <p>
                            En cas de non-présentation sans préavis, la totalité de la séance peut être facturée.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>6. Responsabilités et Limitations</h2>
                        <h3>6.1 Nos engagements</h3>
                        <p>
                            Nous nous engageons à fournir un service de tutorat de qualité, assuré par des
                            tuteurs compétents et dévoués.
                        </p>

                        <h3>6.2 Limitations</h3>
                        <p>
                            Tuto+ ne garantit pas de résultats scolaires spécifiques. Le succès académique
                            dépend de nombreux facteurs, incluant l'engagement de l'élève et la pratique régulière.
                        </p>
                        <p>
                            En aucun cas, Tuto+ ne sera responsable de dommages indirects, accessoires ou
                            consécutifs liés à l'utilisation de nos services.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>7. Comportement Attendu</h2>
                        <p>
                            Nous nous attendons à un environnement respectueux pour les séances de tutorat :
                        </p>
                        <ul>
                            <li>Respect mutuel entre tuteurs, élèves et parents</li>
                            <li>Espace de travail calme et approprié (pour les services à domicile)</li>
                            <li>Ponctualité aux séances</li>
                            <li>Communication ouverte concernant les besoins et préoccupations</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>8. Résiliation</h2>
                        <p>
                            Vous pouvez résilier votre compte à tout moment en nous contactant par courriel.
                            Nous nous réservons le droit de suspendre ou de résilier un compte en cas de :
                        </p>
                        <ul>
                            <li>Violation des présentes conditions</li>
                            <li>Comportement inapproprié ou irrespectueux</li>
                            <li>Non-paiement répété des services</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>9. Modifications des Conditions</h2>
                        <p>
                            Nous nous réservons le droit de modifier ces conditions à tout moment.
                            Les modifications importantes seront communiquées par courriel.
                            La poursuite de l'utilisation de nos services après modification constitue
                            une acceptation des nouvelles conditions.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>10. Droit Applicable</h2>
                        <p>
                            Ces conditions sont régies par les lois de la province de Québec et les lois
                            fédérales du Canada applicables. Tout litige sera soumis à la compétence
                            exclusive des tribunaux du Québec.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>11. Contact</h2>
                        <p>
                            Pour toute question concernant ces conditions d'utilisation :
                        </p>
                        <div className="contact-info">
                            <p><strong>Tuto+</strong></p>
                            <p>Courriel : <a href="mailto:tutoplus2025@gmail.com">tutoplus2025@gmail.com</a></p>
                        </div>
                    </section>

                    <div className="policy-footer">
                        <Link href="/" className="btn btn-secondary">← Retour à l'accueil</Link>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <h3>Tuto+</h3>
                        <p>Votre succès scolaire commence ici</p>
                        <div className="footer-copyright">
                            © {new Date().getFullYear()} Tuto+. Tous droits réservés.
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
