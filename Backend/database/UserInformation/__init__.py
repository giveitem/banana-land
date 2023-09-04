import os
import struct
from multiprocessing import process

import boto3
import pyarrow.parquet as pq
from io import BytesIO

class UserInformation:
    def __init__(self, table_name):
        self.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
        self.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
        self.AWS_REGION = process.env.AWS_REGION
        self.table_name = table_name

    def create_dynamoDB_table(self):
        # Create a DynamoDB resource
        dynamodb = boto3.resource('dynamodb', aws_access_key_id=self.AWS_ACCESS_KEY_ID, aws_secret_access_key=self.AWS_SECRET_ACCESS_KEY,
                                  region_name=self.AWS_REGION)

        # Define the table schema
        table = dynamodb.create_table(
            TableName=self.table_name,
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'
                },

            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'N'
                },

            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,  # Adjust as needed
                'WriteCapacityUnits': 5  # Adjust as needed
            },

            # PointInTimeRecoverySpecification={
            #     'PointInTimeRecoveryEnabled': True
            # }
        )

        # Wait for the table to be created
        table.meta.client.get_waiter('table_exists').wait(TableName=self.table_name)
        # PointInTimeRecoverySpecification={
        #     'PointInTimeRecoveryEnabled': True
        # }
        ##




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

    def read_parquet_from_S3(self, bucket_name, key):
        # Read from S3 ***
        # Configure AWS credentials
        os.environ['AWS_ACCESS_KEY_ID'] = self.AWS_ACCESS_KEY_ID
        os.environ['AWS_SECRET_ACCESS_KEY'] = self.AWS_SECRET_ACCESS_KEY
        os.environ['AWS_REGION'] = self.AWS_REGION

        # s3 = boto3.resource('s3')
        s3 = boto3.client('s3')

        response = s3.get_object(Bucket=bucket_name, Key=key)
        parquet_data = response['Body'].read()

        # Create a BytesIO object from the Parquet data
        parquet_io = BytesIO(parquet_data)

        # Read the Parquet data using PyArrow
        table = pq.read_table(parquet_io)
        df = table.to_pandas()

        # for test only
        print(df.to_string())

        return df

    def write_to_DynamoDB(self, table_name):
        # Configure AWS credentials
        os.environ['AWS_ACCESS_KEY_ID'] = self.AWS_ACCESS_KEY_ID
        os.environ['AWS_SECRET_ACCESS_KEY'] = self.AWS_SECRET_ACCESS_KEY
        os.environ['AWS_REGION'] = self.AWS_REGION

        # Write to DynamoDB
        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb')

        # Iterate through DataFrame and put items into DynamoDB table
        for _, row in df.iterrows():
            item = {
                'id': {'N': str(row['id'])},
                'password': {'S': row['password']},
                'username': {'S': row['username']},
                'firstName': {'S': row['first_name']},
                'lastName': {'S': row['last_name']},
                'email': {'S': row['email']},
                'isStaff': {'B': struct.pack('?', row['is_staff'])},
                'isCourseManager': {'B': struct.pack('?', row['is_course_manager'])},
                'isOrgManager': {'B': struct.pack('?', row['is_org_manager'])}
            }

            response = dynamodb.put_item(
                TableName=table_name,
                Item=item
            )

            print(f"Inserted item with ID: {row['id']}")

        print("Data insertion into DynamoDB complete.")





