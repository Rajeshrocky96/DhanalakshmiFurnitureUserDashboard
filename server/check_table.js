const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const dotenv = require('dotenv');
dotenv.config();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const tableName = process.env.DYNAMODB_TABLE_ENQUIRIES;

const checkTable = async () => {
    console.log(`Checking table: ${tableName}`);
    try {
        const command = new DescribeTableCommand({ TableName: tableName });
        const response = await client.send(command);
        console.log("Table Status:", response.Table.TableStatus);
        console.log("KeySchema:", JSON.stringify(response.Table.KeySchema, null, 2));
    } catch (error) {
        console.error("Error describing table:", error.message);
    }
};

checkTable();
