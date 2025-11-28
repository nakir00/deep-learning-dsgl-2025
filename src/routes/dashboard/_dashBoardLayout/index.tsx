import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
} from 'lucide-react'
import { useImagePrediction } from '@/hooks/useImagePrediction'
import { cn } from '@/lib/utils'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/_dashBoardLayout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isModelLoaded, predictImage, isPredicting } = useImagePrediction()

  const [dragActive, setDragActive] = useState(false)
  const [result, setResult] = useState<{
    open: boolean
    class: 'parasited' | 'uninfected'
    confidence: number
    filename: string
  } | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Veuillez uploader une image')
      return
    }

    predictImage(
      { image: file, threshold: 0.5 },
      {
        onSuccess: (res) => {
          const prediction = res.data.data
          setResult({
            open: true,
            class: prediction.class,
            confidence: prediction.confidence,
            filename: file.name,
          })
        },
        onError: () => {
          alert('Erreur lors de la prédiction')
        },
      },
    )
  }

  // Traduction Happy/Sad → Parasitized/Uninfected
  /* const getCellType = (cls: 'parasited' | 'uninfected') =>
    cls === 'parasited' ? 'Parasitized' : 'Uninfected' */
  const getColor = (cls: 'parasited' | 'uninfected') =>
    cls ===  'uninfected' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Détection de Paludisme
            </h1>
            <p className="text-lg text-gray-600">
              Glissez une image de cellule sanguine pour analyser
            </p>
            <div className="flex justify-center">
              <Badge
                variant={isModelLoaded ? 'default' : 'destructive'}
                className="mt-2"
              >
                {isModelLoaded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Modèle chargé
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Modèle en chargement...
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center">
              <CardTitle>Upload d'image</CardTitle>
              <CardDescription>
                Glissez-déposez une image ou cliquez pour sélectionner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'relative border-4 border-dashed rounded-xl p-12 transition-all',
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                  'hover:border-blue-400 cursor-pointer',
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isPredicting}
                />

                <div className="text-center space-y-4">
                  {isPredicting ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                      <p className="text-lg font-medium">Analyse en cours...</p>
                      <Progress value={66} className="w-64 mx-auto" />
                    </div>
                  ) : (
                    <>
                      <Upload
                        className={cn(
                          'w-16 h-16 mx-auto',
                          dragActive ? 'text-blue-600' : 'text-gray-400',
                        )}
                      />
                      <div>
                        <p className="text-xl font-semibold">
                          {dragActive
                            ? "Lâchez l'image ici"
                            : 'Glissez une image ici'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          ou cliquez pour parcourir
                        </p>
                      </div>
                      <Button variant="outline" size="lg" className="mt-4">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Sélectionner une image
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert si modèle pas chargé */}
          {!isModelLoaded && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Modèle en cours de chargement</AlertTitle>
              <AlertDescription>
                Le modèle de deep learning est en train de se charger. Cela peut
                prendre quelques secondes.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Dialog du résultat */}
      <Dialog open={result?.open} onOpenChange={() => setResult(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Résultat de l'analyse
            </DialogTitle>
            <DialogDescription>
              Analyse de l'image :{' '}
              <span className="font-mono font-bold">{result?.filename}</span>
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-6 py-4">
              <div
                className={cn(
                  'text-center p-8 rounded-xl',
                  getColor(result.class),
                )}
              >
                <div className="text-6xl font-bold">
                  {result.class !== 'uninfected' ? 'Parasitized' : 'Uninfected'}
                </div>
                <div className="text-2xl mt-2">
                  Confiance :{' '}
                  <span className="font-bold">
                    {result.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 font-medium">
                    Parasitized 
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {result.class === 'parasited'
                      ? result.confidence.toFixed(1)
                      : (100 - result.confidence).toFixed(1)}
                    %
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm text-red-600 font-medium">
                    Uninfected 
                  </div>
                  <div className="text-2xl font-bold text-red-700">
                    {result.class === 'uninfected'
                      ? result.confidence.toFixed(1)
                      : (100 - result.confidence).toFixed(1)}
                    %
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => setResult(null)}
              >
                Fermer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
