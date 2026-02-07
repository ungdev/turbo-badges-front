/**
 * Composant de test pour l'Error Boundary
 * 
 * Ce fichier montre comment tester et utiliser l'Error Boundary.
 * Pour tester, décommentez l'un des exemples ci-dessous.
 */

'use client';

import { ErrorBoundary, useErrorHandler } from './ErrorBoundary';
import { useState } from 'react';

/**
 * Exemple 1 : Erreur de rendu simple
 */
function BuggyCounter() {
    const [counter, setCounter] = useState(0);

    if (counter === 5) {
        // Simule une erreur quand le compteur atteint 5
        throw new Error('Compteur explosé ! 💥');
    }

    return (
        <div className="card">
            <div className="card-body">
                <h3>Compteur : {counter}</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setCounter(counter + 1)}
                >
                    Incrémenter
                </button>
                <p className="text-muted mt-2">
                    Le composant crashera quand le compteur atteint 5
                </p>
            </div>
        </div>
    );
}

/**
 * Exemple 2 : Erreur dans un event handler (nécessite useErrorHandler)
 */
function AsyncBuggyComponent() {
    const throwError = useErrorHandler();
    const [loading, setLoading] = useState(false);

    const handleRiskyOperation = async () => {
        setLoading(true);
        try {
            // Simule une opération async qui échoue
            await new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Erreur asynchrone ! ⚠️')), 1000)
            );
        } catch (error) {
            // Propage l'erreur à l'Error Boundary
            throwError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h3>Test Erreur Async</h3>
                <button
                    className="btn btn-danger"
                    onClick={handleRiskyOperation}
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Déclencher erreur async'}
                </button>
                <p className="text-muted mt-2">
                    Cette erreur async sera capturée par l'Error Boundary
                </p>
            </div>
        </div>
    );
}

/**
 * Exemple 3 : Composant qui crash de manière aléatoire
 */
function RandomBuggyComponent() {
    const random = Math.random();

    if (random < 0.3) {
        throw new Error('Malchance ! Le composant a crashé aléatoirement 🎲');
    }

    return (
        <div className="alert alert-success">
            Chanceux ! Le composant a bien chargé (30% de chance d'échec)
        </div>
    );
}

/**
 * Exemple 4 : Error Boundary avec fallback personnalisé
 */
function CustomFallback() {
    return (
        <div className="alert alert-warning border border-warning">
            <h4 className="alert-heading">⚠️ Module temporairement indisponible</h4>
            <p>
                Cette section rencontre un problème technique. Nos équipes sont
                notifiées et travaillent à la résolution.
            </p>
            <hr />
            <p className="mb-0">
                Vous pouvez continuer à utiliser le reste de l'application.
            </p>
        </div>
    );
}

/**
 * Page de test des Error Boundaries
 * 
 * Pour tester, créez une route /test-error dans votre app et utilisez ce composant
 */
export default function ErrorBoundaryTestPage() {
    const [showBuggy, setShowBuggy] = useState(false);
    const [showAsync, setShowAsync] = useState(false);
    const [showRandom, setShowRandom] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    return (
        <div className="container py-5">
            <h1 className="mb-4">Test Error Boundaries</h1>
            <p className="lead mb-5">
                Ces exemples démontrent comment les Error Boundaries protègent votre
                application des crashes.
            </p>

            <div className="row g-4">
                {/* Test 1 : Erreur de rendu */}
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Test 1 : Erreur de rendu</h5>
                        </div>
                        <div className="card-body">
                            <button
                                className="btn btn-outline-primary mb-3"
                                onClick={() => setShowBuggy(!showBuggy)}
                            >
                                {showBuggy ? 'Masquer' : 'Afficher'} le compteur bugué
                            </button>

                            {showBuggy && (
                                <ErrorBoundary key={resetKey}>
                                    <BuggyCounter />
                                </ErrorBoundary>
                            )}
                        </div>
                    </div>
                </div>

                {/* Test 2 : Erreur async */}
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0">Test 2 : Erreur asynchrone</h5>
                        </div>
                        <div className="card-body">
                            <button
                                className="btn btn-outline-danger mb-3"
                                onClick={() => setShowAsync(!showAsync)}
                            >
                                {showAsync ? 'Masquer' : 'Afficher'} le test async
                            </button>

                            {showAsync && (
                                <ErrorBoundary key={resetKey}>
                                    <AsyncBuggyComponent />
                                </ErrorBoundary>
                            )}
                        </div>
                    </div>
                </div>

                {/* Test 3 : Erreur aléatoire */}
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">Test 3 : Erreur aléatoire</h5>
                        </div>
                        <div className="card-body">
                            <button
                                className="btn btn-outline-warning mb-3"
                                onClick={() => setShowRandom(!showRandom)}
                            >
                                {showRandom ? 'Masquer' : 'Afficher'} le test aléatoire
                            </button>

                            {showRandom && (
                                <ErrorBoundary key={resetKey}>
                                    <RandomBuggyComponent />
                                </ErrorBoundary>
                            )}

                            <button
                                className="btn btn-sm btn-secondary mt-2"
                                onClick={() => setResetKey(resetKey + 1)}
                            >
                                Réinitialiser (retry)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Test 4 : Fallback personnalisé */}
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">Test 4 : Fallback personnalisé</h5>
                        </div>
                        <div className="card-body">
                            <ErrorBoundary fallback={<CustomFallback />}>
                                <BuggyCounter />
                            </ErrorBoundary>
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert alert-info mt-5">
                <h4 className="alert-heading">💡 Note</h4>
                <p>
                    Les Error Boundaries empêchent l'application entière de crasher.
                    Chaque section est isolée et peut être réinitialisée indépendamment.
                </p>
                <hr />
                <p className="mb-0">
                    En développement, vous verrez les détails de l'erreur. En production,
                    seul un message user-friendly sera affiché.
                </p>
            </div>
        </div>
    );
}

/**
 * Pour utiliser cette page de test :
 * 
 * 1. Créez `app/test-error/page.tsx`
 * 2. Importez et exportez ce composant :
 * 
 * ```tsx
 * import ErrorBoundaryTestPage from '@/app/providers/ErrorBoundary.test';
 * export default ErrorBoundaryTestPage;
 * ```
 * 
 * 3. Visitez http://localhost:3000/test-error
 */
