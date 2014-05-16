var Game = function() {

  this.monies = 0;
  this.moneyRatePerClick = 1;
  this.moneyRatePerSecond = 0;
  this.mpcUpgrades = ['Hire Employee', 'Buy Robots'];
  this.mpsUpgrades = ['Farm', 'Factory'];
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
  console.log(this.currentMoney());
  
  $("span#currentMoney").html(this.currentMoney());
  
    // Request next frame.
    requestAnimFrame(this.onFrame);
};
Game.prototype.currentMoney = function() {
    return Math.round(this.monies);
};
Game.prototype.moneyClick = function(clicks) {
    this.monies += this.moneyRatePerClick * clicks;
    console.log(this.moneyRatePerClick * clicks);
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

//Button Names
for (var i = 0; i < 2; i++)
{
    $("button#mpcUpgrade" + i).html("Buy " + gameInstance.mpcUpgrades[i]);
    $("button#mpsUpgrade" + i).html("Buy " + gameInstance.mpsUpgrades[i]);
}

// Events
$("button#clickMoney").click(function() { gameInstance.moneyClick(1) });