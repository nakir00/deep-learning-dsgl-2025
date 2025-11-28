// src/routes/(visiteur)/_guestLayout/index.tsx
import { Link, createFileRoute } from '@tanstack/react-router'
import { Beaker, CheckCircle2, Microscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/(visiteur)/_guestLayout/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      {/* Fond subtil */}
      <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-12">
        {/* Badge */}
        <Badge variant="secondary" className="px-5 py-2 text-base font-medium backdrop-blur-sm">
          <Microscope className="w-5 h-5 mr-2" />
          Intelligence Artificielle • Diagnostic du Paludisme
        </Badge>

        {/* Titre principal */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Diagnostiquez le paludisme
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              en une seconde
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Notre IA analyse instantanément les images de frottis sanguins
            avec une précision supérieure à <strong>98,7%</strong>.
            <br />
            Rejoignez les professionnels de santé qui utilisent déjà notre outil.
          </p>
        </div>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Button asChild size="lg" className="text-lg px-10 py-7 bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl">
            <Link to="/auth/register">
              <Beaker className="w-6 h-6 mr-3" />
              S’inscrire gratuitement
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-white/50 text-black hover:text-white hover:bg-white/10 backdrop-blur">
            <Link to="/auth/login">
              Se connecter
            </Link>
          </Button>
        </div>

        {/* Avantages rapides */}
        <div className="flex flex-wrap justify-center gap-10 pt-16 text-gray-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span className="text-lg">Précision 98,7%</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span className="text-lg">Résultat instantané</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span className="text-lg">Interface intuitive</span>
          </div>
        </div>
      </div>

      {/* Footer discret */}
      <footer className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-sm">
        © 2025 MalariaAI • Diagnostic assisté par intelligence artificielle
      </footer>
    </div>
  )
}