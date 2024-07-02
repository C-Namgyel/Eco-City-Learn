// WORK ON SPLASH!!!


// Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as sref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBk4pb3kFfZ5TL92qRh3i0q4JzFq3WTok8",
  authDomain: "eco-city-learn.firebaseapp.com",
  databaseURL: "https://eco-city-learn-default-rtdb.firebaseio.com",
  projectId: "eco-city-learn",
  storageBucket: "eco-city-learn.appspot.com",
  messagingSenderId: "713992054385",
  appId: "1:713992054385:web:fcb0a45ba6a91393e11dd0",
  measurementId: "G-MN2EHJPD38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const database = getDatabase(app);
const storage = getStorage();

// Variables
var data;
var accountCreated = false;

// User
let username;
let email;
let pp;

// Auth
onAuthStateChanged(auth, (user) => {
    var user = auth.currentUser;
    if (user) {
        if (user.emailVerified) {
            get(child(ref(database), `users/${user.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    let val = snapshot.val();
                    username = val.username;
                    email = val.email;
                    pp = val.pp;
                    document.getElementById("profileName").innerHTML = username;
                    document.getElementById("profileEmail").innerHTML = email;
                    document.getElementById("profilePic").style.backgroundImage = `url("${pp}")`;
                    document.getElementById("splash").style.display = "none";
                    window.history.pushState({ page: 'home' }, '', '');
                    navs.push('home');
                } else {
                  console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });              
        } else {
            console.log('User email is not verified.');
            document.getElementById("splash").style.display = "none";
            document.getElementById("login").hidden = false;
            if (accountCreated == false) {
                user.delete();
            }
        }
    } else {
        console.log('User is signed out.');
        document.getElementById("splash").style.display = "none";
        document.getElementById("login").hidden = false;
        window.history.pushState({ page: 'login' }, '', '');
        navs.push('login');
    }
});
document.getElementById("googleAuth").onclick = function() {
    signInWithPopup(auth, googleProvider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user)
        // IdP data available using getAdditionalUserInfo(result)
        let div = createElement("div");
        div.style = "position: fixed; left: 0%; top: 0%; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.75); color: white; font-weight: bolder; font-size: 10vw; z-index: 10;";
        div.innerHTML = "Logging In"
        set(ref(database, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email,
            pp : user.photoURL
          })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.error(error)
        });
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
};
document.getElementById("emailAuth").onclick = function() {
    setAuthScrn('emailSignIn');
    window.history.pushState({ page: 'emailSignIn' }, '', '');
    navs.push('emailSignIn');
}
document.getElementById("SignUpBtn").onclick = function() {
    const registerUser = async (email, password) => {
        try {
            let userCredential = await createUserWithEmailAndPassword(auth, email, password);
            let user = userCredential.user;
            uploadBytes(sref(storage, `pp/${user.uid}/profilePicture`), pp).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                // Get the download URL
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    set(ref(database, 'users/' + user.uid), {
                        username: document.getElementById("SignUpUsername").value.trim(),
                        email: user.email,
                        pp: downloadURL
                    }).then(() => {
                        document.getElementById("covDiv").style.display = "grid";
                    })
                    .catch((error) => {
                        console.error(error)
                    });
                });
              });
            // Send verification email
            await sendEmailVerification(user);
        } catch (error) {
            console.error('Error creating user:', error.code);
            if ((error.code).includes("auth/email-already-in-use") == true) {
                snackbar("The email is already registered");
            } else if ((error.code).includes("auth/weak-password") == true) {
                snackbar("The password is too weak");
            } else {
                snackbar("Error. Try again")
            }

        }
    }
    if (document.getElementById("SignUpEmail").value.trim() != "" && document.getElementById("SignUpPassword").value.trim() != "" && document.getElementById("SignUpPasswordRe").value.trim() != "" && document.getElementById("SignUpUsername").value.trim()) {
        if (document.getElementById("SignUpPassword").value.trim() == document.getElementById("SignUpPasswordRe").value.trim()) {
            if (document.getElementById("SignUpProfileInp").files[0] != undefined) {
                accountCreated = true;
                registerUser(document.getElementById("SignUpEmail").value.trim(), document.getElementById("SignUpPassword").value.trim());
            } else {
                snackbar("Please upload a profile picture")
            }
        } else {
            snackbar("Passwords doesn't match");
        }
    } else {
        snackbar("Please fill up all the fields");
    }
}
document.getElementById("SignUpProfileInp").oninput = function() { // When import a profile pic
    document.getElementById("SignUpProfileText").innerHTML = "Loading";
    compressImg(this.files[0], 480, 480, function(res) {
        pp = res;
        document.getElementById("SignUpProfileText").innerHTML = "";
        document.getElementById("SignUpProfile").style.backgroundImage = `url("${URL.createObjectURL(res)}")`;
    })
}
document.getElementById("signInBtn").onclick = function() {
    if (document.getElementById("signInEmail").value.trim() != "" && document.getElementById("signInPassword").value.trim() != "") {
        signInWithEmailAndPassword(auth, document.getElementById("signInEmail").value.trim(), document.getElementById("signInPassword").value.trim())
        .then((userCredential) => {
            // User signed in successfully
            let user = userCredential.user;
            window.location.reload();
            // ...
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            // Handle errors
            console.log(errorCode)
            if (errorCode == "auth/invalid-email") {
                snackbar("Invalid Email");
            } else if (errorCode == "auth/invalid-credential") {
                snackbar("Incorrect Email or Password");
            } else {
                snackbar("Error. Try again");
            }
        });
    } else {
        snackbar("Please fill up all the fields")
    }
}
document.getElementById("signOut").onclick = function() {
    signOut(auth).then(() => {
        // Sign-out successful.
        window.location.reload();
    }).catch((error) => {
        // An error happened.
        console.log("Sign out error: ", error)
    });
}

// Load Data
fetch('data.json')
    .then(response => response.json())
    .then(dat => {
        // Now you can use your JSON data here
        data = dat;
        createList();
    })
    .catch(error => console.error('Error:', error));

// Menu
document.getElementById("menu").onclick = function() {
    menuOpen()
}
document.getElementById("menuBarrier").onclick = function() {
    menuClose();
}

// Navigation
for (let x of document.querySelectorAll(".navBtns")) {
    x.onclick = function() {
        if (x.getAttribute("disabled") == "false" || x.getAttribute("disabled") == undefined) {
            setScreen(x.getAttribute("value"));
            this.setAttribute("disabled", "true");
            this.style.backgroundColor = "lightgrey";
            for (let f of document.querySelectorAll(".navBtns")) {
                if (f != this) {
                    f.setAttribute("disabled", "false");
                    f.style.backgroundColor = "rgba(0, 0, 0, 0)";
                }
            }
            window.history.pushState({ page: `${x.getAttribute("value")}` }, '', '');
            navs.push(x.getAttribute("value"));
        }
    }
}

// Home
function createList() {
    let topics = Object.keys(data);
    for (let t of topics) {
        let div = document.createElement("div");
        div.className = "homeList";
        div.innerHTML = t;
        document.getElementById("homediv").appendChild(div);
    }
};

// Custom back;
function customBack(event) {
    event.preventDefault();
    navs.splice(navs.length - 1, 1);
    history.replaceState(null, null, window.location.href);
    if (navs[0] == undefined) {
        // Do nothing
    } else if (navs[navs.length - 1].includes("email")) {
        setAuthScrn(navs[navs.length - 1]);
    } else if (navs[navs.length - 1] == "login") {
        document.getElementById("emailSignUp").hidden = true;
        document.getElementById("emailSignIn").hidden = true;
        document.getElementById("login").hidden = false;
    } else {
        // document.getElementById(navs[navs.length - 1] + "Btn").click();
        setScreen(navs[navs.length - 1]);
        document.getElementById(navs[navs.length - 1] + "Btn").setAttribute("disabled", "true");
        document.getElementById(navs[navs.length - 1] + "Btn").style.backgroundColor = "lightgrey";
        for (let f of document.querySelectorAll(".navBtns")) {
            if (f != document.getElementById(navs[navs.length - 1] + "Btn")) {
                f.setAttribute("disabled", "false");
                f.style.backgroundColor = "rgba(0, 0, 0, 0)";
            }
        }
    }
}
window.addEventListener('popstate', customBack);