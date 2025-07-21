'use client';

import { useState } from 'react';
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

export default function ApplicationAI({ application }: ApplicationAIProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const getProjectScore = () => {
    // Mock scoring based on application data
    let score = 0;
    if (application.projectName) score += 10;
    if (application.description) score += 15;
    if (application.teamMembers?.length > 0) score += 20;
    if (application.category) score += 10;
    if (application.industry) score += 10;
    if (application.opportunityValue) score += 15;
    if (application.problemStatement) score += 20;
    
    return Math.min(score, 100);
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (!application.description || application.description.length < 100) {
      recommendations.push({
        type: 'warning',
        title: 'Descripción del proyecto',
        description: 'Considera expandir la descripción del proyecto para incluir más detalles sobre la solución propuesta.',
        icon: AlertCircle
      });
    }

    if (!application.teamMembers || application.teamMembers.length < 2) {
      recommendations.push({
        type: 'warning',
        title: 'Equipo del proyecto',
        description: 'Se recomienda agregar más miembros al equipo para fortalecer la aplicación.',
        icon: AlertCircle
      });
    }

    if (application.opportunityValue && application.opportunityValue.length > 50) {
      recommendations.push({
        type: 'success',
        title: 'Valor de oportunidad',
        description: 'Excelente definición del valor de oportunidad del proyecto.',
        icon: CheckCircle
      });
    }

    if (application.problemStatement && application.problemStatement.length > 100) {
      recommendations.push({
        type: 'success',
        title: 'Declaración del problema',
        description: 'Buena definición del problema que busca resolver.',
        icon: CheckCircle
      });
    }

    return recommendations;
  };

  const getMarketInsights = () => {
    const insights = [
      {
        title: 'Tendencia del mercado',
        value: 'Creciente',
        description: 'El mercado objetivo muestra tendencias positivas',
        icon: TrendingUp,
        color: 'text-green-600'
      },
      {
        title: 'Competencia',
        value: 'Moderada',
        description: 'Nivel de competencia en el sector',
        icon: Target,
        color: 'text-yellow-600'
      },
      {
        title: 'Potencial de escalabilidad',
        value: 'Alto',
        description: 'Buena capacidad de crecimiento',
        icon: BarChart3,
        color: 'text-blue-600'
      }
    ];

    return insights;
  };

  const projectScore = getProjectScore();
  const recommendations = getRecommendations();
  const marketInsights = getMarketInsights();

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Análisis de IA</h2>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700"
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

      {/* Project Score */}
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
                <span className="text-2xl font-bold text-purple-600">{projectScore}</span>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {projectScore >= 80 ? 'Excelente' : 
                 projectScore >= 60 ? 'Bueno' : 
                 projectScore >= 40 ? 'Regular' : 'Necesita Mejoras'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {projectScore >= 80 ? 'El proyecto tiene un alto potencial' :
                 projectScore >= 60 ? 'El proyecto muestra buenas perspectivas' :
                 projectScore >= 40 ? 'El proyecto requiere más desarrollo' : 'Se recomienda fortalecer varios aspectos'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      {
        /*
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Insights del Mercado</span>
            </CardTitle>
            <CardDescription>
                Análisis de tendencias y oportunidades del mercado
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <insight.icon className={`h-5 w-5 mt-1 ${insight.color}`} />
                    <div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-lg font-bold">{insight.value}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
        */
      }
      

      {/* AI Recommendations */}
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
            {recommendations.map((rec, index) => (
              <Alert key={index} className={rec.type === 'success' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
                <rec.icon className={`h-4 w-4 ${rec.type === 'success' ? 'text-green-600' : 'text-yellow-600'}`} />
                <AlertDescription>
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-sm text-muted-foreground">{rec.description}</div>
                </AlertDescription>
              </Alert>
            ))}
            
            {recommendations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p>¡Excelente! No se encontraron áreas que requieran mejora inmediata.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Status */}
      {analysisComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="font-medium">Análisis completado</div>
            <div className="text-sm text-muted-foreground">
              El análisis de IA se ha completado exitosamente. Los resultados se actualizan en tiempo real.
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
