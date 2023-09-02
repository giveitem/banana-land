import unittest
from io import BytesIO
from unittest import TestCase
from unittest.mock import patch

import pandas as pd

from Backend.database.UserInformation import UserInformation


class TestUserInformation(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.aws_access_key = 'access_key'
        cls.aws_secret_key = 'secret_key'
        cls.aws_region = 'region'
        cls.table_name = 'test_table'
        cls.bucket_name = 'test_bucket'
        cls.key = 'test_key.parquet'

    def setUp(self) -> None:
        self.user_info = UserInformation(self.aws_access_key, self.aws_secret_key, self.aws_region)

    @patch('boto3.resource')
    @patch('boto3.client')
    def test_create_dynamo_db_table(self, mock_boto_client, mock_boto_resource):
        mock_dynamodb_client = mock_boto_client.return_value
        mock_dynamodb_resource = mock_boto_resource.return_value

        self.user_info.create_dynamoDB_table(self.table_name)

        mock_dynamodb_resource.create_table.assert_called_once()
        mock_dynamodb_client.get_waiter.return_value.wait.assert_called_once()


    @patch('boto3.client')
    def test_read_parquet_from_s3(self, mock_boto_client):
        mock_s3_client = mock_boto_client.return_value
        mock_response = {
            'Body': BytesIO(b'parquet_data')
        }
        mock_s3_client.get_object.return_value = mock_response

        result = self.user_info.read_parquet_from_S3(self.bucket_name, self.key)

        self.assertIsInstance(result, pd.DataFrame)

    @patch('boto3.client')
    def test_write_to_dynamo_db(self, mock_boto_client):
        mock_dynamodb_client = mock_boto_client.return_value
        mock_dynamodb_client.put_item.return_value = {}

        # Create a sample DataFrame
        sample_data = {
            'id': [1, 2],
            'password': ['pass1', 'pass2'],
            'username': ['user1', 'user2'],
        }
        df = pd.DataFrame(sample_data)

        with patch.object(self.user_info, 'read_parquet_from_S3', return_value=df):
            self.user_info.write_to_DynamoDB(self.table_name)

        mock_dynamodb_client.put_item.assert_called()
        self.assertEqual(mock_dynamodb_client.put_item.call_count, len(df))

if __name__ == '__main__':
    unittest.main()
