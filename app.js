//JS for Twuber Auction Simulator

//Declaring Arrays to be used in auction
var sellers = [];
var buyers = [];
var allCosts = [];
var currentPrices = [];
var prices = [];
var uberPrices = [];

//Declaring Variables to be used in auction
var driverName;
var driverX; 
var driverY;
var mileCost;
var valueTime;
a = 0;

var riderName;
var riderX; 
var riderY;
var lengthTrip;
var timeTrip;

var newPrices;


//Running the Auction
document.getElementById('runAuction').onclick = function () {
    document.getElementById('auctionResults').innerHTML = '';
    allCosts = [];
    currentPrices = [];
    prices = [];
    uberPrices = [];
    var s = 0;
    var b = 0;


    //Setting Initial Pricing Based on Uber Pricing in San Fran
    for (i of buyers) {
        uberPrice = ((buyers[b].lengthTrip * 1.60) + 1.00 + 2.20);
        //Uber Price reflects a price per mile plus a price per minute wait (estimated at two minutes) plus the booking fee.
        uberPrices.push(uberPrice);
        b++;
    }

    console.log(uberPrices);
  
    //Calculating the Mileage Costs of Each Trip
    for (i of sellers) {
        let sellerXCoord = sellers[s].xcoord;
        let sellerYCoord = sellers[s].ycoord;
        let mileCost = sellers[s].mileCost;
        let personalCosts = [];

        var b = 0;

        for (i of buyers) {
            const buyerXCoord = buyers[b].xcoord;
            const buyerYCoord = buyers[b].ycoord;
            const lengthTrip = buyers[b].lengthTrip
            const timeTrip = buyers[b].timeTrip

            const distanceToStart = Math.abs(sellerXCoord - buyerXCoord) + Math.abs(sellerYCoord - buyerYCoord);
            const totalDistance = distanceToStart + lengthTrip;
            const mileageCost = totalDistance * mileCost;
            personalCosts.push({'mileageCost' : mileageCost, 'timeCost' : timeTrip,});
            b++;
        }

        allCosts.push(personalCosts);
        s++;
    }

    //Declaring New Prices for the first round so that it can be used in the while statement. Henceforth will be updated by bidding
    a = 0;
    console.log(prices);
    prices = [];
    previousPrices = [];
    currentPrices = uberPrices;
    console.log(prices);
    console.log(uberPrices);
    prices.push(uberPrices);
    console.log(prices);
    roundCounter = 0;
    fun = [];
    delayedRoundCounter = -1;
    f = 0;
    checkForMultipleDrivers = [];
    checkForMultipleDrivers2 = [];
    //This is the Portion that needs to be repeated???
    
    var runAuction = function() {
        
        if (a == buyers.length) {
            console.log(currentPrices);
        } else {
            a = 0;
            console.log('LoopTimer')
            s = 0;
            bidArray = [];
        
            fullProfitabiity = [];
            //Using All Costs and Base Price to Determine Which to Bid On
            //Think about changing the array to hold both mileageCost and 'time costs' so as to create profit based on those two
            for (i of sellers) {
                personalCosts = allCosts[s];
                profitabilityMatrix = [];
                sortableProfitability = [];
                b = 0;
                
                for (i of buyers) {
                    tripCosts = personalCosts[b];
                    var mileageCost = tripCosts.mileageCost;
                    var timeCost = tripCosts.timeCost;
                    var currentPrice = currentPrices[b];
                    //Insert Uber Pricing Thingy here//
                    var rateOfPay = ((currentPrice - mileageCost)/timeCost);
        
                    profitabilityMatrix.push(rateOfPay);
                    sortableProfitability.push(rateOfPay);
                    b++;
                }
                
                /*profitabilityMatrix.push({'rateOfPay' : sellers[s].valueTime});
                sortableProfitability.push(sellers[s].valueTime);*/

                //Taking the PayArray and Setting a Bid
                arrangedMatrix = sortableProfitability.sort(function(a,b) {return a - b})
                bestProfit = parseFloat(arrangedMatrix.slice(-1));
                secondProfit = parseFloat(arrangedMatrix.slice(-2));
        
        
                function bidding (bid) {
                    return bid == bestProfit;
                }
        
                bidChoice = profitabilityMatrix.findIndex(bidding);
                //Solving for Error where Index is negative (located from the back)
                if (bidChoice < 0) {
                    bidChoice = bidChoice + profitabilityMatrix.length;
                }
                
                //Only pushes to the array if the bid is above minimum rate
                if (bestProfit > sellers[s].valueTime) {
                    rideCosts = allCosts[s][bidChoice]
                    opportunityCost = secondProfit * rideCosts.timeCost + rideCosts.mileageCost;
                    bidArray.push({'bidChoice' : bidChoice, 'bidPrice': opportunityCost,});
                } else {
                    bidArray.push('No Bid')
                }
                
                s++;
        
                // Just for tracking Purposes
                fullProfitabiity.push(profitabilityMatrix)
            }
        
            //Changing Prices Based on Bid Assortment (or exiting the function and displaying the results) will have to loop through Bid function
                //Creates the properly sized array
            bids = [];
            counter = 0;
            for (i of buyers) {
                bids.push([buyer.uberPrice(buyers[counter].lengthTrip)],);
                counter++;
            }
                //Adds the bids to the proper ride to represent number of bids for each ride
            counter = 0;
            for (i of bidArray) {
                bidDescription = bidArray[counter];
                
                if (bidDescription != 'No Bid') {
                    bidPrice = bidDescription.bidPrice;
                    rideBidded = bidDescription.bidChoice;
                    currentBidStatus = bids[rideBidded]
                    currentBidStatus.push(bidPrice)
                    bids[rideBidded] = currentBidStatus;
                }

                counter++;
            }
        
                //Reduction in Price if more than one bid for that ride.
            newPrices = currentPrices;
            const fun = currentPrices;
            console.log(fun);
            counter = 0;
            for (i of bids) {
                selectedRide = bids[counter]
                sortSelectedRide = selectedRide.sort(function (a, b) {return a - b});
                if (sortSelectedRide[1] != undefined) {
                    if (newPrices[counter] > sortSelectedRide[1]) {
                        newPrice = sortSelectedRide[1];
                        
                        if (sortSelectedRide.length >= 3) {
                            newPrice = newPrice - .24; 
                        } else {
                            a++;
                        }

                        newPrice = Math.round(newPrice*100)/100;
                        newPrices[counter] = newPrice;
                } else {
                    a++;
                }
            } else {
                    a++;
                }
                previousPrices = fun;
                counter++;
            }
            prices.push(newPrices);
            console.log(newPrices);
            roundCounter++;
            delayedRoundCounter++;
            f++;
            console.log(a);
            
            for (bids in bidArray) {
                if (bidArray[bids].bidChoice != "No Bid") {
                    bidNumber = bidArray[bids].bidChoice;
                    checkForMultipleDrivers.push(bidNumber);
                }
             }   

            checkForMultipleDrivers2 = new Set(checkForMultipleDrivers);
            
            runAuction();    
        }
    }

    runAuction();

    console.log('Final Prices', prices);

    displayTripData();
}



