/***************************************************************/
//VARIABLES
/***************************************************************/
//Users account variables
var uid = "place_holder";
var userEmail;
var authenticationListener;

//score managing variables
var userScore = 0; //this is the users base score in each game
const HTML_OUTPUT = document.getElementById("scores_survivorGame");
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

            //propmpts the datadbase to read other users highscores
            firebase.database().ref('/userInfo/players/' + uid + '/').once('value', updateUserStats);
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
        firebase.database().ref('/userInfo/players/' + uid + '/Score/').once('value', updateUserStats);
    }
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
    var dbData = snapshot.val();
    if (dbData == null) {
        console.log("There was no record when trying to read the message");
    } else {
        console.log("The full message is: " + dbData);
        HTML_OUTPUT.innerHTML = snapshot.val();
    }
}

//add user to the main databse when they login for the first time
function addUserToDatabase() {
    firebase.database().ref('/userInfo/players/' + uid + "/").set({
        Username: userName,
        Age: userAge,
        Email: userEmail,
        score_game_1: userScore,
        score_game_2: userScore,
    });
}

//update users score for game 1
function Savescore_game1(newScore) {
    //save the score in the game1 branch (TEST)
    firebase.database().ref('/game 1/' + uid + '/score/').set(newScore);

    //save the score in the userinfo branch
    console.log("test is the score coming through " + newScore)
    console.log(uid)
    //add new score to the Game specific branch
    firebase.database().ref('/game 1/' + uid + "/").set({
        Score: newScore,
        Username: userName,
    });
    //add new score to the userInfo
    firebase.database().ref('/userInfo/players/' + uid + "/score_game_1/").set(newScore);
}

//update users score for game 2
function Savescore_game2(newScore) {
    //save the score in the game1 branch (TEST)
    firebase.database().ref('/game 2/' + uid + '/score/').set(newScore);

    //save the score in the userinfo branch
    console.log("test is the score coming through " + newScore)
    console.log(uid)
    //add new score to the Game specific branch
    firebase.database().ref('/game 2/' + uid + "/").set({
        Score: newScore,
        Username: userName,
    });
    //add new score to the userInfo
    firebase.database().ref('/userInfo/players/' + uid + "/score_game_2/").set(newScore);
}
