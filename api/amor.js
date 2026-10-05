import { GoogleGenAI } from '@google/genai';

// Temas rotativos para garantizar variedad
const ENFOQUES_ROMANTICOS = [
  "el brillo inconfundible de sus ojos y la paz inmensa que transmite su mirada",
  "el recuerdo dulce de cómo empezó todo cuando se conocieron en el colegio y todo lo hermoso que construyeron",
  "su dulce voz que calma cualquier preocupación y hace sentir que todo va a estar bien",
  "su inteligencia, valentía y esa forma admirable en que no se rinde ante nada y siempre le busca la vuelta",
  "la complicidad y ternura de sus risas, cómo se hacen enojar jugando y lo lindo de sus momentos espontáneos",
  "la calidez de sus abrazos y besos, donde el mundo entero desaparece y solo importan ellos dos",
  "el agradecimiento profundo por ser una novia tan dedicada, sincera y especial que lo da todo por la relación",
  "la certeza de que entre miles de millones de personas en el mundo, ella es y siempre será la elección perfecta",
  "los pequeños detalles cotidianos, meriendas compartidas y miradas cómplices que llenan el corazón",
  "una promesa íntima de amor eterno y de seguir eligiéndose cada nuevo amanecer bajo las estrellas"
];

export default async function handler(req, res) {
  // Manejo de métodos permitidos
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: Variable GEMINI_API_KEY no encontrada');
    return res.status(500).json({ error: 'Falta configurar la API Key en Vercel' });
  }

  // Parse seguro del cuerpo recibido
  let bodyData = req.body;
  if (typeof bodyData === 'string') {
    try {
      bodyData = JSON.parse(bodyData);
    } catch {
      bodyData = {};
    }
  }
  const tipo = bodyData?.tipo;

  const enfoque = ENFOQUES_ROMANTICOS[Math.floor(Math.random() * ENFOQUES_ROMANTICOS.length)];

  let prompt = `Escribe una dedicatoria romántica muy conmovedora, poética y original (de 2 a 3 oraciones intensas) de Tyron para su novia Ayli (Aylen Cardozo).
Enfócate con sentimiento en: ${enfoque}.
Reglas estrictas:
- No uses clichés trillados ni rimas forzadas.
- Que se sienta íntima, sincera, profunda y nacida del corazón.
- Hablale de 'vos' (español rioplatense dulce y natural).`;

  if (tipo === 'cita') {
    prompt = `Sugiere una idea de cita romántica creativa, dulce, original y divertida para Tyron y Ayli, breve y llena de complicidad en pareja.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    let response;

    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          temperature: 0.95,
          topP: 0.95,
          systemInstruction: "Sos un escritor y poeta de alta sensibilidad literaria. Escribís dedicatorias de amor para Ayli de parte de Tyron. Tu prosa es emotiva, bella, auténtica, llena de calidez y libre de frases hechas o lugares comunes."
        }
      });
    } catch (proError) {
      console.warn('Fallback a gemini-2.5-flash:', proError.message);
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.95,
          systemInstruction: "Escribí una dedicatoria de amor dulce, poética y única para Ayli de parte de su novio Tyron en español rioplatense."
        }
      });
    }

    const mensajeFinal = response.text ? response.text.trim() : '';
    return res.status(200).json({ mensaje: mensajeFinal });

  } catch (error) {
    console.error('Error con Gemini API:', error);
    return res.status(500).json({ error: error.message || 'No se pudo generar el mensaje' });
  }
}
