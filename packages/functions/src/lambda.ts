import { ApiHandler } from "sst/node/api";
import { Configuration, OpenAIApi, CreateCompletionRequest, CreateCompletionResponse } from "openai";
import { AxiosResponse } from "axios";

const openAI = (): OpenAIApi => {
  const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.API_KEY
  });
  return new OpenAIApi(configuration);
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

const oai: OpenAIApi = openAI();

export const handler = ApiHandler(async (evt): Promise<ApiHandlerResponse> => {
  const request: CreateCompletionRequest = {
    model: "text-davinci-003",
    prompt: `Create a summary of ${evt.body} that is less than 5 words`,
    max_tokens: 10,
  }

  try {
    const response: AxiosResponse<CreateCompletionResponse, any> = await oai.createCompletion(request)
    return new ApiHandlerResponse(response.data.choices[0].text);
  } catch(e) {
    console.error(e)
    return new ApiHandlerResponse("An error has occurred", 500);
  }
});
