/*******************************************************/
// P5.play: A simple game
// 
// This game can be used as an extra game for the 12COMP
// and 13COMP Databases assessments
//
// Written by Mr Britton
/*******************************************************/
console.log("Running the game");

//keep this outside of all functions! it needs to be global -- added in firebase project
var uid;


// End game code
function endGame(_player, _obstacle) {
    console.log("Game ended, you got " + score + " points.")
    screenSelector = "end";
    player.remove();
    obstacles.removeAll();
    
    // Put your database writes here:
    

    if (!uid || uid.uid) {
        console.log("you must log in to save scores")
    } else {
        console.log("final score game 1: " + score);
        window.parent.Savescore_game1(score);
    }
}

//added for login on all pages
function checkLoginData() {
    userAge = document.getElementById("userAge").value;
    userName = document.getElementById("userName").value;
    if (userName == "" || userAge == "") {
        //checks if they are a returning user or simply failed to fillout all fields
        returningUser();
    } else {
        fb_authenticate();
    }

}

function fb_authenticate() {
    console.log("Logging in")
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("Logged in")
            console.log(user)
            // User is signed in, see docs for a list of avaliable properties
            // https://firebase.google.com/docs/refrence/js/firebase.User
            uid = user.uid;
            userEmail = user.email;
            console.log(userEmail);

        } else {
            console.log("Not logged in")
            // User is signed out
            // Using a popup.
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Google Access Token.
                var token = result.credential.accessToken;
                // The signed in user info.
                var user = result.user;
                uid = user.uid;
                userEmail = user.email;
            });
        }

        //propmpts the datadbase to read other users highscores
        readDataBaseScoresGame_1();
    });
}

//checks if the user has logged in before or is simply trying to enter a null account
function returningUser() {
    console.log("returning user detected")

    //if the user isnt logged in and they arent registered prompt them to sign up
    if (uid == "place_holder") {
        alert("please fill out all fields before registering or signing up!");
    } else {
        console.log("returning user detected!");
        //read the scores for game 1
        readDataBaseScoresGame_1();
    }
}

//read the scores from the database for each player in game 1
function readDataBaseScoresGame_1() {
    firebase.database().ref('/game 1/').orderByChild('score').once('value', updateUserStats, fb_displayAllHighScores);
}

//fills out the users details and displays them
function updateUserStats(snapshot) {

    //check if the user is too young to play and logs them in otherwise
    if (userAge <= 15) {
        alert("You are too young to be here! \n You must be at least 16 to use this site")
    } else {
        //fill in the table with the users details
        document.getElementById("userAge_id").innerHTML = userAge;
        document.getElementById("userName_id").innerHTML = userName;
        document.getElementById("userEmail_id").innerHTML = userEmail;

        //add the user top the database
        addUserToDatabase();
    }

    let users = snapshot.val();

    if (!users) {
        console.error("Html_output is blank");
        return;
    }

    let Leaderboard = Object.values(users);

    //sort from highest to lowest
    Leaderboard.sort((a, b) => b.score - a.score);

    let LeaderboardHTML = "<h2>Geodash leader board</h2>";

    for (let i = 0; i < Leaderboard.length; i++) {
        let user = Leaderboard[i];

        LeaderboardHTML +=
            "<p>" +
            (i + 1) +
            ". " +
            user.username +
            ": " +
            user.userscore +
            "</p>"
    }

    let LeaderboardDiv = document.getElementById("scores_Geodash");

    if (LeaderboardDiv) {
        LeaderboardDiv.innerHTML = LeaderboardHTML;
    }
}


//add user to the main databse when they login for the first time
function addUserToDatabase() {
    if (!uid || uid === "place_holder") {
        console.error("UID is not ready");
        return;
    }

    if (!userEmail) {
        console.error("Email is not ready");
        return;
    }

    firebase.database().ref('/userInfo/players/' + uid + "/").update({
        Username: userName,
        Age: userAge,
        Email: userEmail,
        score_game_1: userScore,
        score_game_2: userScore,
    });
}





























const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 200;
const PLAYER_HEIGHT = 25;
const PLAYER_WIDTH = 25;


const OBSTACLE_HEIGHT = PLAYER_HEIGHT;
const OBSTACLE_WIDTH = PLAYER_WIDTH;

var spawnDist = 0;
var nextSpawn = 0;
var score = 0;
var player;

var screenSelector = "start";

var obstacles;
/*******************************************************/
// setup()
/*******************************************************/
function setup() {
    cnv = new Canvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    obstacles = new Group();

    floor = new Sprite(SCREEN_WIDTH / 2, SCREEN_HEIGHT, SCREEN_WIDTH, 4, 's');
    floor.color = color("black");
    world.gravity.y = 80;

    document.addEventListener("keydown",
        function (event) {
            if (screenSelector == "start" || screenSelector == "end") {
                screenSelector = "game"
                resetGame();
            } else {
                if (player.y > 184) {// 184 - found from testing - floor level
                    player.vel.y = -20;
                }
            }
        });

}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {
    if (screenSelector == "game") {
        gameScreen();
    } else if (screenSelector == "end") {
        endScreen();
    } else if (screenSelector == "start") {
        startScreen();
    } else {
        text("wrong screen - you shouldnt get here", 50, 50);
        console.log("wrong screen - you shouldnt get here")
    }
}

function newObstacle() {
    obstacle = new Sprite((SCREEN_WIDTH + 50), SCREEN_HEIGHT - OBSTACLE_HEIGHT / 2, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, 'k');
    obstacle.color = color("yellow");
    obstacle.vel.x = -10;

    obstacles.add(obstacle);
}

// Main screen functions

function startScreen() {
    background("white");

    allSprites.visible = false;
    textSize(32);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text("Welcome to the game", 50, 50);
    textSize(24);
    text("Press any key to start", 50, 110); textSize(24);
    text("Press space to jump", 50, 150);
}

function gameScreen() {
    background("#C39BD3");
    allSprites.visible = true;
    score++;
    if (frameCount > nextSpawn) {
        newObstacle();
        nextSpawn = frameCount + random(10, 100);
    }
    textSize(32);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text(score, 50, 50);
}

function endScreen() {
    background("white");

    allSprites.visible = false;
    textSize(32);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text("You died! Too bad :-(", 50, 50);
    textSize(24);
    text("your score was: " + score, 50, 110);
    textSize(14);
    text("press any key to restart", 50, 150);
}

function resetGame() {
    player = new Sprite(PLAYER_WIDTH * 1.2, SCREEN_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT, 'd');
    player.color = color("purple");
    player.collides(obstacles, endGame);
    score = 0;
}

/*******************************************************/
//  END OF APP
/*******************************************************/