var displayTripData = function () {
    for (bidder in bidArray) {
        bidDescription = bidArray[bidder]; 
        if (bidDescription != 'No Bid') {
            driverName = sellers[bidder].name;
            riderName = buyers[bidArray[bidder].bidChoice].name;
            ridePrice = Math.round(bidArray[bidder].bidPrice*100)/100;

            completeRideInfo = `${riderName} will receive a ride from ${driverName} for a price of $${ridePrice}.`;
            
            
        } else {
            driverName = sellers[bidder].name;
            completeRideInfo = `There are no rides that fit ${driverName}'s criteria at this time.`
        }

        auctionResults = document.getElementById('auctionResults');
        rideResults = document.createElement('li');
        auctionResults.insertAdjacentElement('beforeend', rideResults);
        rideResults.innerHTML = completeRideInfo;
        rideResults.style.padding = '1vh';
        rideResults.style.textAlign = 'left';
    }
    if (buyers.length > sellers.length) {
        counter = 0;
        for (i of bids) {
            if (bids[counter].length == 1) {
                uberPrice = bids[ride];
                riderName = buyers[ride].name;
                completeRideInfo = `There are no drivers available at this time for ${riderName}. Their best option is to take an Uber for $${uberPrice}.`
                auctionResults = document.getElementById('auctionResults');
                rideResults = document.createElement('li');
                auctionResults.insertAdjacentElement('beforeend', rideResults);
                rideResults.innerHTML = completeRideInfo;
                rideResults.style.padding = '1vh';
                rideResults.style.textAlign = 'left';
            }
            counter++;
        }
    }
}
    

// Function to append a single driver to the array
var seller = {
    appendAuction: function (driverName, driverX, driverY, mileCost, valueTime) {
        var a = {'name' : driverName, 'xcoord' : driverX, 'ycoord' : driverY, 'mileCost': mileCost, 'valueTime': valueTime};
        const newDriver = sellers.push(a);
        newDriver;
    }
}

