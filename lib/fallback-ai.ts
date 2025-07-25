import type { ClothingAnalysis } from "./ai-services"

// Fallback AI analysis when real APIs are not available
export async function fallbackClothingAnalysis(
  itemImageBase64: string,
  labelImageBase64?: string,
): Promise<ClothingAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate realistic but simulated results
  const garmentTypes = ["T-shirt", "Dress", "Jeans", "Jacket", "Sweater", "Blouse", "Pants", "Skirt"]
  const colors = ["Blue", "Red", "Green", "Black", "White", "Gray", "Pink", "Yellow", "Purple", "Brown"]
  const materials = ["Cotton 100%", "Polyester 65%, Cotton 35%", "Wool 80%, Acrylic 20%", "Cotton 95%, Elastane 5%"]
  const sizes = ["XS", "S", "M", "L", "XL"]
  const countries = ["China", "Bangladesh", "Turkey", "Vietnam", "India", "Portugal", "Spain"]
  const conditions = ["Excellent", "Very Good", "Good", "Fair"]

  // Simple image analysis based on file size and characteristics
  const imageSize = itemImageBase64.length
  const hasLabel = !!labelImageBase64

  // Generate pseudo-random but consistent results based on image data
  const seed = imageSize % 1000

  const result: ClothingAnalysis = {
    garmentType: garmentTypes[seed % garmentTypes.length],
    color: colors[seed % colors.length],
    material: materials[seed % materials.length],
    size: hasLabel ? sizes[seed % sizes.length] : undefined,
    country: hasLabel ? countries[seed % countries.length] : undefined,
    condition: conditions[seed % conditions.length],
    confidence: hasLabel ? 0.85 : 0.72,
    detectedObjects: [
      {
        name: "Clothing",
        confidence: 0.95,
      },
      {
        name: garmentTypes[seed % garmentTypes.length],
        confidence: 0.88,
      },
    ],
  }

  return result
}
