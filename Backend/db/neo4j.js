const neo4j = require('neo4j-driver');

const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));

const connectNeo4j = async () => {
    const session = driver.session();
    try {
        await session.run('RETURN 1');
        console.log('Connected to Neo4j');
    } catch (err) {
        console.error('Neo4j Connection Error:', err);
    } finally {
        await session.close();
    }
};

module.exports = connectNeo4j;
