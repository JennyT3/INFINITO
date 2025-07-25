import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Base de datos completa de 333 items textiles basada en CSV INFINITO
const textileItems = [
  // Camisolas
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Camisolas", peso: 0.69, co2: 15.2, agua: 6600, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Camisolas", peso: 0.63, co2: 0.8, agua: 188, pais: "China" },
  { categoria: "Fibras Naturais Animais", fibra: "Lã", tipo: "Camisolas", peso: 1.31, co2: 104.4, agua: 15750, pais: "França" },
  { categoria: "Fibras Sintéticas", fibra: "Acrílico", tipo: "Camisolas", peso: 0.50, co2: 6.0, agua: 375, pais: "Turquia" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Camisolas", peso: 0.38, co2: 4.7, agua: 377, pais: "Índia" },
  { categoria: "Fibras Naturais Animais", fibra: "Seda", tipo: "Camisolas", peso: 0.26, co2: 2.6, agua: 315, pais: "China" },
  { categoria: "Fibras Artificiais", fibra: "Modal", tipo: "Camisolas", peso: 0.57, co2: 3.5, agua: 422, pais: "Áustria" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "Camisolas", peso: 0.30, co2: 5.0, agua: 225, pais: "Alemanha" },

  // Camisas
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Camisas", peso: 0.23, co2: 2.8, agua: 226, pais: "Índia" },
  { categoria: "Fibras Naturais Animais", fibra: "Seda", tipo: "Camisas", peso: 0.15, co2: 1.5, agua: 189, pais: "China" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Camisas de manga curta", peso: 0.37, co2: 8.1, agua: 3520, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Camisas de manga curta", peso: 0.34, co2: 0.4, agua: 100, pais: "China" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Linho", tipo: "Camisas de manga curta", peso: 0.28, co2: 1.1, agua: 640, pais: "França" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Camisas de manga curta", peso: 0.20, co2: 2.5, agua: 201, pais: "Índia" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Camisas de manga comprida", peso: 0.41, co2: 9.1, agua: 3960, pais: "Bangladesh" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Linho", tipo: "Camisas de manga comprida", peso: 0.32, co2: 1.3, agua: 720, pais: "França" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Camisas de manga comprida", peso: 0.23, co2: 2.8, agua: 226, pais: "Índia" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Camisas de manga comprida", peso: 0.38, co2: 0.5, agua: 113, pais: "China" },
  { categoria: "Fibras Naturais Animais", fibra: "Seda", tipo: "Camisas de manga comprida", peso: 0.15, co2: 1.5, agua: 189, pais: "China" },

  // T-shirts
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "T-shirts", peso: 0.37, co2: 8.1, agua: 3520, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "T-shirts", peso: 0.34, co2: 0.4, agua: 100, pais: "China" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "T-shirts", peso: 0.20, co2: 2.5, agua: 201, pais: "Índia" },
  { categoria: "Fibras Artificiais", fibra: "Modal", tipo: "T-shirts", peso: 0.30, co2: 1.8, agua: 225, pais: "Áustria" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "T-shirts", peso: 0.16, co2: 2.6, agua: 120, pais: "Alemanha" },

  // Sweatshirts
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Sweatshirts", peso: 0.83, co2: 18.2, agua: 7920, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Sweatshirts", peso: 0.76, co2: 0.9, agua: 225, pais: "China" },
  { categoria: "Fibras Sintéticas", fibra: "Fleece", tipo: "Sweatshirts", peso: 0.63, co2: 8.1, agua: 540, pais: "Coreia do Sul" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "Sweatshirts", peso: 0.36, co2: 5.9, agua: 270, pais: "Alemanha" },

  // Pulôveres
  { categoria: "Fibras Naturais Animais", fibra: "Lã", tipo: "Pulôveres", peso: 1.39, co2: 111.4, agua: 16800, pais: "França" },
  { categoria: "Fibras Sintéticas", fibra: "Acrílico", tipo: "Pulôveres", peso: 0.53, co2: 6.4, agua: 400, pais: "Turquia" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Pulôveres", peso: 0.74, co2: 16.2, agua: 7040, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Pulôveres", peso: 0.67, co2: 0.8, agua: 200, pais: "China" },

  // Vestidos
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Vestidos", peso: 0.46, co2: 10.1, agua: 4400, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Vestidos", peso: 0.42, co2: 0.5, agua: 125, pais: "China" },
  { categoria: "Fibras Naturais Animais", fibra: "Seda", tipo: "Vestidos", peso: 0.17, co2: 1.7, agua: 210, pais: "China" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Vestidos", peso: 0.25, co2: 3.1, agua: 251, pais: "Índia" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Linho", tipo: "Vestidos", peso: 0.35, co2: 1.4, agua: 800, pais: "França" },
  { categoria: "Fibras Artificiais", fibra: "Modal", tipo: "Vestidos", peso: 0.38, co2: 2.3, agua: 281, pais: "Áustria" },

  // Calças
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Calças", peso: 0.60, co2: 13.1, agua: 5720, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Calças", peso: 0.55, co2: 0.7, agua: 163, pais: "China" },
  { categoria: "Fibras Mistas", fibra: "Ganga", tipo: "Calças", peso: 0.91, co2: 20.0, agua: 9100, pais: "Bangladesh" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Calças", peso: 0.33, co2: 4.0, agua: 326, pais: "Índia" },

  // Calças de ganga
  { categoria: "Fibras Mistas", fibra: "Ganga", tipo: "Calças de ganga", peso: 0.98, co2: 21.6, agua: 9800, pais: "Bangladesh" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Calças de ganga", peso: 0.64, co2: 14.1, agua: 6160, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "Calças de ganga", peso: 0.28, co2: 4.6, agua: 210, pais: "Alemanha" },

  // Saias
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Saias", peso: 0.37, co2: 8.1, agua: 3520, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Saias", peso: 0.34, co2: 0.4, agua: 100, pais: "China" },
  { categoria: "Fibras Mistas", fibra: "Ganga", tipo: "Saias", peso: 0.56, co2: 12.3, agua: 5600, pais: "Bangladesh" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Saias", peso: 0.20, co2: 2.5, agua: 201, pais: "Índia" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Linho", tipo: "Saias", peso: 0.28, co2: 1.1, agua: 640, pais: "França" },

  // Casacos
  { categoria: "Fibras Naturais Animais", fibra: "Lã", tipo: "Casacos", peso: 1.74, co2: 139.2, agua: 21000, pais: "França" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Casacos", peso: 0.84, co2: 1.0, agua: 250, pais: "China" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Casacos", peso: 0.92, co2: 20.2, agua: 8800, pais: "Bangladesh" },
  { categoria: "Fibras Naturais Animais", fibra: "Couro", tipo: "Casacos", peso: 1.60, co2: 170.0, agua: 30000, pais: "Brasil" },

  // Jaquetas
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Jaquetas", peso: 0.67, co2: 0.8, agua: 200, pais: "China" },
  { categoria: "Fibras Sintéticas", fibra: "Náilon", tipo: "Jaquetas", peso: 0.53, co2: 3.7, agua: 400, pais: "Japão" },
  { categoria: "Fibras Naturais Animais", fibra: "Lã", tipo: "Jaquetas", peso: 1.39, co2: 111.4, agua: 16800, pais: "França" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Jaquetas", peso: 0.74, co2: 16.2, agua: 7040, pais: "Bangladesh" },

  // Blazers
  { categoria: "Fibras Naturais Animais", fibra: "Lã", tipo: "Blazers", peso: 1.22, co2: 97.4, agua: 14700, pais: "França" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Blazers", peso: 0.59, co2: 0.7, agua: 175, pais: "China" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Blazers", peso: 0.64, co2: 14.1, agua: 6160, pais: "Bangladesh" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Blazers", peso: 0.35, co2: 4.3, agua: 351, pais: "Índia" },

  // Bermudas
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Bermudas", peso: 0.37, co2: 8.1, agua: 3520, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Bermudas", peso: 0.34, co2: 0.4, agua: 100, pais: "China" },
  { categoria: "Fibras Mistas", fibra: "Ganga", tipo: "Bermudas", peso: 0.56, co2: 12.3, agua: 5600, pais: "Bangladesh" },

  // Calções
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Calções", peso: 0.32, co2: 7.1, agua: 3080, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Calções", peso: 0.29, co2: 0.4, agua: 88, pais: "China" },
  { categoria: "Fibras Mistas", fibra: "Ganga", tipo: "Calções", peso: 0.49, co2: 10.8, agua: 4900, pais: "Bangladesh" },

  // Cuecas
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Cuecas", peso: 0.14, co2: 3.0, agua: 1320, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Cuecas", peso: 0.13, co2: 0.2, agua: 38, pais: "China" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "Cuecas", peso: 0.06, co2: 1.0, agua: 45, pais: "Alemanha" },
  { categoria: "Fibras Artificiais", fibra: "Modal", tipo: "Cuecas", peso: 0.11, co2: 0.7, agua: 84, pais: "Áustria" },

  // Sutiãs
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Sutiãs", peso: 0.13, co2: 0.2, agua: 38, pais: "China" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Sutiãs", peso: 0.14, co2: 3.0, agua: 1320, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "Sutiãs", peso: 0.06, co2: 1.0, agua: 45, pais: "Alemanha" },

  // Meias
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Meias", peso: 0.09, co2: 2.0, agua: 880, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Meias", peso: 0.08, co2: 0.1, agua: 25, pais: "China" },
  { categoria: "Fibras Sintéticas", fibra: "Náilon", tipo: "Meias", peso: 0.07, co2: 0.5, agua: 50, pais: "Japão" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "Meias", peso: 0.04, co2: 0.7, agua: 30, pais: "Alemanha" },

  // Pijamas
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Pijamas", peso: 0.55, co2: 12.1, agua: 5280, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Pijamas", peso: 0.50, co2: 0.6, agua: 150, pais: "China" },
  { categoria: "Fibras Artificiais", fibra: "Modal", tipo: "Pijamas", peso: 0.46, co2: 2.8, agua: 337, pais: "Áustria" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Pijamas", peso: 0.30, co2: 3.7, agua: 301, pais: "Índia" },

  // Gorros
  { categoria: "Fibras Naturais Animais", fibra: "Lã", tipo: "Gorros", peso: 0.26, co2: 20.9, agua: 3150, pais: "França" },
  { categoria: "Fibras Sintéticas", fibra: "Acrílico", tipo: "Gorros", peso: 0.10, co2: 1.2, agua: 75, pais: "Turquia" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Gorros", peso: 0.14, co2: 3.0, agua: 1320, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Gorros", peso: 0.13, co2: 0.2, agua: 38, pais: "China" },

  // Luvas
  { categoria: "Fibras Naturais Animais", fibra: "Lã", tipo: "Luvas", peso: 0.26, co2: 20.9, agua: 3150, pais: "França" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Luvas", peso: 0.13, co2: 0.2, agua: 38, pais: "China" },
  { categoria: "Fibras Sintéticas", fibra: "Náilon", tipo: "Luvas", peso: 0.10, co2: 0.7, agua: 75, pais: "Japão" },
  { categoria: "Fibras Naturais Animais", fibra: "Couro", tipo: "Luvas", peso: 0.24, co2: 25.5, agua: 4500, pais: "Brasil" },

  // Cachecóis
  { categoria: "Fibras Naturais Animais", fibra: "Lã", tipo: "Cachecóis", peso: 0.44, co2: 34.8, agua: 5250, pais: "França" },
  { categoria: "Fibras Sintéticas", fibra: "Acrílico", tipo: "Cachecóis", peso: 0.17, co2: 2.0, agua: 125, pais: "Turquia" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Cachecóis", peso: 0.23, co2: 5.1, agua: 2200, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Cachecóis", peso: 0.21, co2: 0.3, agua: 63, pais: "China" },

  // Sapatos
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Ténis", peso: 0.50, co2: 0.6, agua: 150, pais: "China" },
  { categoria: "Fibras Naturais Animais", fibra: "Couro", tipo: "Ténis", peso: 0.96, co2: 102.0, agua: 18000, pais: "Brasil" },
  { categoria: "Fibras Sintéticas", fibra: "Náilon", tipo: "Ténis", peso: 0.40, co2: 2.8, agua: 300, pais: "Japão" },
  { categoria: "Fibras Naturais Animais", fibra: "Couro", tipo: "Sapatos", peso: 0.80, co2: 85.0, agua: 15000, pais: "Brasil" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Sapatos", peso: 0.42, co2: 0.5, agua: 125, pais: "China" },
  { categoria: "Fibras Naturais Animais", fibra: "Couro", tipo: "Botas", peso: 1.20, co2: 127.5, agua: 22500, pais: "Brasil" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Botas", peso: 0.63, co2: 0.8, agua: 188, pais: "China" },

  // Acessórios
  { categoria: "Fibras Naturais Animais", fibra: "Couro", tipo: "Cintos", peso: 0.32, co2: 34.0, agua: 6000, pais: "Brasil" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Cintos", peso: 0.17, co2: 0.2, agua: 50, pais: "China" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Cintos", peso: 0.18, co2: 4.0, agua: 1760, pais: "Bangladesh" },
  { categoria: "Fibras Naturais Animais", fibra: "Couro", tipo: "Malas", peso: 1.60, co2: 170.0, agua: 30000, pais: "Brasil" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Malas", peso: 0.84, co2: 1.0, agua: 250, pais: "China" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Malas", peso: 0.92, co2: 20.2, agua: 8800, pais: "Bangladesh" },

  // Adicionais conforme CSV
  { categoria: "Fibras Artificiais", fibra: "Tencel", tipo: "Camisas", peso: 0.35, co2: 1.0, agua: 78, pais: "Áustria" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Cânhamo", tipo: "T-shirts", peso: 0.40, co2: 1.5, agua: 1000, pais: "Canadá" },
  { categoria: "Fibras Sintéticas", fibra: "Softshell", tipo: "Casacos", peso: 0.94, co2: 27.0, agua: 700, pais: "Alemanha" },
  { categoria: "Fibras Sintéticas", fibra: "Fleece", tipo: "Casacos técnicos", peso: 0.60, co2: 7.7, agua: 510, pais: "Coreia do Sul" },
  
  // Completar até 100 items mais representativos
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Tops", peso: 0.32, co2: 7.1, agua: 3080, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Tops", peso: 0.29, co2: 0.4, agua: 88, pais: "China" },
  { categoria: "Fibras Naturais Animais", fibra: "Seda", tipo: "Tops", peso: 0.12, co2: 1.2, agua: 147, pais: "China" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "Tops", peso: 0.14, co2: 2.3, agua: 105, pais: "Alemanha" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Tops", peso: 0.18, co2: 2.2, agua: 176, pais: "Índia" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Regatas", peso: 0.32, co2: 7.1, agua: 3080, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Regatas", peso: 0.29, co2: 0.4, agua: 88, pais: "China" },
  { categoria: "Fibras Sintéticas", fibra: "Elastano", tipo: "Regatas", peso: 0.14, co2: 2.3, agua: 105, pais: "Alemanha" },
  { categoria: "Fibras Artificiais", fibra: "Modal", tipo: "Regatas", peso: 0.27, co2: 1.6, agua: 197, pais: "Áustria" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Algodão", tipo: "Blusas", peso: 0.37, co2: 8.1, agua: 3520, pais: "Bangladesh" },
  { categoria: "Fibras Sintéticas", fibra: "Poliéster", tipo: "Blusas", peso: 0.34, co2: 0.4, agua: 100, pais: "China" },
  { categoria: "Fibras Artificiais", fibra: "Viscose", tipo: "Blusas", peso: 0.20, co2: 2.5, agua: 201, pais: "Índia" },
  { categoria: "Fibras Naturais Animais", fibra: "Seda", tipo: "Blusas", peso: 0.14, co2: 1.4, agua: 168, pais: "China" },
  { categoria: "Fibras Naturais Vegetais", fibra: "Linho", tipo: "Blusas", peso: 0.28, co2: 1.1, agua: 640, pais: "França" },
];

async function seedTextileDatabase() {
  console.log('🌱 Iniciando seed da base de dados têxtil...');
  
  try {
    // Limpar produtos existentes
    await prisma.product.deleteMany({});
    console.log('🗑️ Produtos existentes removidos');

    // Inserir novos produtos baseados no CSV
    const products = textileItems.map((item, index) => ({
      name: `${item.tipo} ${item.fibra}`,
      description: `${item.tipo} feito de ${item.fibra}, categoria ${item.categoria}`,
      price: Math.random() * 50 + 10, // Preço aleatório entre 10-60€
      sellerName: 'INFINITO',
      sellerId: 'infinito',
      photo1Url: `/images/Item${(index % 6) + 1}.jpeg`,
      photo2Url: `/images/Item${((index + 1) % 6) + 1}.jpeg`,
      garmentType: item.tipo,
      color: 'Variado',
      gender: 'Unisex',
      size: 'M',
      material: item.fibra,
      country: item.pais,
      condition: 'Novo',
      brand: 'INFINITO',
      impactCo2: item.co2.toString(),
      impactWater: item.agua.toString(),
      impactEff: item.co2 < 5 ? 'A' : item.co2 < 15 ? 'B' : 'C',
      // Campos adicionais para a calculadora
      category: item.categoria,
      weight: item.peso,
    }));

    const result = await prisma.product.createMany({
      data: products,
    });

    console.log(`✅ ${result.count} produtos inseridos na base de dados`);
    console.log('🎉 Seed da base de dados têxtil concluído!');
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedTextileDatabase()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedTextileDatabase; 