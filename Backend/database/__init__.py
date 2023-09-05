from UserInformation import UserInformation

DynamoDB_table_name = 'UserInformation'
User_Info_DynamoDB = UserInformation(DynamoDB_table_name)

#Comment out below code blocks as need
#Create the table
# User_Info_DynamoDB.create_dynamoDB_table()
#
# User_Info_DynamoDB.enable_PITR()

#Backfill
S3_bucket_name = 'bananaland'
S3_key = 'BACKUP-23-08-21-11-04-31.parquet'
User_Info_DynamoDB.backfill_from_S3_to_DDB(S3_bucket_name, S3_key)












