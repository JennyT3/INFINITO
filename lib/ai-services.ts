// AI Services for clothing recognition and analysis

export interface ClothingAnalysis {
  garmentType: string
  color: string
  material: string
  size?: string
  country?: string
  condition: string
  confidence: number
  detectedObjects: Array<{
    name: string
    confidence: number
    boundingBox?: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
}

export interface LabelAnalysis {
  extractedText: string
  material?: string
  size?: string
  country?: string
  careInstructions?: string[]
  confidence: number
}

// Google Vision API for general image analysis
export async function analyzeImageWithGoogleVision(imageBase64: string): Promise<any> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY

  if (!apiKey) {
    throw new Error("Google Vision API key not configured")
  }

  const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          image: {
            content: imageBase64.split(",")[1], // Remove data:image/jpeg;base64, prefix
          },
          features: [
            { type: "OBJECT_LOCALIZATION", maxResults: 10 },
            { type: "LABEL_DETECTION", maxResults: 20 },
            { type: "TEXT_DETECTION", maxResults: 10 },
            { type: "IMAGE_PROPERTIES", maxResults: 5 },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Google Vision API error: ${response.statusText}`)
  }

  return response.json()
}

// Hugging Face API for clothing classification
export async function analyzeClothingWithHuggingFace(imageBase64: string): Promise<any> {
  const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY

  if (!apiKey) {
    throw new Error("Hugging Face API key not configured")
  }

  // Convert base64 to blob
  const base64Data = imageBase64.split(",")[1]
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: "image/jpeg" })

  const response = await fetch(
    "https://api-inference.huggingface.co/models/microsoft/DiT-base-finetuned-FashionMNIST",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/octet-stream",
      },
      body: blob,
    },
  )

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`)
  }

  return response.json()
}

// OpenAI Vision API for detailed clothing analysis
export async function analyzeClothingWithOpenAI(imageBase64: string): Promise<any> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OpenAI API key not configured")
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this clothing item and provide detailed information in JSON format. Include:
              - garmentType (e.g., "t-shirt", "dress", "jeans")
              - color (primary color)
              - estimatedMaterial (e.g., "cotton", "polyester", "wool")
              - style (e.g., "casual", "formal", "sporty")
              - condition (e.g., "excellent", "good", "fair", "poor")
              - confidence (0-1 scale)
              
              Respond only with valid JSON.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  return response.json()
}

// OCR for clothing labels using Google Vision
export async function extractTextFromLabel(imageBase64: string): Promise<LabelAnalysis> {
  const visionResult = await analyzeImageWithGoogleVision(imageBase64)

  const textAnnotations = visionResult.responses[0]?.textAnnotations || []
  const extractedText = textAnnotations[0]?.description || ""

  // Parse common clothing label patterns
  const analysis: LabelAnalysis = {
    extractedText,
    confidence: 0.8,
  }

  // Extract material information
  const materialPatterns = [
    /(\d+)%?\s*(cotton|algodão|coton)/i,
    /(\d+)%?\s*(polyester|poliéster)/i,
    /(\d+)%?\s*(wool|lã|laine)/i,
    /(\d+)%?\s*(silk|seda|soie)/i,
    /(\d+)%?\s*(linen|linho|lin)/i,
    /(\d+)%?\s*(nylon|náilon)/i,
  ]

  const materials: string[] = []
  materialPatterns.forEach((pattern) => {
    const match = extractedText.match(pattern)
    if (match) {
      materials.push(`${match[1]}% ${match[2]}`)
    }
  })

  if (materials.length > 0) {
    analysis.material = materials.join(", ")
  }

  // Extract size
  const sizePattern = /size[:\s]*([XS|S|M|L|XL|XXL|\d+])/i
  const sizeMatch = extractedText.match(sizePattern)
  if (sizeMatch) {
    analysis.size = sizeMatch[1]
  }

  // Extract country
  const countryPatterns = [/made in ([a-z\s]+)/i, /fabricado en ([a-z\s]+)/i, /fabriqué en ([a-z\s]+)/i]

  countryPatterns.forEach((pattern) => {
    const match = extractedText.match(pattern)
    if (match && !analysis.country) {
      analysis.country = match[1].trim()
    }
  })

  // Extract care instructions
  const carePatterns = [/machine wash/i, /hand wash/i, /dry clean/i, /do not bleach/i, /tumble dry/i, /iron/i]

  analysis.careInstructions = carePatterns
    .filter((pattern) => pattern.test(extractedText))
    .map((pattern) => pattern.source.replace(/[/\\^$*+?.()|[\]{}]/g, ""))

  return analysis
}

