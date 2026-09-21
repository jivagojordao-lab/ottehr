import { APIGatewayProxyEventHeaders, APIGatewayProxyResult, Callback, Context, Handler } from 'aws-lambda';
import { Request, Response } from 'express';
import { existsSync, readFileSync } from 'fs';
import { IncomingHttpHeaders } from 'http2';
import _ from 'lodash';
import { resolve } from 'path';
import { ZambdaInput } from '../shared/types/common';

export const expressLambda = async (
  handler: Handler<any, APIGatewayProxyResult>,
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lambdaInput = await buildLambdaInput(req);
    const handlerResponse = await handler(
      lambdaInput,
      {} as unknown as Context, // Zambdas don't use it
      undefined as unknown as Callback<APIGatewayProxyResult> // Zambdas don't use it
    );
    if (handlerResponse != null) {
      _.forOwn(handlerResponse.headers, (value, key) => {
        res.setHeader(key, value);
      });
      res.status(handlerResponse.statusCode);
      let body;
      try {
        body = JSON.parse(handlerResponse.body);
      } catch {
        body = handlerResponse.body;
      }

      res.send({
        status: handlerResponse.statusCode,
        output: body,
      });
    } else {
      res.status(500).send({ message: 'No response from handler' });
    }
  } catch (err: any) {
    console.error(`Erro ao executar zambda ${req.url}:`, err);
    res.status(500).send({ message: err?.message || String(err) });
  }
};

const defaultLocalSecrets: Record<string, string> = {
  ENVIRONMENT: 'local',
  FHIR_API: 'http://localhost:8103/fhir/R4',
  PROJECT_API: 'http://localhost:3000',
  PROJECT_ID: 'ottehr-brasil',
  ORGANIZATION_ID: 'ottehr-brasil',
  WEBSITE_URL: 'http://localhost:4002',
};

const secrets: Record<string, string> = { ...defaultLocalSecrets };

function populateSecrets({ pathToSecretsFile }: { pathToSecretsFile: string }): void {
  console.log('Populating secrets from', pathToSecretsFile);
  const fullPath = resolve(__dirname, `../../${pathToSecretsFile}`);
  if (!existsSync(fullPath)) {
    console.log(`Secrets file not found at ${fullPath}, continuing with empty secrets.`);
    return;
  }
  try {
    const configString = readFileSync(fullPath, { encoding: 'utf8' });
    const fileContents: Record<string, string> = JSON.parse(configString);
    Object.entries(fileContents).forEach(([key, value]) => {
      secrets[key] = value;
    });
    console.log(`Populated ${Object.keys(secrets).length} secrets`);
  } catch (err) {
    console.warn('Could not parse secrets file:', err);
  }
}

const singleValueHeaders = (input: IncomingHttpHeaders): APIGatewayProxyEventHeaders => {
  const headers = _.flow([
    Object.entries,
    (arr) => arr.filter(([, value]: [string, any]) => !Array.isArray(value)),
    Object.fromEntries,
  ])(input);
  return headers;
};

function parseArgs(args: string[]): Record<string, string> {
  return args.reduce(
    (acc, arg) => {
      const [key, value] = arg.split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );
}

const cliParams = parseArgs(process.argv.slice(2));
let pathToSecretsFile = cliParams['secrets'];
if (!pathToSecretsFile) {
  const env = process.env.ENV || 'local';
  pathToSecretsFile = `.env/zambda-secrets-${env}.json`;
}
console.log('Loading secrets from', pathToSecretsFile);
populateSecrets({ pathToSecretsFile });
const populateSecretsPromise = Promise.resolve();

async function buildLambdaInput(req: Request): Promise<ZambdaInput> {
  console.log('build lambda body,', JSON.stringify(req.body));
  await populateSecretsPromise;
  return {
    body: !_.isEmpty(req.body) ? req.body : null,
    headers: singleValueHeaders(req.headers),
    secrets,
  };
}
