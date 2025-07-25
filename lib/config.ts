// Configuration for AI services
export const AI_CONFIG = {
  // Google Vision API
  googleVision: {
    enabled: !!process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY,
    endpoint: "https://vision.googleapis.com/v1/images:annotate",
  },

  // OpenAI API
  openai: {
    enabled: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    model: "gpt-4o",
  },

  // Hugging Face API
  huggingFace: {
    enabled: !!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
    apiKey: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
    models: {
      fashion: "microsoft/DiT-base-finetuned-FashionMNIST",
      clothing: "Salesforce/blip-image-captioning-base",
    },
  },

  // Fallback mode when APIs are not available
  fallback: {
    enabled: true,
    simulateDelay: 2000,
  },
}

// Check which AI services are available
export function getAvailableServices() {
  return {
    googleVision: AI_CONFIG.googleVision.enabled,
    openai: AI_CONFIG.openai.enabled,
    huggingFace: AI_CONFIG.huggingFace.enabled,
    hasAnyService: AI_CONFIG.googleVision.enabled || AI_CONFIG.openai.enabled || AI_CONFIG.huggingFace.enabled,
  }
}
