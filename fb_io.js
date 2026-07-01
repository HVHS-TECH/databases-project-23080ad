/***************************************************************/
//VARIABLES
/***************************************************************/
//Users account variables
var uid = "place_holder";
var userEmail;
var authenticationListener;

//score managing variables
var userScore = 0; //this is the users base score in each game
/***************************************************************/

//checks that all user data has been filled out before allowing login
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
    const htmlOutput = document.getElementById("scores_survivorGame");

    if (!htmlOutput) {
        console.error("Html_output is blank");
        return;
    }

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
    const dbData = snapshot.val();
    if (dbData == null) {
        console.log("No record found");
    } else {
        //convert the db output into a string. Null keeps all values the same.
        // 2 creates indentation for easy reading.
        htmlOutput.textContent = JSON.stringify(dbData, null, 2);
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

//update users score for game 1
function Savescore_game1(newScore) {
    //save the score in the game 1 branch
    firebase.database().ref('/game 1/' + uid + '/').update({
        score: newScore,
        Username: userName,
    });;

    //save the score in the userinfo branch
    console.log("test is the score coming through " + newScore)
    console.log(uid)
    
    //add new score to the userInfo
    firebase.database().ref('/userInfo/players/' + uid + "/score_game_1/").set(newScore);
}

//update users score for game 2
function Savescore_game2(newScore) {
    //save the score in the game 2 branch
    firebase.database().ref('/game 2/' + uid + '/').update({
        score: newScore,
        Username: userName,
    });;

    //save the score in the userinfo branch
    console.log("test is the score coming through " + newScore)
    console.log(uid)

    //add new score to the userInfo
    firebase.database().ref('/userInfo/players/' + uid + "/score_game_2/").update(newScore);
}

//display the current highscore
function fb_displayAllHighScores(snapshot) {
    let highScores = snapshot.forEach(fb_showOneScore);
}

//iterate through every score
function fb_showOneScore(child) {
    console.log(child.key + " got " + child.val() + " points");
}

readDataBaseScoresGame_1();
