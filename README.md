Publift Test

Tech used: Node.js, Express

## Get Started

### 1. Environment Setup

In each folder, run:
``` 
 $ npm install
 ```

### 2. Test

Install [Postman](https://www.postman.com/downloads/)

#### Upload CSV

- Select 'POST';
- Select 'Body', enter 'csv' to 'KEY', select 'file' at the right of the 'KEY' column, upload the csv file;
- Enter 'localhost:8001/csv-upload', press 'Send';
- Copy the 'fileId';

#### Get Results

- Select 'GET';
- Enter 'localhost:8001/csv-results/:fileId', the 'fileId' is the result from 'POST', press 'Send';
- Processing time takes 9s, so test the 'GET' within 9s, more than 9s and with wrong fileId to see different responses;