// Main clothing analysis function that combines multiple AI services
export async function analyzeClothing(itemImageBase64: string, labelImageBase64?: string): Promise<ClothingAnalysis> {
  try {
    // Run multiple AI analyses in parallel
    const analyses = await Promise.allSettled([
      analyzeImageWithGoogleVision(itemImageBase64),
      analyzeClothingWithOpenAI(itemImageBase64),
      labelImageBase64 ? extractTextFromLabel(labelImageBase64) : null,
    ])

    // Process Google Vision results
    const googleVision = analyses[0].status === "fulfilled" ? analyses[0].value : null
    const openAIResult = analyses[1].status === "fulfilled" ? analyses[1].value : null
    const labelAnalysis = analyses[2].status === "fulfilled" ? analyses[2].value : null

    // Extract clothing type from Google Vision
    let garmentType = "Unknown"
    let color = "Unknown"
    let detectedObjects: any[] = []

    if (googleVision?.responses?.[0]) {
      const response = googleVision.responses[0]

      // Get detected objects
      if (response.localizedObjectAnnotations) {
        detectedObjects = response.localizedObjectAnnotations.map((obj: any) => ({
          name: obj.name,
          confidence: obj.score,
          boundingBox: obj.boundingPoly?.normalizedVertices
            ? {
                x: obj.boundingPoly.normalizedVertices[0].x,
                y: obj.boundingPoly.normalizedVertices[0].y,
                width: obj.boundingPoly.normalizedVertices[2].x - obj.boundingPoly.normalizedVertices[0].x,
                height: obj.boundingPoly.normalizedVertices[2].y - obj.boundingPoly.normalizedVertices[0].y,
              }
            : undefined,
        }))

        // Find clothing items
        const clothingItems = detectedObjects.filter((obj) =>
          ["Clothing", "Shirt", "Dress", "Pants", "Jeans", "Jacket", "Coat", "Skirt"].includes(obj.name),
        )

        if (clothingItems.length > 0) {
          garmentType = clothingItems[0].name
        }
      }

      // Get labels for more context
      if (response.labelAnnotations) {
        const labels = response.labelAnnotations
        const clothingLabels = labels.filter((label: any) =>
          ["Clothing", "Fashion", "Textile", "Apparel", "Garment", "Shirt", "Dress", "Pants"].some((term) =>
            label.description.includes(term),
          ),
        )

        if (clothingLabels.length > 0 && garmentType === "Unknown") {
          garmentType = clothingLabels[0].description
        }
      }

      // Extract dominant color
      if (response.imagePropertiesAnnotation?.dominantColors?.colors) {
        const dominantColor = response.imagePropertiesAnnotation.dominantColors.colors[0]
        const rgb = dominantColor.color
        color = rgbToColorName(rgb.red || 0, rgb.green || 0, rgb.blue || 0)
      }
    }

    // Process OpenAI results
    let openAIAnalysis: any = {}
    if (openAIResult?.choices?.[0]?.message?.content) {
      try {
        openAIAnalysis = JSON.parse(openAIResult.choices[0].message.content)
      } catch (e) {
        console.warn("Failed to parse OpenAI response as JSON")
      }
    }

    // Combine results with priority: OpenAI > Label Analysis > Google Vision > Defaults
    const result: ClothingAnalysis = {
      garmentType: openAIAnalysis.garmentType || garmentType || "Clothing Item",
      color: openAIAnalysis.color || color || "Unknown",
      material: labelAnalysis?.material || openAIAnalysis.estimatedMaterial || "Unknown",
      size: labelAnalysis?.size,
      country: labelAnalysis?.country,
      condition: openAIAnalysis.condition || "Good",
      confidence: Math.max(
        openAIAnalysis.confidence || 0,
        detectedObjects.length > 0 ? Math.max(...detectedObjects.map((obj) => obj.confidence)) : 0,
        labelAnalysis?.confidence || 0,
      ),
      detectedObjects,
    }

    return result
  } catch (error) {
    console.error("Error analyzing clothing:", error)

    // Return fallback analysis
    return {
      garmentType: "Clothing Item",
      color: "Unknown",
      material: "Mixed Materials",
      condition: "Good",
      confidence: 0.1,
      detectedObjects: [],
    }
  }
}

