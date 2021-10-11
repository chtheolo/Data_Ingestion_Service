# Data_Ingestion_Service
This project was developed in Nodejs implementing a data ingestion service. Each sensor send its data to the data ingestion service. Users can fetch data, 
set thresholds to each sensor and get notifications when a sensor value reach the threshold value.

## Contents
* [How to install](#how-to-install)
* [How to run](#how-to-run)
* [Architecture](#arch)
* [Future Work](#future)

<a name="how-to-install"></a>
* ## How to install
The service was developed to run either in docker containers or run locally. In contrast with the **data ingestion service**, the database service always runs in
a docker container. So, firstly you have to install [**docker**](https://docs.docker.com/engine/install/ubuntu/) and [**docker-compose**](https://docs.docker.com/compose/install/)
in your machine.

If you want to run the service locally, you have to enter the root service folder **'./api_service'**  and install the project dependencies by typing:

```npm
npm install
```

<a name="how-to-run"></a>
* ## How to run
When installation finished, you can run the project with both ways, either with docker containers exclusive or run the ingestion service locally and the postgresql database
in docker. A **MUST THING** you have to do, is to set your personal **.env** file in two different places. Firstly, you have to set **.env** in the root git folder 
**/Data_Ingestion_Service** and then copy the same .env file to the root service folder **./api_service**. 

<img width="93" alt="ENV" src="https://user-images.githubusercontent.com/25862065/136756797-fbee9c61-7fe5-47d8-9ec5-9b21d4c1b1ac.png">


The .env file must have the same structure as follows:

```.env
PORT=3000
HOST=localhost
PGUSER=postgres
PGPASSWORD=1234
PGPORT=5432
PGHOST=db
PGDB=converge
```

### Run in Docker Containers
Let's begin with docker containers approach. There is a bash script named **start_services.sh** inside the **./Data_Ingestion_Service** folder which runs automatically two different containers.
You can type:

```npm
bash start_services.sh
```

The **PostgreSQL** container service is runnin in detached mode, so you will not see any logs in the terminal. The **Data Ingestion Service** container runs in the foreground, so you
will be able to see logs in your teminal.
The service is up and running in ***http://localhost:3000***.


### Run local
If you wish to run the service locally, firstly you have to install the dependencies as we told in the section [How to install](#how-to-install). Next, you have to start the **PostgreSQl** service again 
in the docker container. So go to the **/Data_Ingestion_Servoce** where you will find the **infrastructure.yml** file. Then typing the command:

```npm
sudo docker-compose -f infrastructure.yml up
```

will start the database service inside the container. After this, you have to enter the **/api_service** folder type the command:

```npm
npm start
```

Now you will in you terminal that the service is up and running in ***http://localhost:3000***.

<a name="arch"></a>
* ## Architecture
For this service, we could use a variety of databases like a time-series database like [**InfluxDB**](https://www.influxdata.com/) which is a very good solution when you work on time series applications.
In my case, I choose to use a [**PostgreSQL**](https://www.postgresql.org/) because I design my service with relationships between me entities.

<img width="656" alt="db" src="https://user-images.githubusercontent.com/25862065/136763551-f35aac65-8bda-4214-b478-40a93e0f407d.png">[DB Schema](#db_schema)

### HTTP Verbs
| HTTP METHOD | GET | PARAMS | PUT | BODY |
| ----------- | --- | ------ | --- | ---- |
| /data | Retrieve sensor data| ?sensor_id=1 <br /> ?sensor_id=1&time_until=20211007115923 <br /> ?sensor_id=2&time_until=1633950053400&time_since=1633950042904<br /> ?sensor_id=2&value_lt=102.0&time_until=1633950053400&time_since=1633950042904| Insert new sensor data | {<br/>"sensor_id": "1",<br />"time": 1633953094173, <br />"value": 1900.2 <br />} |
| /thresholds | Retrieve thresholds for a specific sensor| ?sensor_id=1 | Set MAX and MIN thresholds for a sensor | { <br />"sensor_id": "1",<br /> "threshold_max_value": 1120.1,<br /> "threshold_min_value": -1120.1<br /> } |
| /sensors | Retrieve all sensors |\- | \- | \- |


1. ### '/data' 

The incoming sensor data are being saved into the **sensor_data** table. Sensors send their values into the endpoint **'/data'** with a PUT request. If a packet body misses either sensor_id or time, 
then the service returns an error. A unique packet is distincted by the sensors_id and time params. So, in order to cut duplicate packets, I use the UNIQUE clause, which is offered by postgres, for 
sensor_id and time. So, if a sensor resend a packet, and the packet exists in database, the service will cut it.

For each sensor, a user can set a max and min threshold value for that sensor. In this version, there is no restriction in which
user has the right to adjust a threshold, but as we can see in database schema picture, the users has relationship with sensors in the table user_sensor, and in a newer version I will add this restriction.
But for now, we can assume that the user have the rights to set thresholds for a sensor.

The service calls two middleware functions before adding data to the database.The first middleware function is the one which is responsible for checking the sensor value with the thresholds that have been 
set for that specific sensor. If the current value which have just received, exceeds the max or the min threshold, the service calls the next middleware that starts to find which user has relation
with that sensor, and send him back a notification email. The notification email process was not built, so the middleware just prints in our console, the user IDs that will receive email.
After, the last middleware complete, pass the its turn to PUT request function that saves the data to our database.

If there is no user that has relation with that sensor, notifications will not be sent. In the case that a sensor has not been configured to have thresholds values, the process will just pass through the 2 middlewares 
and continue to the endpoint PUT request.


For this version, our service returns to every user the values requested data by sending a GET request to endpoint **'/data'**. As we can see our database in the above picture, we see that users have 
a relationship with sensors, which means that in a newer version I would add a restriction on which data a user can get. For now, you can get data for each sensor by sending the service a GET request
with params:

**REQUIRED**
* **sensor_id**:  The service gives data only for the sensor you ask for.

**OPTIONALLY**
* **time_since**: Retrieve data with a lower bound of date time.
* **time_until**: Retrieve data with a upper bound of date time.
* **value_lt**:   Retrieve data with a lower bound of value.
* **value_lgt**:  Retrieve data with a upper bound of value.

2. ### '/thresholds'
As we analyze in the above section a user can set thresholds for a specific sensor. Setting thresholds can be done by sending a PUT request to the '/thresholds' endpoint with body

```javascript
{
    "sensor_id": "1",
    "threshold_max_value": 1120.1,
    "threshold_min_value": -1120.1
}
```
All three paramaters are required in order to set a threshold. For each request the service will do an UPSERT function in to our postgresql database, so the request will insert a new threshold for that sensor if
it does not exists a previous one OR if threshold exists, it will update it. We use UPSERT option of postgres because it is protecting us from race conditions. Also, a user can send a GET request with required 
params the sensor_id, in order to retrieve the thresholds that have been set for that specific device.

3. ### '/sensors'
The user can also retrieves all the sensors that has our database by sending a GET request with no params in '/sensor' endpoint. For an updated version, as our system has relationships, a user would only retireve
the sensors that have been assigned to him. For now we just assume it.

4. ### Directory Structure

Our main file that starts our express server is server.js file that exists in the **/api_service** folder. All supported routes from our API are located in the **/api_service/routes** folder with their implementations being 
in the **index.js** files of each folder. Our *Router* is located in the **/api_service/routes** folder with the filename **index.js**. In this file I have implemented the api routes and controllers.

Moreover, in the **/api_service/routes** I have implemeted the **helpers.js** in which is responsible to ask for a database client in order to complete our requests. The database Pool is implemented in a different 
location, in the **/api_service/db_pool/pg_pool.js** file. This file is responsible for giving an availabe client to complete our work and then release him. We don't want to leave idle clients because our application
will crash. The file **helpers.js** which is located in **/api_service/db_pool** is structuring our sql queries with the assistance of the **schema.js** file that has information about our endpoints, tables, requiered 
and optional params. **/api_service/notifications** obviously holds the middleware functionality for our notifications and **/api_service/controls** is for the middleware that checks the thresholds for our sensors.

In the **/api_service/config** folder there is the **index.js** file that keeps our important information from our .env file. 

```javascript
const service = {
    port: process.env.PORT
};

var client_pg_host;
process.env.NODE_ENV === 'local' ? client_pg_host=process.env.HOST : client_pg_host=process.env.PGHOST;

const dbClient = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    host: client_pg_host,
    database: process.env.PGDB
};
```
Also, checks if the service runs in docker or locally and applies the approprieate value in our **host** variable. 

Finally, our tests have been involved in the **/api_service/test** directory. For this version, you have to run the tests by typing inside the **api_service** directory the command:

```
npm test
```

For a future update, I will make the tests run automatically, and if they end sucessfully, then start our service.

The postgres database is initialized by the script **init_table.sh** which is located in the **data_ingestion_service/databse** folder.


<a name="future"></a>
* ## Future Work

1. Complete the functionalities which I have mentioned in the previoues section, like users get data only from sensors that have relation.
2. If a new sensor starts sending data to our service, save them and also update the sensors table.
3. Maybe use an ORM language for our interaction with PostgreSQL, like **sequelize**. Now I have used the **pg** which is a raw driver for intergrating with postgres. It is much faster than an ORM but it is very time-consuming
to build queries and you have to build them in way that other teamates could also understand. ORMs is slower but safer, forces you to write MVC code, which, in the end, makes your code a little cleaner.
4. Build more tests for our API and automate them.
