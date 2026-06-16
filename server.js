const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
// Internet nos asignará un puerto automáticamente en process.env.PORT, si no, usa el 3000 local
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializamos la Inteligencia Artificial con tu llave de acceso directo
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6L7r9cAxVdU9W0y7a-kwE_imyJyEHpG5aka8GsY1Yp2oQ' });

app.post('/api/draft', async (req, res) => {
  const { aliados, enemigos } = req.body;

  console.log("🎮 Analizando Draft en tiempo real...");

  if (enemigos.length === 0 && aliados.length === 0) {
    return res.json({ sugerenciaIA: "💡 Selecciona héroes enemigos para empezar a recibir counters en tiempo real." });
  }

  // Creamos las instrucciones exactas para la IA de Dota 2 con el contexto de Largo
  const prompt = `
    Eres un entrenador experto de Dota 2 con rango Inmortal.
    Analiza el siguiente Draft actual y brinda una sugerencia táctica muy breve y directa (máximo 3 líneas) para el juego.
    
    Héroes Aliados actuales: ${aliados.length > 0 ? aliados.join(', ') : 'Ninguno elegido aún'}
    Héroes Enemigos actuales: ${enemigos.length > 0 ? enemigos.join(', ') : 'Ninguno elegido aún'}

    NOTA IMPORTANTE: Si ves al héroe "Largo", es el nuevo héroe de Dota 2. Es un sapo bardo de Fuerza que usa canciones para potenciar aliados, tiene la habilidad "Lametón Pegajoso" para arrastrar enemigos y disipa efectos con su lengua. Trátalo como un iniciador/utility fuerte de fuerza.

    Dime qué tipo de héroe nos falta, qué ítems clave deberíamos armar o a quién deberíamos focusear en las peleas. Sé conciso y usa un lenguaje dotero amigable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ sugerenciaIA: response.text.trim() });
  } catch (error) {
    console.error("Error con la API de Gemini:", error);
    res.json({ sugerenciaIA: "❌ La IA está tomando una poción de maná. Intenta de nuevo en un segundo." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Dota AI corriendo en el puerto ${PORT}`);
});