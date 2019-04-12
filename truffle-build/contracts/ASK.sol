pragma solidity >=0.5.0;

contract ASK {
    // define the user structure
    struct Airline {
        // to make sure that the user is not registered during signup
        bool isRegistered;
        // chairperson, buyer, seller or buyer_and_seller
        bool isAdmin;
        // account balance
        uint balance;
    }

    address payable private chairperson;
    address payable contractAccount;
    
    // define a list of all users 
    mapping(address => Airline) private airlines;
    uint min_deposit;
     
    // modifiers
    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only chairperson can call this");
        _;
    }

    // airline
    modifier onlyAirline() {
        require(airlines[msg.sender].isAdmin == false, "Only an airline can call this" );
        _;
    }
    
    modifier onlyChairpersonOrSelf(address userAddress) {
        require(msg.sender == chairperson || msg.sender == userAddress, "Only chairperson or the target user can call this");
        _;
    }
    
    modifier onlyNewAirline(address newAirline) {
        require(airlines[newAirline].isRegistered == false, "Already a registered airline");
        _;
    }
    
    modifier onlyRegistered(address newAirline) {
        require(airlines[newAirline].isRegistered == true, "Not a registered airline");
        _;
    }
    
    
    constructor() public payable {
        contractAccount = address(this);
        min_deposit = 50 ether;
        chairperson = msg.sender;
        airlines[chairperson].isAdmin = true;
        airlines[chairperson].isRegistered = true;
    }
    
    /* Chairperson functions go here */
    
    // a view function that returns the balance of a particular user
    function balanceOf(address userAddress) public view onlyRegistered(userAddress) onlyChairpersonOrSelf(userAddress) returns(uint) {
        return airlines[userAddress].balance;
    }
   
    // called by the chairperson when a new user needs to be registered. A new user structure is added to the list of users and a deposit more like a "signup bonus" is added to user's account.
    function register() public payable onlyNewAirline(msg.sender) {
        require(msg.value >= min_deposit, "Your deposit must be greater than or equal to the minimum deposit");
        address payable newAirline = msg.sender;
        airlines[newAirline].isAdmin = false;
        airlines[newAirline].isRegistered = true;
        airlines[newAirline].balance = msg.value;
        
        contractAccount.transfer(msg.value);
    }
    
    // called when a user is to be unregistered, first the user's balance is transferred to the user and user's registration details are deleted 
    function unregister(address payable userAddress) public payable onlyChairperson onlyRegistered(userAddress){
        // if chairperson tries to unregister himself
        require(userAddress != msg.sender, "Cannot unregister yourself");
        
        userAddress.transfer(airlines[userAddress].balance);
        delete airlines[userAddress];
     
    }
    
    function settlePayment(address payable toAirline) public payable onlyAirline {
        toAirline.transfer(msg.value);
    }
    
    function request(address toAirline, uint256 orderHash) public onlyAirline returns(bool) {
        return true;
    }
    
    function response(address fromAirline, uint256 orderHash) public onlyAirline returns(bool) {
        return true;
    }
    
    function() payable external {
        
    }

}