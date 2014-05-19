var Game = function() {

  this.monies = 0;
  this.moneyRatePerClick = 1;
  this.moneyRatePerSecond = 0;
  
    this.mpcNames = ['Time Management Course', 'Better Equipment', 'Assistant'];
    this.mpsNames = ['Taco Truck', 'Farm', 'Factory'];
    this.mpcPrices = [10, 1000, 100000];
    this.mpsPrices = [100, 5000, 250000];
    this.mpcCount = [0, 0, 0];
    this.mpsCount = [0, 0, 0];
  
  // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  
  // Restart the onFrame loop
    this.lastFrame = +new Date() / 1000;
    requestAnimFrame(this.onFrame);
};
Game.prototype.onFrame = function() {

    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;
  
  this.monies += this.moneyRatePerSecond*delta;
  //document.title = ""+Math.round(this.monies);
  //console.log(this.currentMoney());
  
  $("span#currentMoney").html(this.currentMoney());
  
    // Request next frame.
    requestAnimFrame(this.onFrame);
};
Game.prototype.currentMoney = function() {
    return Math.round(this.monies);
};
Game.prototype.moneyClick = function(clicks) { this.monies += this.moneyRatePerClick * clicks; };
Game.prototype.buyUpgrade = function(type, tier) {
    var price;
    if (type == 'mpc')
    {
        // Check wallet
        price = this.mpcPrices[tier];
        if (this.monies >= price)
        {
            // Purchase item
            this.monies -= price;
            this.mpcCount[tier]++;
            this.mpcUpdate();
            
            // Reset price
            this.mpcPrices[tier] = tier * 1000 + Math.floor(10 * Math.pow(1.1, this.mpcCount[tier]));
            price = this.mpcPrices[tier];
            $("span#mpcUpgradePrice" + tier).html(price);
            updateCount("mpcUpgradeCount" + tier, this.mpcCount[tier]);
        }
    }
    else if (type == 'mps')
    {
        // Check wallet
        price = this.mpsPrices[tier];
        if (this.monies >= price)
        {
            // Purchase item
            this.monies -= price;
            this.mpsCount[tier]++;
            this.mpsUpdate();
            
            // Reset price
            this.mpsPrices[tier] = 100 + tier * 5000 + Math.floor(10 * Math.pow(1.2, this.mpsCount[tier]));
            price = this.mpsPrices[tier];
            
            $("span#mpsUpgradePrice" + tier).html(price);
            updateCount("mpsUpgradeCount" + tier, this.mpsCount[tier]);
        }
    }
};
Game.prototype.mpcUpdate = function() {
    var mpc = 1;
    var multi = 1;
    for (var i = 0; i < this.mpcNames.length; i++)
    {
        mpc += this.mpcCount[i] * multi;
        multi *= 10;
    }
    this.moneyRatePerClick = mpc;
};
Game.prototype.mpsUpdate = function() {
    var mps = 0;
    var multi = 1;
    for (var i = 0; i < this.mpsNames.length; i++)
    {
        mps += this.mpsCount[i] * multi;
        multi *= 10;
    }
    this.moneyRatePerSecond = mps;
};

/**
   * Cross browser RequestAnimationFrame
   */
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

var gameInstance = new Game();

var buyUpgrades = (function(obj) { gameInstance.buyUpgrade(obj.data.type, obj.data.tier); });

function updateCount(id, number) {
    $("span#" + id).html(number);
}

//Once per Upgrade
for (var i = 0; i < gameInstance.mpcNames.length; i++)
{
    //Button Names
    $("span#mpcUpgradeLabel" + i).html(gameInstance.mpcNames[i]);
    $("span#mpsUpgradeLabel" + i).html(gameInstance.mpsNames[i]);
    $("span#mpcUpgradePrice" + i).html(gameInstance.mpcPrices[i]);
    $("span#mpsUpgradePrice" + i).html(gameInstance.mpsPrices[i]);
    
    //Event Binding
    $("button#mpcUpgrade" + i).click({type: 'mpc', tier: i}, buyUpgrades);
    $("button#mpsUpgrade" + i).click({type: 'mps', tier: i}, buyUpgrades);
}
// Events
$("button#clickMoney").click(function() { gameInstance.moneyClick(1) });