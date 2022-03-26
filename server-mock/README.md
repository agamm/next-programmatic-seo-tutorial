

# Setup
```
npm install .
docker-compose up -d
```

# Running
`MONGO_MOCK_DB_CREDS='mongodb://admin:123456@127.0.0.1:27017' node server.js`

# Populat with data (while server is running)
`node dummyData.js`