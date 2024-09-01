const { MongoClient } = require('mongodb');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function exportToCsv() {
  const uri = 'mongodb+srv://vanshaggrawal1:icWByhsiMxhAifYV@cluster0.rho0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database and collection
    const database = client.db('test'); // Replace with your database name
    const collection = database.collection('assigneddbs'); // Replace with your collection name

    // Fetch all documents from the collection
    const documents = await collection.find({}).toArray();

    if (documents.length === 0) {
      console.log('No documents found in the collection.');
      return;
    }

    // Define the CSV file writer
    const csvWriter = createCsvWriter({
      path: 'output.csv', // Output file name
      header: Object.keys(documents[0]).map(key => ({ id: key, title: key }))
    });

    // Write the documents to the CSV file
    await csvWriter.writeRecords(documents);
    console.log('Documents have been successfully written to output.csv');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await client.close();
  }
}

exportToCsv();
