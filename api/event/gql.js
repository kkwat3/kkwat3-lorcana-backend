import fetch from "node-fetch";

const API_URL = "https://rph-prod-dot-rav-exp-cloud-lgt.appspot.com/graphql";

export async function rphQuery(query, variables = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
      "Origin": "https://tcg.ravensburgerplay.com",
      "Referer": "https://tcg.ravensburgerplay.com/"
    },
    body: JSON.stringify({ query, variables })
  });

  const text = await response.text();

  // Detectar HTML (error) y reportar claramente
  if (!text.trim().startsWith("{") && text.includes("<html")) {
    throw new Error("RPH devolvió HTML (posible bloqueo, endpoint incorrecto o requiere sesión).");
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error("Respuesta inválida de RPH (no JSON): " + text.slice(0, 200));
  }

  if (json.errors) {
    throw new Error(json.errors.map(e => e.message).join(" | "));
  }

  return json.data;
}
