'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-vh-100 bg-light">
            <Header />

            <main className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10">
                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-body p-5">
                                <div className="mb-4">
                                    <Link href="/" className="btn btn-link text-decoration-none ps-0">
                                        ← Retour à l'accueil
                                    </Link>
                                </div>

                                <h1 className="display-5 fw-bold text-dark mb-4">Politique de confidentialité</h1>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Vie privée et données à caractère personnel</h2>
                                    <p className="text-muted mb-3">
                                        A l'Université de Technologie de Troyes et au sein de l'association UTT Net Group, nous respectons
                                        votre vie privée. Les données collectées et utilisées par cette plateforme sont nécessaires afin
                                        de vous permettre de gérer votre profil et de générer des badges d'identification pour les
                                        évènements et le campus.
                                    </p>
                                </section>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Données personnelles collectées</h2>
                                    <ul className="text-muted">
                                        <li>L'identité de l'utilisateur (nom, prénom)</li>
                                        <li>L'adresse email</li>
                                        <li>La photographie de profil</li>
                                        <li>Les informations de badge (rôle, commission, accès)</li>
                                    </ul>
                                </section>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Comment ces informations sont-elles utilisées ?</h2>
                                    <p className="text-muted mb-3">
                                        L'utilisateur est informé de la nécessité de respecter les dispositions légales en matière de
                                        traitement automatisé de données à caractère personnel, conformément à la loi n°78-17 du 6 janvier
                                        1978, dite Informatique et Libertés modifiée et au règlement général sur la protection des données
                                        EU-2016/679 (RGPD).
                                    </p>
                                    <p className="text-muted mb-3">
                                        Les données à caractère personnel sont des informations qui permettent sous quelque forme que ce
                                        soit, directement ou indirectement, l'identification des personnes physiques auxquelles elles
                                        s'appliquent.
                                    </p>
                                    <p className="text-muted mb-3">
                                        Ces informations sont utilisées pour :
                                    </p>
                                    <ul className="text-muted">
                                        <li>Permettre l'authentification et l'identification des utilisateurs sur la plateforme</li>
                                        <li>Générer des badges d'identification personnalisés pour les évènements et le campus</li>
                                        <li>Gérer les droits d'accès et les permissions des utilisateurs</li>
                                        <li>Faciliter l'organisation et la gestion des évènements</li>
                                    </ul>
                                </section>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Quelle est la durée de conservation de ces données ?</h2>
                                    <p className="text-muted mb-3">
                                        Les données personnelles transmises par l'utilisateur sont conservées pendant toute la durée de
                                        scolarité de l'utilisateur à l'UTT, et supprimées au maximum 12 mois après la fin de celle-ci.
                                    </p>
                                    <p className="text-muted">
                                        Les cookies de session sont détruits lors de la déconnexion ou à leur expiration.
                                    </p>
                                </section>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Vos droits sur vos données</h2>
                                    <p className="text-muted mb-3">
                                        Conformément à la réglementation sur les données à caractère personnel, vous disposez des droits
                                        suivants :
                                    </p>
                                    <ul className="text-muted mb-3">
                                        <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                                        <li><strong>Droit de rectification :</strong> corriger des données inexactes vous concernant</li>
                                        <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                                        <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                                        <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                                    </ul>
                                </section>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Comment exercer vos droits ?</h2>
                                    <p className="text-muted mb-3">
                                        Si vous avez des questions, ou que vous souhaitez exercer vos droits (accès, rectification,
                                        suppression), vous pouvez :
                                    </p>
                                    <ul className="text-muted mb-3">
                                        <li>
                                            Envoyer un courriel aux administrateurs de la plateforme à{' '}
                                            <a href="mailto:ung+sia@utt.fr" className="text-primary">ung+sia@utt.fr</a>
                                        </li>
                                        <li>
                                            Contacter le délégué à la protection des données à{' '}
                                            <a href="mailto:ung+dpo@utt.fr" className="text-primary">ung+dpo@utt.fr</a>
                                        </li>
                                        <li>
                                            Envoyer un courrier postal à l'adresse suivante :<br />
                                            <span className="ms-3">UTT Net Group</span><br />
                                            <span className="ms-3">12, rue Marie Curie, CS 42060</span><br />
                                            <span className="ms-3">10004 TROYES CEDEX</span>
                                        </li>
                                    </ul>
                                    <p className="text-muted">
                                        Si vous estimez, après nous avoir contacté, que vos droits Informatique et Libertés ne sont pas
                                        respectés ou que le dispositif n'est pas conforme aux règles de protection des données, vous pouvez
                                        adresser une réclamation en ligne à la{' '}
                                        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-primary">
                                            CNIL
                                        </a>
                                        {' '}ou par voie postale.
                                    </p>
                                </section>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Responsable du traitement</h2>
                                    <p className="text-muted mb-3">
                                        Le responsable du traitement des données est Arthur Dodin, Président de l'association UTT Net Group.
                                    </p>
                                    <p className="text-muted">
                                        L'équipe technique et les administrateurs du site pourront accéder aux données dans le cadre
                                        de la gestion de la plateforme et du support technique.
                                    </p>
                                </section>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Sécurité des données</h2>
                                    <p className="text-muted mb-3">
                                        Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées afin de
                                        garantir un niveau de sécurité adapté au risque, conformément aux exigences du RGPD.
                                    </p>
                                    <p className="text-muted">
                                        Ces données ne seront en aucun cas échangées, distribuées ou vendues à un tiers.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="h4 fw-bold text-primary mb-3">Cookies</h2>
                                    <p className="text-muted mb-3">
                                        Nous utilisons des cookies afin d'obtenir des statistiques sur notre site web. Ces informations
                                        ne seront en aucun cas vendues, échangées ou données. Ces cookies sont anonymisés.
                                    </p>
                                    <p className="text-muted mb-3">
                                        Afin d'assurer le fonctionnement du service à l'utilisateur authentifié, des cookies de session
                                        sont inscrits sur le navigateur lors de l'authentification sur le site. Ceux-ci ont pour seule
                                        fonction d'assurer la persistance de la session authentifiée de l'utilisateur. Ils sont détruits
                                        lors de la déconnexion ou à leur expiration.
                                    </p>
                                    <p className="text-muted">
                                        Conformément à la directive européenne 2009/136/CE, ces cookies sont indispensables à la
                                        fourniture du service sollicité. En naviguant sur notre site web, vous acceptez l'utilisation
                                        de ces cookies.
                                    </p>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
