'use strict';
require('dotenv').config();

function getEnvVariable(key: string, required = true): string {
  const value = "" + process.env[key];
  if (!value && required) {
    throw new Error(`La variable de entorno ${key} es requerida pero no está definida.`);
  }
  console.log(value);
  return value;
}

export const Env = {
  AWS_REGION: getEnvVariable('AWS_REGION'),
  DYNAMODB_TABLE: getEnvVariable('DYNAMODB_TABLE'),
  SNS_TOPIC_PE: getEnvVariable('SNS_TOPIC_PE'),
  SNS_TOPIC_CL: getEnvVariable('SNS_TOPIC_CL'),
  SQS_URL_PE: getEnvVariable('SQS_URL_PE'),
  SQS_URL_CL: getEnvVariable('SQS_URL_CL'),
  RDS_HOST: getEnvVariable('RDS_HOST'),
  RDS_PORT: parseInt(getEnvVariable('RDS_PORT')),
  RDS_USER: getEnvVariable('RDS_USER'),
  RDS_PASSWORD: getEnvVariable('RDS_PASSWORD'),
  RDS_DATABASE: getEnvVariable('RDS_DATABASE'),
};
