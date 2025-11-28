import { Link, createFileRoute } from '@tanstack/react-router'
import { Brain, CheckCircle2, Shield, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/(visiteur)/_guestLayout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="px-4 py-1 text-sm font-medium"
                >
                  <Shield className="w-4 h-4 mr-2 text-emerald-600" />
                  Intelligence Artificielle • Sécurité Bancaire
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Protégez vos transactions avec une{' '}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-600">
                    IA de pointe
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Notre modèle de détection de fraude analyse en temps réel
                  chaque transaction grâce à un algorithme{' '}
                  <strong>Gradient Boosting</strong> entraîné sur des milliers
                  de cas réels.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="text-lg px-8 shadow-lg">
                  <Link to="/auth/login">Se connecter</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                >
                  <Link to="/auth/register">Créer un compte</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span className="text-slate-700">Prédiction instantanée</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span className="text-slate-700">
                    Explication claire des décisions
                  </span>
                </div>
              </div>
            </div>

            {/* Image / Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-tr from-blue-600/20 to-emerald-600/20 rounded-3xl blur-3xl"></div>
              <Card className="relative overflow-hidden border-2 shadow-2xl">
                <div className="bg-linear-to-br from-blue-600 to-emerald-600 p-12 text-white text-center">
                  <Brain className="w-24 h-24 mx-auto mb-6 opacity-90" />
                  <h2 className="text-4xl font-bold mb-4">Gradient Boosting</h2>
                  <p className="text-xl opacity-90">
                    Meilleur modèle sélectionné parmi 7 algorithmes
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-6 text-left">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <div className="text-3xl font-bold">33.3%</div>
                      <div className="text-sm opacity-90">F1-Score</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <div className="text-3xl font-bold">74.8%</div>
                      <div className="text-sm opacity-90">ROC-AUC</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Une protection intelligente, en temps réel
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Notre système analyse chaque détail pour distinguer une
              transaction légitime d’une tentative de fraude.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Détection instantanée
              </h3>
              <p className="text-slate-600">
                Analyse en moins d’une seconde, dès la saisie de la transaction.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-2 border-emerald-600">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Performance maximale
              </h3>
              <p className="text-slate-600">
                Meilleur F1-Score parmi 7 modèles testés (Random Forest, SVM,
                etc.)
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Explications claires
              </h3>
              <p className="text-slate-600">
                Comprenez pourquoi une transaction est jugée risquée.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-linear-to-r from-blue-600 to-emerald-600">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à sécuriser vos transactions ?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Rejoignez les utilisateurs qui font déjà confiance à notre IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-10"
            >
              <Link to="/auth/register">S’inscrire gratuitement</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-10 bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20"
            >
              <Link to="/auth/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-12 bg-slate-900 text-white/70">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <p>
            © 2025 FraudGuard AI • • Protéger l’avenir de la banque digitale
          </p>
        </div>
      </footer>
    </div>
  )
}
