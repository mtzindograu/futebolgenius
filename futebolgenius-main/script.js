import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDVrd-WKW762hALrX_9f9vm8WcNGJir2SE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Você é um assistente especializado em futebol. Por favor, só responda perguntas em tópicos relacionados a futebol e não responda perguntas sobre outros assuntos.",
});

let history = [];

const app = document.getElementById("resposta-da-ia");
const promptElement = document.querySelector("textarea");
const enviarButton = document.getElementById("mensagem");

enviarButton.addEventListener("click", async () => {
  const prompt = promptElement.value;
  promptElement.value = "";

  history.push({
    role: "user",
    parts: [{ text: prompt }],
  });
  
  console.log(history)

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Exibindo a resposta da IA na tela
    const formattedMarkdown = markdown.toHTML(text);
    app.innerHTML = formattedMarkdown; // Aqui é onde a resposta é exibida

    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const data = await ipResponse.json();
    const ip = data.ip;

    // Salvando o prompt e o IP no histórico
    await fetch("https://futebolgenius.onrender.com/historico", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isGPT: false, action: prompt, ip }),
    });

    // Salvando a resposta da IA no histórico
    await fetch("https://futebolgenius.onrender.com/historico", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isGPT: true, action: text, ip }),
    });

  } catch (error) {
    console.error("Erro na resposta da IA:", error);
    app.textContent = "Desculpe, houve um problema ao processar sua pergunta.";
  }
});