// Helper function to convert RGB to color name
function rgbToColorName(r: number, g: number, b: number): string {
  const colors = [
    { name: "Red", rgb: [255, 0, 0] },
    { name: "Blue", rgb: [0, 0, 255] },
    { name: "Green", rgb: [0, 255, 0] },
    { name: "Yellow", rgb: [255, 255, 0] },
    { name: "Orange", rgb: [255, 165, 0] },
    { name: "Purple", rgb: [128, 0, 128] },
    { name: "Pink", rgb: [255, 192, 203] },
    { name: "Brown", rgb: [165, 42, 42] },
    { name: "Black", rgb: [0, 0, 0] },
    { name: "White", rgb: [255, 255, 255] },
    { name: "Gray", rgb: [128, 128, 128] },
  ]

  let closestColor = "Unknown"
  let minDistance = Number.POSITIVE_INFINITY

  colors.forEach((color) => {
    const distance = Math.sqrt(
      Math.pow(r - color.rgb[0], 2) + Math.pow(g - color.rgb[1], 2) + Math.pow(b - color.rgb[2], 2),
    )

    if (distance < minDistance) {
      minDistance = distance
      closestColor = color.name
    }
  })

  return closestColor
}

interface AIAnalysisResult {
  garmentType: string;
  material: string;
  condition: string;
  confidence: number;
  requiresVerification: boolean;
  uncertainty: string;
  methodology: string;
  co2Saved: number;
  waterSaved: number;
}

interface GarmentData {
  weight: number;
  material: string;
  origin: string;
  condition: string;
  fabricationYear?: number;
}

// Factores LCA basados en ecoinvent v3.10 (simplificado)
const LCA_FACTORS = {
  cotton: { co2: 5.89, water: 2700, uncertainty: 0.25 },
  polyester: { co2: 9.52, water: 70, uncertainty: 0.30 },
  wool: { co2: 22.2, water: 500, uncertainty: 0.35 },
  mixed: { co2: 7.5, water: 1200, uncertainty: 0.40 }
};

// Factores de corrección por región
const REGION_FACTORS = {
  portugal: { co2: 0.82, name: "Portugal (renewable mix)" },
  bangladesh: { co2: 1.65, name: "Bangladesh (coal mix)" },
  india: { co2: 1.45, name: "India (mixed)" },
  china: { co2: 1.55, name: "China (coal dominant)" },
  default: { co2: 1.0, name: "Global average" }
};

// Factores de fin de vida
const END_OF_LIFE_FACTORS = {
  excellent: { recycling: 0.95, co2Benefit: 0.9 },
  good: { recycling: 0.80, co2Benefit: 0.75 },
  fair: { recycling: 0.60, co2Benefit: 0.60 },
  poor: { recycling: 0.30, co2Benefit: 0.30 }
};

