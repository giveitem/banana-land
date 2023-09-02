import json
import uuid
from datetime import time


import boto3
from boto3 import dynamodb
import boto3
import uuid
import random
import time

class ChatHistory:
    def __init__(self, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, table_name, index_name):
        self.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID
        self.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY
        self.AWS_REGION = AWS_REGION
        self.table_name = table_name
        self.index_name = index_name
        self.table = None

        # Create a DynamoDB resource
        self.dynamodb = boto3.resource('dynamodb', aws_access_key_id=self.AWS_ACCESS_KEY_ID,
                                  aws_secret_access_key=self.AWS_SECRET_ACCESS_KEY,
                                  region_name=self.AWS_REGION)

    def create_dynamoDB_table(self):
        # Define the table schema
        table = self.dynamodb.create_table(
            TableName=self.table_name,
            KeySchema=[
                {
                    'AttributeName': 'studentID',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'timestamp',
                    'KeyType': 'RANGE'
                },

            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'studentID',
                    'AttributeType': 'N'
                },
                {
                    'AttributeName': 'timestamp',
                    'AttributeType': 'N'
                },

            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,  # Adjust as needed
                'WriteCapacityUnits': 5  # Adjust as needed
            },

            GlobalSecondaryIndexes=[
                {
                    'IndexName': self.index_name,
                    'KeySchema': [
                        {
                            'AttributeName': 'timestamp',
                            'KeyType': 'HASH'
                        },
                        {
                            'AttributeName': 'studentID',
                            'KeyType': 'RANGE'
                        },
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,  # Adjust as needed
                        'WriteCapacityUnits': 5  # Adjust as needed
                    }
                }
            ]
        )

        # Wait for the table to be created
        table.meta.client.get_waiter('table_exists').wait(TableName=self.table_name)

        # PointInTimeRecoverySpecification={
        #     'PointInTimeRecoveryEnabled': True
        # }
        ##

        self.table = table
        print("Table created:", table.table_status)

    def enable_PITR(self):
        # Initialize the DynamoDB client
        dynamodb = boto3.client('dynamodb', aws_access_key_id=self.AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=self.AWS_SECRET_ACCESS_KEY,
                                region_name=self.AWS_REGION)

        # Enable PITR for the table
        response = dynamodb.update_continuous_backups(
            TableName=self.table_name,
            PointInTimeRecoverySpecification={
                'PointInTimeRecoveryEnabled': True
            }
        )

        print("PITR is enabled for the table:", response)

    def generate_random_item(self):
        student_id = random.randint(10000, 99999)  # Generate a random student ID
        timestamp = int(time.time()) - random.randint(0, 3600 * 24 * 365)  # Generate a random timestamp within the past year
        staff_id = random.randint(10000, 99999)  # Generate a random staff ID
        chat_history = json.dumps(
            {"messages": ["Hello", "How are you?", "Goodbye"]})  # Generate a sample chat history in JSON format

        item = {
            'studentID': student_id,
            'timestamp': timestamp,
            'staffID': staff_id,
            'chatHistory': chat_history
        }

        return item

    def insert_items_into_table(self, num_items=10):
        table = self.dynamodb.Table(self.table_name)
        for _ in range(num_items):
            item = self.generate_random_item()
            response = table.put_item(
                Item=item
            )
            print("Item added:", response)



DynamoDB_table_name = 'ChatHistory'
DynamoDB_index_name = 'QueryByTime'
chat_history = ChatHistory('AKIA2MDSAAMNQELGPNAT', 'NQVqH+mzofzq6qjKP3ELA6Rf5PBeqSYZytkfVXpo', 'us-east-1', DynamoDB_table_name, DynamoDB_index_name)


chat_history.create_dynamoDB_table()

chat_history.enable_PITR()

chat_history.insert_items_into_table(10)

# chat_history.create_GSI('staffChat')

# feature toggle
# postgres for python
# button in frontend -> rds -> ddb -> rds
# config(input) = {
#
#     if (input == ture):
#         host: rds_port
#     else:
#         host: ddb_port
#     host: rds_port
#
#     fetch form current chosen table
#
# }

