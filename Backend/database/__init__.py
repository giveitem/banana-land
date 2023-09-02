from UserInformation import UserInformation

User_Info_DynamoDB = UserInformation('AKIA2MDSAAMNQELGPNAT', 'NQVqH+mzofzq6qjKP3ELA6Rf5PBeqSYZytkfVXpo', 'us-east-1')

DynamoDB_table_name = 'UserInformation'
User_Info_DynamoDB.create_dynamoDB_table(DynamoDB_table_name)

S3_bucket_name = 'bananaland'
S3_key = 'BACKUP-23-08-21-11-04-31.parquet'
df = User_Info_DynamoDB.read_parquet_from_S3(S3_bucket_name, S3_key)

User_Info_DynamoDB.write_to_DynamoDB(DynamoDB_table_name)










