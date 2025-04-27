import * as dotenv from 'dotenv';
dotenv.config();

function getEnvVariable(key: string, required = true): string {
  const value = "" + process.env[key];
  if (!value && required) {
    throw new Error(`La variable de entorno ${key} es requerida pero no está definida.`);
  }
  return value;
}

export const Env = {
  AWS_REGION: getEnvVariable('AWS_REGION'),
  DYNAMODB_TABLE: getEnvVariable('DYNAMODB_TABLE'),
  SNS_ARN_PE: getEnvVariable('SNS_ARN_PE'),
  SNS_ARN_CL: getEnvVariable('SNS_ARN_CL'),
  SQS_ARN_PE: getEnvVariable('SQS_ARN_PE'),
  SQS_ARN_CL: getEnvVariable('SQS_ARN_CL'),
  RDS_HOST: getEnvVariable('RDS_HOST'),
  RDS_PORT: parseInt(getEnvVariable('RDS_PORT')),
  RDS_USER: getEnvVariable('RDS_USER'),
  RDS_PASSWORD: getEnvVariable('RDS_PASSWORD'),
  RDS_DATABASE: getEnvVariable('RDS_DATABASE'),
};
