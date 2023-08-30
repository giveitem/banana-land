import pandas as pd
import boto3
from datetime import datetime
import os
import psycopg2
import json


def lambda_handler(event, context):
    # TODO implement
    res = read_psql()
    return {
        'statusCode': 200,
        'body': json.dumps(res)
    }


def read_psql():
    aws_id = os.getenv('aws_id')
    aws_secret = os.environ.get('aws_secret')
    conn = psycopg2.connect(database=os.getenv('RDS_DB_NAME'),
                            host=os.getenv('RDS_HOSTNAME'),
                            user=os.getenv('RDS_USERNAME'),
                            password=os.getenv('RDS_PASSWORD'),
                            port=os.getenv('RDS_PORT'))
    cur = conn.cursor()
    cur.execute("SELECT * FROM public.user_info")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    df = pd.DataFrame(rows, columns=['id', 'password', 'username', 'first_name',
                      'last_name', 'email', 'is_staff', 'is_course_manager', 'is_org_manager'])
    client_s3 = boto3.client('s3',
                             aws_access_key_id=aws_id,
                             aws_secret_access_key=aws_secret,
                             region_name='us-west-1')
    now = datetime.now()
    current_time = "BACKUP-"+now.strftime("%y-%m-%d-%H-%M-%S")
    parquet_file = "/tmp/"+current_time + '.parquet'
    s3_file = current_time + '.parquet'
    df.to_parquet(parquet_file, engine='fastparquet', compression='gzip')
    s3key = 'from-python/' + s3_file
    client_s3.upload_file(
        parquet_file, 'banana-backup-deshi', s3key)
    print("file uploaded")
    return "Sucessfully uploaded" + s3key + "to s3 bucket"

def main():
    read_psql()


if __name__ == "__main__":
    main()
