"use client"

import { useState, useRef } from "react"
import { Camera, Upload, CheckCircle, Sparkles, AlertCircle, Loader2, Eye, Zap } from "lucide-react"
import { analyzeClothing, type ClothingAnalysis } from "../lib/ai-services"

interface AIPhotoCaptureProps {
  userAction: "contribute" | "sell"
  onAnalysisComplete: (analysis: ClothingAnalysis) => void
  onBack: () => void
}

export default function AIPhotoCapture({ userAction, onAnalysisComplete, onBack }: AIPhotoCaptureProps) {
  const [itemPhoto, setItemPhoto] = useState<string | null>(null)
  const [labelPhoto, setLabelPhoto] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ClothingAnalysis | null>(null)

  const itemInputRef = useRef<HTMLInputElement>(null)
  const labelInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (type: "item" | "label") => {
    const input = type === "item" ? itemInputRef.current : labelInputRef.current
    if (input) {
      input.click()
    }
  }

  const processFile = (file: File, type: "item" | "label") => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (type === "item") {
        setItemPhoto(result)
      } else {
        setLabelPhoto(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const startAnalysis = async () => {
    if (!itemPhoto) {
      setError("Por favor, adicione uma foto da prenda primeiro")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisStep("Iniciando análise com IA...")

    try {
      // Step 1: Google Vision Analysis
      setAnalysisStep("🔍 Detectando objetos com Google Vision...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 2: OpenAI Vision Analysis
      setAnalysisStep("🧠 Analisando detalhes com OpenAI Vision...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Step 3: Label OCR (if available)
      if (labelPhoto) {
        setAnalysisStep("📝 Extraindo texto da etiqueta...")
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Step 4: Combining results
      setAnalysisStep("⚡ Combinando resultados de múltiplas IAs...")

      const result = await analyzeClothing(itemPhoto, labelPhoto || undefined)

      setAnalysisStep("✅ Análise concluída!")
      setAnalysis(result)

      // Auto-proceed after showing results
      setTimeout(() => {
        onAnalysisComplete(result)
      }, 2000)
    } catch (err) {
      console.error("Analysis error:", err)
      setError(err instanceof Error ? err.message : "Erro na análise. Tente novamente.")
      setAnalysisStep("")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-lg overflow-hidden mt-8">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white flex items-center">
          <button onClick={onBack} className="mr-3 text-xl">
            ←
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-bold">IA: Análise Avançada</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {userAction === "contribute" ? "Análise para Contribuição" : "Análise para Venda"}
            </h3>
            <p className="text-gray-600 text-sm">Múltiplas IAs analisarão sua prenda para máxima precisão</p>
          </div>

          {/* API Status Indicators */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-bold text-blue-800 mb-2">Serviços de IA Disponíveis:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Google Vision API - Detecção de objetos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>OpenAI GPT-4 Vision - Análise detalhada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>OCR Avançado - Leitura de etiquetas</span>
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">1. Foto da prenda completa</h4>
            <div
              onClick={() => handlePhotoUpload("item")}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-green-500 transition-colors"
            >
              {itemPhoto ? (
                <div className="text-center">
                  <img
                    src={itemPhoto || "/placeholder.svg"}
                    alt="Prenda"
                    className="w-24 h-24 object-cover mx-auto rounded-lg mb-3"
                  />
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                  <p className="text-green-600 text-sm font-medium">Foto carregada</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">Toque para capturar</p>
                  <p className="text-xs text-gray-500 mt-1">Recomendado: fundo neutro, boa iluminação</p>
                </div>
              )}
            </div>
            <input
              ref={itemInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) processFile(file, "item")
              }}
            />
          </div>

          {/* Label Photo Section */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">2. Foto da etiqueta (opcional, mas recomendado)</h4>
            <div
              onClick={() => handlePhotoUpload("label")}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-500 transition-colors"
            >
              {labelPhoto ? (
                <div className="text-center">
                  <img
                    src={labelPhoto || "/placeholder.svg"}
                    alt="Etiqueta"
                    className="w-24 h-24 object-cover mx-auto rounded-lg mb-3"
                  />
                  <CheckCircle className="w-6 h-6 text-blue-500 mx-auto" />
                  <p className="text-blue-600 text-sm font-medium">Etiqueta carregada</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">Etiqueta com composição</p>
                  					<p className="text-xs text-gray-500 mt-1">For accurate material and origin analysis</p>
                </div>
              )}
            </div>
            <input
              ref={labelInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) processFile(file, "label")
              }}
            />
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                <h4 className="font-bold text-purple-800">Análise em Progresso</h4>
              </div>
              <p className="text-purple-700 text-sm mb-3">{analysisStep}</p>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: isAnalyzing ? "75%" : "0%" }}
                ></div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && !isAnalyzing && (
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Análise Completa (Confiança: {Math.round(analysis.confidence * 100)}%)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <strong>Tipo:</strong> {analysis.garmentType}
                </div>
                <div>
                  <strong>Cor:</strong> {analysis.color}
                </div>
                <div>
                  <strong>Material:</strong> {analysis.material}
                </div>
                <div>
                  <strong>Condição:</strong> {analysis.condition}
                </div>
                {analysis.size && (
                  <div>
                    <strong>Tamanho:</strong> {analysis.size}
                  </div>
                )}
                {analysis.country && (
                  <div>
                    							<strong>Origin:</strong> {analysis.country}
                  </div>
                )}
              </div>

              {analysis.detectedObjects.length > 0 && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Objetos Detectados:</p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.detectedObjects.slice(0, 3).map((obj, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {obj.name} ({Math.round(obj.confidence * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-green-600 text-sm text-center font-medium">
                ✅ Redirecionando para cálculo de impacto...
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Erro na Análise</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button onClick={() => setError(null)} className="text-red-600 text-sm underline mt-1">
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          {itemPhoto && !isAnalyzing && !analysis && (
            <button
              onClick={startAnalysis}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🚀 Iniciar Análise com IA
            </button>
          )}

          {/* Tips */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Dicas para melhor análise:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Use boa iluminação natural</li>
              <li>• Coloque a prenda em fundo neutro</li>
              <li>• Certifique-se que a etiqueta está legível</li>
              <li>• Evite sombras e reflexos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
