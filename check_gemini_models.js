const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const models = await genAI.listModels();
    
    console.log("Available Gemini Models:");
    console.log("========================\n");
    
    models.forEach(model => {
      console.log(`Name: ${model.name}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Input Token Limit: ${model.inputTokenLimit}`);
      console.log(`Output Token Limit: ${model.outputTokenLimit}`);
      if (model.supportedGenerationMethods) {
        const methods = Array.isArray(model.supportedGenerationMethods) 
          ? model.supportedGenerationMethods.join(", ") 
          : model.supportedGenerationMethods;
        console.log(`Supported Methods: ${methods}`);
      }
      console.log("---");
    });
  } catch (error) {
    console.error("Error fetching models:", error.message);
  }
}

listModels();
