'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-dark text-white py-5 mt-5">
            <div className="container">
                <div className="row">
                    {/* Section À propos */}
                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <h5 className="fw-bold mb-3">À propos</h5>
                        <p className="text-white-50 mb-3">
                            Application développée et maintenue par l'association UTT Net Group
                        </p>
                        <div className="d-flex align-items-center">
                            <Image src="/ung_light.png" alt="UNG" width={120} height={60} />
                        </div>
                    </div>

                    {/* Section Liens utiles */}
                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <h5 className="fw-bold mb-3">Liens utiles</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link href="/legals" className="text-white-50 text-decoration-none">
                                    Mentions légales
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/privacy" className="text-white-50 text-decoration-none">
                                    Politique de confidentialité
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section Contact */}
                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <h5 className="fw-bold mb-3">Nous contacter</h5>
                        <p className="text-white-50 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-2" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                            </svg>
                            <a href="mailto:ung@utt.fr" className="text-white-50 text-decoration-none">
                                ung@utt.fr
                            </a>
                        </p>
                        <p className="text-white-50 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone me-2" viewBox="0 0 16 16">
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                            </svg>
                            <a href="tel:+33325718550" className="text-white-50 text-decoration-none">
                                +33 3 25 71 85 50
                            </a>
                        </p>
                    </div>
                </div>

                <hr className="my-4 border-secondary" />

                <div className="text-center text-white-50">
                    <p className="mb-0">© {new Date().getFullYear()} TurboBadges - Tous droits réservés</p>
                </div>
            </div>
        </footer>
    );
}
