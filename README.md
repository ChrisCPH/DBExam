# SQL

Create a new database

Run the script found in SQL code -> SQL database script

# Mongodb

Create a new database

Create five collections and import the collections found in Data -> Collections folder

# Neo4j

Create a new database

Click on the three dots -> open folder -> import and copy the csv files from data/nodes to this folder

Create indexes first then insert data

# Backend

npm install

Create a .env file with the following info:

SQL_SERVER=

SQL_DATABASE=

SQL_USER=

SQL_PASSWORD=

MONGO_URI=

NEO4J_URI=

NEO4J_USER=

NEO4J_PASSWORD=

Enable TCP/IP in SQL: https://www.youtube.com/watch?v=Yi9bTbGHznM

Right click the server in ssms and click properties -> security and change from Windows Authentication mode to SQL Server and Windows Authentication mode

Create a database user with db_owner permissions:

USE [master]

GO

CREATE LOGIN [YourLoginName] WITH PASSWORD = 'YourPassword';

GO

USE [YourDatabaseName]

GO

CREATE USER [YourLoginName] FOR LOGIN [YourLoginName];

GO

EXEC sp_addrolemember 'db_owner', 'YourLoginName';

GO
