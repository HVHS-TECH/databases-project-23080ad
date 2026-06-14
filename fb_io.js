/***************************************************************/
//VARIABLES
/***************************************************************/
//Users account variables
var uid;
var userEmail;
var authenticationListener;

//score managing variables
var userScore = 5; //this is a test value for now
/***************************************************************/

//checks that all user data has been filled out before allowing login
function checkLoginData() {
    userAge = document.getElementById("userAge").value;
    userName = document.getElementById("userName").value;
    if (userName == null || userAge == null) {
        console.log("you must fillout all fields");
    } else {
        console.log(userAge);
        console.log(userName);
        fb_authenticate();
    }

}

//doesnt work as it says
// function fb_login() {
//     authenticationListener = firebase.auth().onAuthStateChanged(handleLogin);
// }

// function fb_logOut() {
//     authenticationListener();
//     firebase.auth.signOut();
//     console.log("logged out");
// }

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

            // ...
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
            });
        }
        //fill in the table with the users details
        document.getElementById("userAge_id").innerHTML = userAge;
        document.getElementById("userName_id").innerHTML = userName;
        document.getElementById("userEmail_id").innerHTML = userEmail;

        addUserToDatabase();
    });
}

//add user to the main databse when they login for the first time
function addUserToDatabase() {
    firebase.database().ref('/test_userInfo/players/' + uid + "/").set({
        Username: userName,
        Age: userAge,
        Email: userEmail,
        Score_game_1: userScore,
        Score_game_2: userScore,
    });

}


function notifyParent() {
    window.parent.writeScoreToDB("Hello!");


}