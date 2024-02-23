import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: Handler = async (event, context) => {
  try {
    console.log("Event: ", event);
    
    const scanResult = await ddbDocClient.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
      })
    );

    if (!scanResult.Items || scanResult.Items.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ data: [] }),
      };
    }

    return {
      statusCode: 404,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ data: scanResult.Items }),
    };
  } catch (error: any) {
    console.error("Error: ", JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: error.message || error }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}