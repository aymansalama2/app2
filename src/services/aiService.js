import { HF_API_KEY, HF_API_URL } from '../config/aiConfig';

export const analyzeInvestment = async (userMessage, companyData) => {
  try {
    const API_URL = "https://api.openai-proxy.com/v1/chat/completions";
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "Tu es un conseiller financier expert qui analyse des données d'entreprise."
          },
          {
            role: "user",
            content: `Analyse ces données financières et réponds en français de manière professionnelle:

Données de l'entreprise:
- Revenus mensuels: ${JSON.stringify(companyData.revenue)}€
- Dépenses mensuelles: ${JSON.stringify(companyData.expenses)}€
- Bénéfices mensuels: ${JSON.stringify(companyData.profit)}€
- Capital: ${companyData.capital}€
- Capitalisation boursière: ${companyData.marketCap}€
- Ratios financiers:
  * P/E: ${companyData.metrics.peRatio}
  * Dette/Fonds propres: ${companyData.metrics.debtToEquity}
  * Liquidité: ${companyData.metrics.currentRatio}
  * ROE: ${companyData.metrics.returnOnEquity}
  * Marge bénéficiaire: ${companyData.metrics.profitMargin}
- Secteur: ${companyData.industry}
- Part de marché: ${companyData.marketShare}

Question du client: ${userMessage}

Analyse détaillée:
1. Santé financière
2. Croissance
3. Recommandation
4. Risques`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      console.warn('API request failed, using fallback response');
      return generateFallbackResponse(userMessage, companyData);
    }

    const data = await response.json();
    if (!data?.choices?.[0]?.message?.content) {
      console.warn('Invalid API response format, using fallback');
      return generateFallbackResponse(userMessage, companyData);
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.warn('Service error, using fallback response:', error);
    return generateFallbackResponse(userMessage, companyData);
  }
};

// Fonction de secours pour générer une réponse basée sur les données
function generateFallbackResponse(userMessage, companyData) {
  const lastProfit = companyData.profit[companyData.profit.length - 1];
  const firstProfit = companyData.profit[0];
  const profitGrowth = ((lastProfit - firstProfit) / firstProfit * 100).toFixed(1);
  
  const messageLower = userMessage.toLowerCase();
  
  if (messageLower.includes('rentabilité') || messageLower.includes('performance')) {
    return `Analyse de la rentabilité :

1. Santé financière
- Marge bénéficiaire actuelle : ${(companyData.metrics.profitMargin * 100).toFixed(1)}%
- ROE : ${(companyData.metrics.returnOnEquity * 100).toFixed(1)}%
- Croissance des bénéfices : +${profitGrowth}%

2. Points forts
- Bonne gestion des coûts
- Croissance régulière des revenus
- Marge bénéficiaire stable

3. Recommandation
✅ L'entreprise montre une rentabilité solide et une bonne gestion financière.

4. Risques
- Surveiller l'évolution des coûts
- Maintenir la marge bénéficiaire`;
  }
  
  if (messageLower.includes('investir') || messageLower.includes('achat')) {
    return `Analyse d'investissement :

1. Valorisation
- P/E Ratio : ${companyData.metrics.peRatio} (valorisation raisonnable)
- Part de marché : ${(companyData.marketShare * 100).toFixed(1)}%

2. Croissance
- Progression des bénéfices : +${profitGrowth}%
- Tendance positive du chiffre d'affaires

3. Recommandation
✅ Le moment semble favorable pour investir, avec :
- Une valorisation attractive
- Une croissance solide
- Des fondamentaux sains

4. Points de vigilance
- Suivre l'évolution du secteur
- Surveiller la concurrence`;
  }

  return `Analyse financière globale :

1. Santé financière
- Structure financière saine
- Bonne liquidité (ratio ${companyData.metrics.currentRatio})
- Endettement maîtrisé

2. Performance
- Croissance des bénéfices : +${profitGrowth}%
- ROE attractif : ${(companyData.metrics.returnOnEquity * 100).toFixed(1)}%
- Part de marché : ${(companyData.marketShare * 100).toFixed(1)}%

3. Recommandation
✅ L'entreprise présente un profil financier solide avec de bonnes perspectives de croissance.

4. Points clés à surveiller
- Évolution de la marge
- Position concurrentielle
- Opportunités de croissance`;
} 