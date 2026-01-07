'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PolitiqueConfidentialitePage() {
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
                    <h1>Politique de Confidentialité</h1>
                    <p className="policy-updated">Dernière mise à jour : {new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <section className="policy-section">
                        <h2>1. Introduction</h2>
                        <p>
                            Chez <strong>Tuto+</strong>, nous nous engageons à protéger la vie privée de nos utilisateurs
                            conformément à la <strong>Loi 25 du Québec</strong> (Loi modernisant des dispositions législatives
                            en matière de protection des renseignements personnels) et à la <strong>Loi sur la protection
                                des renseignements personnels et les documents électroniques (LPRPDE)</strong>.
                        </p>
                        <p>
                            Cette politique explique comment nous collectons, utilisons, divulguons et protégeons
                            vos renseignements personnels lorsque vous utilisez notre site web et nos services de tutorat.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>2. Renseignements Collectés</h2>
                        <p>Nous collectons les renseignements suivants :</p>

                        <h3>2.1 Renseignements fournis directement</h3>
                        <ul>
                            <li><strong>Informations d'identification :</strong> Nom du parent/tuteur, nom de l'élève</li>
                            <li><strong>Coordonnées :</strong> Adresse courriel, numéro de téléphone, adresse postale</li>
                            <li><strong>Informations sur les services :</strong> Type de service souhaité, niveau scolaire</li>
                            <li><strong>Informations supplémentaires :</strong> Besoins particuliers, spécifications académiques</li>
                        </ul>

                        <h3>2.2 Renseignements collectés automatiquement</h3>
                        <ul>
                            <li><strong>Données de connexion :</strong> Adresse IP, type de navigateur, pages visitées</li>
                            <li><strong>Cookies d'authentification :</strong> Jetons de session pour maintenir votre connexion</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>3. Utilisation des Témoins (Cookies)</h2>
                        <p>
                            Notre site utilise uniquement des <strong>cookies essentiels</strong> nécessaires au fonctionnement
                            du service d'authentification. Ces cookies permettent :
                        </p>
                        <ul>
                            <li>De maintenir votre session de connexion</li>
                            <li>De sécuriser votre compte</li>
                            <li>De mémoriser vos préférences de consentement</li>
                        </ul>
                        <p>
                            Nous n'utilisons <strong>aucun cookie de suivi, publicitaire ou analytique</strong>.
                            Vous pouvez gérer vos cookies via les paramètres de votre navigateur.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>4. Finalités de la Collecte</h2>
                        <p>Vos renseignements personnels sont utilisés pour :</p>
                        <ul>
                            <li>Traiter et répondre à vos demandes d'inscription</li>
                            <li>Fournir nos services de tutorat</li>
                            <li>Communiquer avec vous concernant vos séances</li>
                            <li>Gérer la facturation et les paiements</li>
                            <li>Améliorer nos services</li>
                            <li>Respecter nos obligations légales</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>5. Partage des Renseignements</h2>
                        <p>
                            Nous ne vendons, ne louons et ne partageons <strong>jamais</strong> vos renseignements personnels
                            à des tiers à des fins commerciales.
                        </p>
                        <p>Vos données peuvent être partagées uniquement avec :</p>
                        <ul>
                            <li><strong>Nos tuteurs :</strong> Les informations nécessaires pour fournir les services de tutorat</li>
                            <li><strong>Fournisseurs de services :</strong> Services techniques essentiels (hébergement, authentification)</li>
                            <li><strong>Autorités légales :</strong> Si requis par la loi</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>6. Vos Droits (Loi 25)</h2>
                        <p>Conformément à la Loi 25 du Québec, vous avez le droit de :</p>
                        <ul>
                            <li><strong>Accéder</strong> à vos renseignements personnels</li>
                            <li><strong>Rectifier</strong> les renseignements inexacts ou incomplets</li>
                            <li><strong>Retirer</strong> votre consentement à tout moment</li>
                            <li><strong>Demander la suppression</strong> de vos renseignements (droit à l'effacement)</li>
                            <li><strong>Obtenir une copie</strong> de vos données dans un format technologique structuré</li>
                            <li><strong>Déposer une plainte</strong> auprès de la Commission d'accès à l'information du Québec</li>
                        </ul>
                        <p>
                            Pour exercer ces droits, contactez-nous à : <a href="mailto:tutoplus2025@gmail.com">tutoplus2025@gmail.com</a>
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>7. Sécurité des Données</h2>
                        <p>
                            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées
                            pour protéger vos renseignements personnels contre l'accès non autorisé, la divulgation,
                            la modification ou la destruction, notamment :
                        </p>
                        <ul>
                            <li>Chiffrement des données en transit (HTTPS/SSL)</li>
                            <li>Authentification sécurisée</li>
                            <li>Accès limité aux données sur une base de besoin de savoir</li>
                            <li>Hébergement sécurisé avec des fournisseurs de confiance</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>8. Conservation des Données</h2>
                        <p>
                            Nous conservons vos renseignements personnels uniquement aussi longtemps que nécessaire
                            pour les finalités décrites dans cette politique ou pour respecter nos obligations légales.
                        </p>
                        <p>
                            À la fin de votre relation avec nous, vos données seront supprimées ou anonymisées
                            dans un délai raisonnable, sauf si la loi nous oblige à les conserver plus longtemps.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>9. Responsable de la Protection des Renseignements</h2>
                        <p>
                            Pour toute question concernant cette politique ou vos renseignements personnels,
                            contactez notre responsable de la protection des renseignements personnels :
                        </p>
                        <div className="contact-info">
                            <p><strong>Tuto+</strong></p>
                            <p>Courriel : <a href="mailto:tutoplus2025@gmail.com">tutoplus2025@gmail.com</a></p>
                            <p>Régions desservies : Val-des-Monts, Gatineau</p>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h2>10. Modifications de la Politique</h2>
                        <p>
                            Nous pouvons modifier cette politique de confidentialité périodiquement.
                            En cas de modification importante, nous vous en informerons par courriel ou
                            par un avis visible sur notre site. La date de la dernière mise à jour est
                            indiquée en haut de cette page.
                        </p>
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
