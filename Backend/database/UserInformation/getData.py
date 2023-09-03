from flask import Flask, request, jsonify
import boto3

app = Flask(__name__)

AWS_ACCESS_KEY_ID = 'AKIA2MDSAAMNQELGPNAT'
AWS_SECRET_ACCESS_KEY = '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'
AWS_REGION = 'us-east-1'

dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)

@app.route('/api/get_data', methods=['GET'])
def get_data():
    try:
        table = dynamodb.Table('UserInformation')
        response = table.scan()
        items = response.get('Items', [])

        return jsonify({"data": items})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
