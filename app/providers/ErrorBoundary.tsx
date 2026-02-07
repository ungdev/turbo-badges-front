'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { logger } from '@/lib/logger';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary - Attrape les erreurs React et affiche une interface de secours
 * 
 * @example
 * <ErrorBoundary>
 *   <MonComposant />
 * </ErrorBoundary>
 * 
 * @example
 * // Avec fallback personnalisé
 * <ErrorBoundary fallback={<MonErreurPersonnalisee />}>
 *   <MonComposant />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Met à jour l'état pour afficher l'interface de secours au prochain rendu
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log l'erreur avec le logger centralisé
        logger.error('Error Boundary a attrapé une erreur', error, {
            context: 'ErrorBoundary',
            metadata: {
                componentStack: errorInfo.componentStack,
            },
        });

        // Met à jour l'état avec les infos d'erreur
        this.setState({
            errorInfo,
        });

        // Callback personnalisé si fourni
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // En production, on pourrait envoyer à un service de monitoring
        // sendErrorToMonitoring(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Utilise le fallback personnalisé si fourni
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Sinon, affiche l'interface de secours par défaut
            return (
                <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <div className="card shadow-sm">
                                    <div className="card-body text-center p-5">
                                        <div className="mb-4">
                                            <svg
                                                className="text-danger"
                                                width="64"
                                                height="64"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                            </svg>
                                        </div>

                                        <h2 className="h4 mb-3 text-dark">Une erreur est survenue</h2>

                                        <p className="text-muted mb-4">
                                            Désolé, quelque chose s'est mal passé. L'erreur a été enregistrée et nous allons la corriger.
                                        </p>

                                        {process.env.NODE_ENV === 'development' && this.state.error && (
                                            <div className="alert alert-danger text-start mb-4">
                                                <p className="fw-bold mb-2">Détails de l'erreur (développement) :</p>
                                                <pre className="mb-0 text-start" style={{ fontSize: '0.85rem' }}>
                                                    {this.state.error.toString()}
                                                </pre>
                                                {this.state.errorInfo && (
                                                    <details className="mt-2">
                                                        <summary className="cursor-pointer">Stack trace</summary>
                                                        <pre className="mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                                                            {this.state.errorInfo.componentStack}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                        )}

                                        <div className="d-grid gap-2">
                                            <button
                                                onClick={this.handleReset}
                                                className="btn btn-primary"
                                            >
                                                Réessayer
                                            </button>
                                            <a
                                                href="/"
                                                className="btn btn-outline-secondary"
                                            >
                                                Retour à l'accueil
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook pour déclencher manuellement l'Error Boundary
 * Utile pour les erreurs dans les event handlers ou code async
 * 
 * @example
 * const throwError = useErrorHandler();
 * 
 * const handleClick = () => {
 *   try {
 *     // code dangereux
 *   } catch (error) {
 *     throwError(error);
 *   }
 * };
 */
export function useErrorHandler() {
    const [, setError] = React.useState();

    return React.useCallback((error: Error) => {
        setError(() => {
            throw error;
        });
    }, []);
}
