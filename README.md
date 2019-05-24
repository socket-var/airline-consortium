## Steps to run the project:


- Download the latest binaries for Node.js and MongoDB.
- Create a database in MongoDB and call it `ask_db`.
- Add a database owner account using the following snippet:

```javascript
db.createUser({
  user: "ask_admin",
  pwd: "your password here",
  roles: [{ role: "dbOwner", db: "ask_db" }],
  passwordDigestor: "server"
});
```

- Install truffle using `npm install -g truffle` and install Ganache binary or CLI.
- Start the ganache process using CLI or open Ganache GUI, this will start the ganache private network process.
- Open a terminal and cd into the truffle-build directory and type `truffle compile` to compile the smart contract. Then type truffle migrate to deploy the smart contract on ganache.
- Create a .env file in the root of the project. Add the following variables in the .env file:
  
  ```javascript
  DB_URL="mongodb://<username>:<password>@localhost:27017/<db_name>"
  CONTRACT_ADDRESS="<contract address>"
  BC_HOST_URL="http://localhost:7545"
  ```

- Go to the terminal cd into the project root and type `npm install`.

- Once all the dependencies are installed type `npm run dev-test-run`
- Open the browser and type [http://localhost:8000](http://localhost:8000)


# Screens:

## <u>Signup Page:</u>

### Passenger Signup:
![](./screens/register_passenger.PNG)

### Airline Signup:
![](./screens/register_airline.PNG)

## <u>Login Page:</u>

![](./screens/login_airline.PNG)

## <u>User Landing Page:</u>

### Airline Landing Page:
![](./screens/airline_dashboard.PNG)

### Passenger Landing Page:
![](./screens/passenger_dashboard.PNG)

## <u>Passenger Purchases Page:</u>

![](./screens/purchases.PNG)

## <u>Airline pending requests page:</u>

### Airline sending request to other airline:
![](./screens/handle_request.PNG)

### Airline sending response to passenger:
![](./screens/handle_response.PNG)

## <u>Transactions page:</u>

![](./screens/transactions.PNG)