//Function to append a single rider to the array
var buyer = {
    appendAuction: function (riderName, riderX, riderY, lengthTrip, timeTrip) {
        var a = {'name' : riderName, 'xcoord' : riderX, 'ycoord' : riderY, 'lengthTrip': lengthTrip, 'timeTrip': timeTrip};
        const newRider = buyers.push(a);
        newRider;
    },
    uberPrice: function (lengthTrip) {
        var uberPrice = ((lengthTrip * 1.60) + 1.00 + 2.20);
        return uberPrice;
    }
}





//Add Drivers
document.getElementById('addDriver').onclick = function(e) {
    e.preventDefault();
    const addDriver = document.forms['drivers'];
    driverName = addDriver.querySelector('input[name="name"]').value;
    driverX = parseFloat(addDriver.querySelector('input[name="xLocation"]').value); 
    driverY = parseFloat(addDriver.querySelector('input[name="yLocation"]').value);
    mileCost = parseFloat(addDriver.querySelector('input[name="costMile"]').value);
    valueTime = parseFloat(addDriver.querySelector('input[name="costTime"]').value);

    //Append to the Array

    //Display Information in List
    const existingDriver = document.getElementById('existingDriver')
    existingDriver.style.display = 'block';
    const existingDrivers = document.getElementById('existingDrivers');
    const driverContainer = document.createElement('div');
    existingDrivers.insertAdjacentElement("beforeend", driverContainer);
    driverContainer.classList.add('container', 'sellers');
    
    //Variable for Template for Readable ID Tags for Auction
    var driverNumber = `driver${document.getElementsByClassName('sellers').length}`;

    //Name
    const names = document.createElement('div');
    names.id = `${driverNumber}-name`;
    driverContainer.insertAdjacentElement("beforeend", names);
    document.getElementById(`${driverNumber}-name`).innerHTML = driverName;
    names.classList.add('item');

    //X-Coord
    const xs = document.createElement('div');
    xs.id = `${driverNumber}-x`;
    driverContainer.insertAdjacentElement("beforeend", xs);
    document.getElementById(`${driverNumber}-x`).innerHTML = driverX;
    xs.classList.add('item');

    const ys = document.createElement('div');
    ys.id = `${driverNumber}-y`;
    driverContainer.insertAdjacentElement("beforeend", ys);
    document.getElementById(`${driverNumber}-y`).innerHTML = driverY;
    ys.classList.add('item');

    const miles = document.createElement('div');
    miles.id = `${driverNumber}-mile`;
    driverContainer.insertAdjacentElement("beforeend", miles);
    document.getElementById(`${driverNumber}-mile`).innerHTML = mileCost;
    miles.classList.add('item');
    
    const time = document.createElement('div');
    time.id = `${driverNumber}-time`;
    driverContainer.insertAdjacentElement("beforeend", time);
    document.getElementById(`${driverNumber}-time`).innerHTML = valueTime;
    time.classList.add('item');

    seller.appendAuction(driverName, driverX, driverY, mileCost, valueTime);
}

//Sample Drivers
document.getElementById('sampleDrivers').onclick = function() {
    document.getElementById('existingDrivers').innerHTML = '';
    sellers = [
        {name: 'Ronald', xcoord: 4, ycoord: 5, mileCost: 0.2, valueTime: .5},
        {name: 'Chris', xcoord: 3, ycoord: 2, mileCost: 0.3, valueTime: .35},
        {name: 'Rion', xcoord: 2, ycoord: 1, mileCost: 0.6, valueTime: .4}
    ]

    const existingDriverBox = document.getElementById('existingDriver');
    existingDriverBox.style.display = 'block';
    const existingDrivers = document.getElementById('existingDrivers');

    var counter = 0;

    for (i of sellers) {
        const driverContainer = document.createElement('div');
        existingDrivers.insertAdjacentElement("beforeend", driverContainer);
        driverContainer.classList.add('container', 'sellers');

        const names = document.createElement('div');
        driverContainer.insertAdjacentElement('beforeend', names);
        names.innerHTML = sellers[counter].name;
        names.classList.add('item');

        const xC = document.createElement('div');
        driverContainer.insertAdjacentElement('beforeend', xC);
        xC.innerHTML = sellers[counter].xcoord;
        xC.classList.add('item');

        const yC = document.createElement('div');
        driverContainer.insertAdjacentElement('beforeend', yC);
        yC.innerHTML = sellers[counter].ycoord;
        yC.classList.add('item');

        const mC = document.createElement('div');
        driverContainer.insertAdjacentElement('beforeend', mC);
        mC.innerHTML = sellers[counter].mileCost;
        mC.classList.add('item');

        const vT = document.createElement('div');
        driverContainer.insertAdjacentElement('beforeend', vT);
        vT.innerHTML = sellers[counter].valueTime;
        vT.classList.add('item');

        counter++;
    }

}


