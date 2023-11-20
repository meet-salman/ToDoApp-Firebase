// Import Functions from firebase
import { auth, db, storage } from "./config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";


const userProfile = document.querySelector('#user-profile');
const loginModal = document.querySelector('#login_modal');
const signupModal = document.querySelector('#signup_modal');



// Getting SignUp elements
const signupForm = document.querySelector('#signup-form');
const name = document.querySelector('#name');
const signupEmail = document.querySelector('#signup-email');
const signupPassword = document.querySelector('#signup-password');
const confirmPassword = document.querySelector('#confirm-password');
let profilePic = document.querySelector('#profile-pic');
const signupError = document.querySelector('#signup-error');


// Getting SignIp elements
const signinForm = document.querySelector('#signin-form');
const signinEmail = document.querySelector('#signin-email');
const signinPassword = document.querySelector('#signin-password');
const signinError = document.querySelector('#signin-error');
const signupShort = document.querySelector('#signup-short');




// Check User Login or Logout
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log('User ID =>', uid);

        userProfile.innerHTML = `

            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-8 rounded-full">
                        <img src="./assets/user-icon.png" alt="profile-pic">
                    </div>
                </label>
                <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li><button id="logout-btn">Log Out</button></li>
                </ul>
            </div>
            `

        // Log Out Function
        const logoutBtn = document.querySelector('#logout-btn');

        logoutBtn.addEventListener('click', () => {

            signOut(auth).then(() => {
                // Sign-out successful.
                console.log('Sign-out successful.');

            }).catch((error) => {
                console.log(error);
                // An error happened.
            });
        });
    }
    else {
        console.log('User is signed out');

        userProfile.innerHTML = `

            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-8 rounded-full">
                        <img src="./assets/user-icon.png" alt="profile-pic">
                    </div>
                </label>
                <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li><button id="login-btn">Login</button></li>
                    <li><button id="register-btn">Register</button></li>
                </ul>
            </div>
            `

        // Open Login & Register Modal on Buttons Click

        const loginBtn = document.querySelector('#login-btn');
        const registerBtn = document.querySelector('#register-btn');

        loginBtn.addEventListener('click', () => {
            login_modal.showModal();
        });

        registerBtn.addEventListener('click', () => {
            signup_modal.showModal();
        });

        signupShort.addEventListener('click', () => {
            signup_modal.showModal();
        });
    }
});



// SignUp Function
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);

            signupModal.innerHTML = `
                <span class="loading loading-spinner loading-lg"></span>
            `

            // Upload profile picture
            profilePic = profilePic.files[0]
            const storageRef = ref(storage, name.value);

            uploadBytes(storageRef, profilePic).then(() => {

                // Getting profile picture URL
                getDownloadURL(storageRef).then((url) => {

                    // Add user to DB
                    addDoc(collection(db, "users"), {
                        name: name.value,
                        email: signupEmail.value,
                        uid: user.uid,
                        profilePic: url
                    })
                        .then(() => {
                            console.log("User added to db");
                            window.location = 'index.html'
                        })
                        .catch((rej) => {
                            console.log(rej);
                        });
                });
            });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
});


// SignIn Function
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, signinEmail.value, signinPassword.value)
        .then((userCredential) => {

            loginModal.innerHTML = `
            <span class="loading loading-spinner loading-lg"></span>

            `

            const user = userCredential.user;
            console.log(user);
            window.location = './index.html'
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
});



