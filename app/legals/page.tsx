'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LegalsPage() {
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

                                <h1 className="display-5 fw-bold text-dark mb-4">Mentions légales</h1>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Propriétaire et hébergeur du site</h2>
                                    <p className="mb-2"><strong>UTT Net Group</strong>, association loi 1901</p>
                                    <ul className="list-unstyled text-muted">
                                        <li>N° RNA : W103000699</li>
                                        <li>N° d'immatriculation RCS : 500164249</li>
                                        <li>12 rue Marie Curie, CS 42060, 10004 TROYES CEDEX</li>
                                        <li>03 25 71 85 50</li>
                                        <li><a href="mailto:ung@utt.fr" className="text-primary">ung@utt.fr</a></li>
                                    </ul>
                                </section>

                                <section className="mb-5">
                                    <h2 className="h4 fw-bold text-primary mb-3">Protection des données personnelles</h2>
                                    <p className="text-muted mb-3">
                                        Le site collecte et traite des données personnelles conformément à la loi Informatique et Libertés
                                        du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD) EU-2016/679.
                                    </p>
                                    <p className="text-muted">
                                        Pour plus d'informations sur la collecte, l'utilisation et la conservation de vos données personnelles,
                                        ainsi que sur vos droits, veuillez consulter notre{' '}
                                        <a href="/privacy" className="text-primary fw-bold">Politique de confidentialité</a>.
                                    </p>
                                    <p className="text-muted">
                                        L'ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété exclusive
                                        de l'association UTT Net Group, sauf mention contraire.
                                    </p>
                                    <p className="text-muted">
                                        Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces
                                        différents éléments est strictement interdite sans l'accord exprès par écrit de l'association
                                        UTT Net Group.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="h4 fw-bold text-primary mb-3">Crédits</h2>
                                    <p className="text-muted">
                                        Ce site a été développé et est maintenu par l'association UTT Net Group.
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