//Add Riders
document.getElementById('addRider').onclick = function(e) {
    e.preventDefault();
    const addRider = document.forms['riders'];
    let riderName = addRider.querySelector('input[name="name"]').value;
    let riderX = parseFloat(addRider.querySelector('input[name="xLocation"]').value); 
    let riderY = parseFloat(addRider.querySelector('input[name="yLocation"]').value);
    let lengthTrip = parseFloat(addRider.querySelector('input[name="lengthTrip"]').value);
    let timeTrip = parseFloat(addRider.querySelector('input[name="timeTrip"]').value);

    //Append Info to List
    const existingRider= document.getElementById('existingRider')
    existingRider.style.display = 'block';
    const existingRiders = document.getElementById('existingRiders');
    const riderContainer = document.createElement('div');
    existingRiders.insertAdjacentElement("beforeend", riderContainer);
    riderContainer.classList.add('container', 'buyers');
    
    //Variable for Template for Readable ID Tags for Auction
    var riderNumber = `rider${document.getElementsByClassName('buyers').length}`;

    //Name
    const names = document.createElement('div');
    names.id = `${riderNumber}-name`;
    riderContainer.insertAdjacentElement("beforeend", names);
    document.getElementById(`${riderNumber}-name`).innerHTML = riderName;
    names.classList.add('item');

    //X-Coord
    const xs = document.createElement('div');
    xs.id = `${riderNumber}-x`;
    riderContainer.insertAdjacentElement("beforeend", xs);
    document.getElementById(`${riderNumber}-x`).innerHTML = riderX;
    xs.classList.add('item');

    //Y-Coord
    const ys = document.createElement('div');
    ys.id = `${riderNumber}-y`;
    riderContainer.insertAdjacentElement("beforeend", ys);
    document.getElementById(`${riderNumber}-y`).innerHTML = riderY;
    ys.classList.add('item');

    //Trip Length
    const lengths = document.createElement('div');
    lengths.id = `${riderNumber}-length`;
    riderContainer.insertAdjacentElement("beforeend", lengths);
    document.getElementById(`${riderNumber}-length`).innerHTML = lengthTrip;
    lengths.classList.add('item');
    
    //Trip Time
    const time = document.createElement('div');
    time.id = `${riderNumber}-time`;
    riderContainer.insertAdjacentElement("beforeend", time);
    document.getElementById(`${riderNumber}-time`).innerHTML = timeTrip;
    time.classList.add('item');

    buyer.appendAuction(riderName, riderX, riderY, lengthTrip, timeTrip);
}

//Sample Riders
document.getElementById('sampleRiders').onclick = function() {
    document.getElementById('existingRiders').innerHTML = '';
    buyers = [
        {name: 'Richie', xcoord: 3, ycoord: 2, lengthTrip: 5, timeTrip: 12},
        {name: 'Gina', xcoord: 1, ycoord: 1, lengthTrip: 10, timeTrip: 12},
        {name: 'Sam', xcoord: 5, ycoord: 7, lengthTrip: 20, timeTrip: 15}
    ]

    const existingRiderBox = document.getElementById('existingRider');
    existingRiderBox.style.display = 'block';
    const existingRiders = document.getElementById('existingRiders');

    var counter = 0;
    
    for (i in buyers) {
        const riderContainer = document.createElement('div');
        existingRiders.insertAdjacentElement("beforeend", riderContainer);
        riderContainer.classList.add('container', 'buyers');

        const names = document.createElement('div');
        riderContainer.insertAdjacentElement('beforeend', names);
        names.innerHTML = buyers[counter].name;
        names.classList.add('item');

        const xC = document.createElement('div');
        riderContainer.insertAdjacentElement('beforeend', xC);
        xC.innerHTML = buyers[counter].xcoord;
        xC.classList.add('item');

        const yC = document.createElement('div');
        riderContainer.insertAdjacentElement('beforeend', yC);
        yC.innerHTML = buyers[counter].ycoord;
        yC.classList.add('item');

        const lT = document.createElement('div');
        riderContainer.insertAdjacentElement('beforeend', lT);
        lT.innerHTML = buyers[counter].lengthTrip;
        lT.classList.add('item');

        const tT = document.createElement('div');
        riderContainer.insertAdjacentElement('beforeend', tT);
        tT.innerHTML = buyers[counter].timeTrip;
        tT.classList.add('item');

        counter++;
    }
}

//Clear Drivers
document.getElementById('clearDrivers').onclick = function () {
    document.getElementById('existingDrivers').innerHTML = '';
    sellers = [];
}

//Clear Riders
document.getElementById('clearRiders').onclick = function () {
    document.getElementById('existingRiders').innerHTML = '';
    buyers = [];
}
