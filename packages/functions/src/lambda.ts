import { ApiHandler } from "sst/node/api";
import OpenAI from "openai";

const openAI = (): OpenAI => {
  const configuration = {
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.API_KEY
  };
  return new OpenAI(configuration);
}

class ApiHandlerResponse {
  body: string;
  statusCode: number;
  headers: {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Credentials": boolean;
  };

  constructor(body: string = "", statusCode: number = 200) {
    this.body = body;
    this.statusCode = statusCode;
    this.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };
  }
}

const oai: OpenAI = openAI();

export const handler = ApiHandler(async (evt): Promise<ApiHandlerResponse> => {
  const request: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
    messages: [{ role: 'user', content: `Create a summary of ${evt.body} that is less than 5 words in length` }],
    model: 'gpt-3.5-turbo',
    max_tokens: 10,
  };
  try {
    const response: OpenAI.Chat.Completions.ChatCompletion = await oai.chat.completions.create(request)
    return new ApiHandlerResponse(response.choices[0].message.content || "");
  } catch(e) {
    console.error(e)
    return new ApiHandlerResponse("An error has occurred", 500);
  }
});
