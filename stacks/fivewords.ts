import { StackContext, Api, StaticSite, use } from "sst/constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";


export function API({ stack }: StackContext) {
  const apiKey = StringParameter.valueFromLookup(stack, "api_key");
  const organizationId = StringParameter.valueFromLookup(stack, "organization_id");

  const api = new Api(stack, "api", {
    cors: true,
    routes: {
      "POST /": "packages/functions/src/lambda.handler",
    },
    defaults: {
      function: {
        timeout: 10,
        environment: {
          API_KEY: apiKey,
          ORGANIZATION_ID: organizationId,
        }
      }
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return api;
}

export function Web({ stack }: StackContext) {
  const api = use(API);

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    customDomain: stack.stage === "prod" ? {
      domainName: "fivewords.co.uk",
      domainAlias: "www.fivewords.co.uk"
    } : undefined,
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    Web: web.customDomainUrl,
  })
}
