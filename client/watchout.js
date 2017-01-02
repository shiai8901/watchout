// start slingin' some d3 here.

function solution() {

    // setup game
    var setup = {
        width: 750,
        height: 500,
        circleRadius: 15,
        padding: 30, 
        numEnemies: 30,
    };
    // setup scoreboard
    var scoreStatus = {
        currentScore: 0,
        highScore: 0,
        collision: 0
    };
    // set the default location for mouse
    var mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };
    // create player default location is in the center of board
    var player = d3.select('.mouse').style({top: mouse.y + "px", left: mouse.x + "px"});

    // setup the area behind board
    var boardbackground = d3.select('.board').style({
        width: setup.width + 60 + "px",
        height: setup.height + 200 + "px",
        "margin-top": "100px",
        "margin-left": "200px",
    });

    // setup board
    var board = d3.select('.board').append('svg').style({
        width: setup.width + "px",
        height: setup.height + "px",
        "margin-left": "30px",
        "margin-top": "170px"
    });  

    // setup scoreboard
    var scoreboard = d3.select('.scoreboard').style({
        left: setup.width + "px"
    });
    // update scores
    function updateScore() {
        d3.select('.highscore').select('span').text(scoreStatus.highScore);
        d3.select('.current').select('span').text(scoreStatus.currentScore);
        d3.select('.collisions').select('span').text(scoreStatus.collision);
    };

    // set the boundry for player and enemies
    var minX = board.attr("margin-left") + 15;
    var maxX = board.attr("margin-left") + setup.width - 15;
    function setX(x) {
        if (x < minX) return minX + 225;
        if (x > maxX) return maxX + 225;
        return x + 225;
    };
    var minY = board.attr("margin-top") + 15;
    var maxY = board.attr("margin-top") + setup.height - 15;
    function setY(y) {
        if (y < minY) return minY + 255;
        if (y > maxY) return maxY + 255;
        return y + 255;
    }

    // track mousemove
    board.on('mousemove', function() {
        var loc = d3.mouse(this); // returned as a two-element array of numbers [x, y]
        mouse = {x: loc[0], y: loc[1]};     
        d3.select('.mouse').style({top: setY(mouse.y) + "px", left: setX(mouse.x) + "px"});
    });

    // create enemies
    var randX = function() {
        return setX(setup.width * Math.random());
    }
    var randY = function() {
        return setY(setup.height * Math.random());
    }
    var enemies = d3.select('.board').selectAll('.enemy')
                       .data(d3.range(setup.numEnemies)) 
                       .enter().append('div')
                       .attr('class', 'enemy')
                       .style({top: randY() + "px",
                           left: randX() + "px"});
    // enemies move to random places
    function move(element) {
        element.transition().duration(1500).ease('cubic-in-out').style({
            top: randY() + "px",
            left: randX() + "px",
        }).each('end', function() {
            move(d3.select(this));
        });
    };
    move(enemies);

    // scores ticker
    function scoreTicker() {
        scoreStatus.currentScore += 1;
        scoreStatus.highScore = Math.max(scoreStatus.currentScore, scoreStatus.highScore);
        updateScore();
    }
    setInterval(scoreTicker, 100);

    // check collision
    var prevCollision = false;
    function checkCollision() {
        var hasCollision = false;
        // if player and any one enemy has collision
        enemies.each(function(d,i) {
            var enemyX = d3.select(this).style("top"); // it's a string, with 'px'
            var ex = +enemyX.substring(0, enemyX.length - 2); // enemy's top value
            var playerX = d3.select('.mouse').style("top");
            var px = +playerX.substring(0, playerX.length - 2); // player's top value
            var enemyY = d3.select(this).style("left");
            var ey = +enemyY.substring(0, enemyY.length - 2); // enemy's left value
            var playerY = d3.select('.mouse').style("left");
            var py = +playerY.substring(0, playerY.length - 2); // player's left value
            var distanceY = Math.pow(Math.abs(px - ex), 2);
            var distanceX = Math.pow(Math.abs(py - ey), 2);
            var sumPow = Math.pow((setup.circleRadius * 2), 2);
            console.log(distanceY);
            console.log(sumPow);
            // if the distance between 2 circle centers < the sum of their radius, they have collision
            if (distanceX + distanceY < sumPow) {
                hasCollision = true;
            }
        });

        if (hasCollision) {
            // currentScore reset to 0
            scoreStatus.currentScore = 0;
            board.style("background-color","red");
            // collision increases
            if (prevCollision !== hasCollision) {
                scoreStatus.collision += 1;
            }
            // reset the check
        } else {
            board.style("background-color", "#222");
        }
        prevCollision = hasCollision;
    };
    d3.timer(checkCollision);

};

solution();