'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  BarChart3, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ApplicationAIProps {
  application: any;
}

interface AIResult {
  evaluacion: {
    puntuacion: number;
    clasificacion: string;
    justificacion: string;
  };
  recomendaciones: Array<{
    titulo: string;
    mensaje: string;
  }>;
}

export default function ApplicationAI({ application }: ApplicationAIProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isCompleted = useMemo(() => {
    return application.isCompleted;
  }, [application]);

  const handleAnalyze = async () => {
    if (!isCompleted) return;
    setIsAnalyzing(true);
    setError(null);
    setAiResult(null);
    try {
      const res = await fetch(`/api/applications/${application.id}/ai`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.ai) {
        throw new Error(data.error || 'No se pudo obtener el análisis de IA');
      }
      // Try to parse JSON from OpenAI response
      let parsed: AIResult | null = null;
      try {
        parsed = typeof data.ai === 'string' ? JSON.parse(data.ai) : data.ai;
      } catch (e) {
        setError('La respuesta de IA no tiene el formato esperado.');
        setAiResult(null);
        setIsAnalyzing(false);
        return;
      }
      setAiResult(parsed);
    } catch (err: any) {
      setError(err.message || 'Error al analizar con IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Análisis de IA</h2>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="font-medium">Error</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </AlertDescription>
        </Alert>
      )}

      {/* Not completed warning */}
      {!isCompleted && (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
          <p className='text-base'>Debes completar todos los pasos de la aplicación antes de solicitar el análisis de IA.</p>
          <Button 
            disabled
            className="bg-purple-300 cursor-not-allowed m-4"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Analizar Proyecto
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 animate-spin text-purple-600" />
          <span className="text-muted-foreground">Analizando proyecto con IA...</span>
        </div>
      )}

      {/* Empty State */}
      {isCompleted && !error && !aiResult && !isAnalyzing && (
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-400" />
          <p className='text-base'>Haz clic en <span className="font-semibold">"Analizar Proyecto"</span> para obtener un análisis inteligente de esta aplicación.</p>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !isCompleted}
            className="bg-purple-600 hover:bg-purple-700 m-4"
          >
            {isAnalyzing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analizar Proyecto
              </>
            )}
          </Button>
        </div>
      )}

      {/* Project Score (AI) */}
      {aiResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-lg">Puntuación del Proyecto</span>
            </CardTitle>
            <CardDescription>
              Evaluación automática basada en la información proporcionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">{aiResult.evaluacion.puntuacion}</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {aiResult.evaluacion.clasificacion}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {aiResult.evaluacion.justificacion}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {aiResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span className="text-lg">Recomendaciones de IA</span>
            </CardTitle>
            <CardDescription>
              Sugerencias para mejorar la aplicación basadas en análisis automático
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiResult.recomendaciones && aiResult.recomendaciones.length > 0 ? (
                aiResult.recomendaciones.map((rec, index) => (
                  <Alert key={index} className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>
                      <div className="font-medium">{rec.titulo}</div>
                      <div className="text-sm text-muted-foreground">{rec.mensaje}</div>
                    </AlertDescription>
                  </Alert>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p>¡Excelente! No se encontraron áreas que requieran mejora inmediata.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
