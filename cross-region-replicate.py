import json
import boto3
import os

def lambda_handler(event, context):
    # TODO implement
    s3Key_local = event["Records"][0]["s3"]["object"]["key"]
    s3Key_local = s3Key_local.split('.')[-1]
    if s3Key_local == 'parquet':
        job(event["Records"][0]["s3"]["object"]["key"])
    return {
        'statusCode': 200,
        'body': json.dumps(event),
        'data': event
    }
def job(s3Key):
    aws_id = os.getenv('aws_id')
    aws_secret = os.environ.get('aws_secret')
    client_s3 = boto3.client('s3',
                          aws_access_key_id=aws_id,
                          aws_secret_access_key=aws_secret,
                          region_name = 'us-west-1')
    dic =  {'Bucket': 'banana-backup-deshi',
             'Key':s3Key, 
            }
    response = client_s3.copy_object(
        Bucket = 'banana-backup-deshi-ohio',
        CopySource = dic,
        Key = s3Key
    )