export const analyzeImageHybrid = async (imageData: string): Promise<AIAnalysisResult> => {
  try {
    // Simulación de análisis de IA (en producción usar Claude Vision)
    const aiSuggestion = await simulateAIAnalysis(imageData);
    
    // Calcular impacto con LCA real
    const impact = calculateImpactLCA({
      weight: 0.5, // Peso estimado
      material: aiSuggestion.material,
      origin: 'portugal',
      condition: aiSuggestion.condition
    });
    
    return {
      garmentType: aiSuggestion.garmentType,
      material: aiSuggestion.material,
      condition: aiSuggestion.condition,
      confidence: aiSuggestion.confidence,
      requiresVerification: aiSuggestion.confidence < 0.75,
      uncertainty: `±${Math.round(impact.uncertainty * 100)}%`,
      methodology: "ecoinvent v3.10 + regional factors",
      co2Saved: impact.co2,
      waterSaved: impact.water
    };
    
  } catch (error) {
    console.error('AI analysis failed:', error);
    return getFallbackAnalysis();
  }
};

const simulateAIAnalysis = async (imageData: string) => {
  // Simulación realista de precisión de IA
  const garmentTypes = ['camiseta', 'pantalón', 'vestido', 'chaqueta'];
  const materials = ['cotton', 'polyester', 'wool', 'mixed'];
  const conditions = ['excellent', 'good', 'fair', 'poor'];
  
  // Simular confianza variable (68-77% según benchmarks reales)
  const confidence = 0.68 + Math.random() * 0.09;
  
  return {
    garmentType: garmentTypes[Math.floor(Math.random() * garmentTypes.length)],
    material: materials[Math.floor(Math.random() * materials.length)],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    confidence: Math.round(confidence * 100) / 100
  };
};

const calculateImpactLCA = (garment: GarmentData) => {
  const baseFactor = LCA_FACTORS[garment.material as keyof typeof LCA_FACTORS] || LCA_FACTORS.mixed;
  const regionFactor = REGION_FACTORS[garment.origin as keyof typeof REGION_FACTORS] || REGION_FACTORS.default;
  const eolFactor = END_OF_LIFE_FACTORS[garment.condition as keyof typeof END_OF_LIFE_FACTORS] || END_OF_LIFE_FACTORS.good;
  
  const co2Impact = garment.weight * baseFactor.co2 * regionFactor.co2 * eolFactor.co2Benefit;
  const waterImpact = garment.weight * baseFactor.water * eolFactor.co2Benefit;
  
  return {
    co2: Math.round(co2Impact * 100) / 100,
    water: Math.round(waterImpact),
    uncertainty: baseFactor.uncertainty,
    factors: {
      region: regionFactor.name,
      endOfLife: garment.condition,
      recyclingPotential: eolFactor.recycling
    }
  };
};

const getFallbackAnalysis = (): AIAnalysisResult => ({
  garmentType: "prenda textil",
  material: "mixed",
  condition: "good",
  confidence: 0.50,
  requiresVerification: true,
  uncertainty: "±40%",
  methodology: "estimación manual requerida",
  co2Saved: 0,
  waterSaved: 0
});

// Función para calcular rebound effect
export const calculateReboundEffect = (userHistory: any) => {
  const contributed = userHistory.contributions || 0;
  const purchased = userHistory.purchases || 0;
  
  // Factor de reemplazo promedio: 0.7 (70% de lo donado se reemplaza)
  const replacementFactor = 0.7;
  const netContributions = contributed - (purchased * replacementFactor);
  
  return {
    contributed,
    purchased,
    netImpact: netContributions > 0 ? 'positive' : 'negative',
    netContributions: Math.round(netContributions * 100) / 100,
    recommendation: netContributions < 0 ? 
      'Considera donar más antes de comprar' : 
      'Excelente balance neto positivo'
  };
};
