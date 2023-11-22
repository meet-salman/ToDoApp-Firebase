// Import Functions from firebase
import { auth, db, storage } from "./config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";


const userProfile = document.querySelector('#user-profile');
const loginModal = document.querySelector('#login_modal');
const signupModal = document.querySelector('#signup_modal');

const todoBox = document.querySelector('#todo-box');
const todoForm = document.querySelector('#todo-form');
const todoTask = document.querySelector('#todo-task');
const allTasks = document.querySelector('#all-tasks');
const ul = document.querySelector('#ul');


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
let currentUser = {};
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('User ID =>', uid);


        // GETTING USER DATA  

        const q = query(collection(db, "users"), where("uid", '==', uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            // currentUser.push(doc.data())
            currentUser = doc.data();
            console.log("LoggedIn User =>", currentUser);
            // userName.innerHTML = currentUser.name
        });

        userProfile.innerHTML = `

            <div class="dropdown dropdown-end">
                <div class="flex items-center">
                    <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                        <div class="w-8 rounded-full">
                            <img src="${currentUser.profilePic}" alt="profile-pic">
                        </div>
                    </label>
                    <p class="text-lg font-medium "> ${currentUser.name} </p>
                </div>    
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
                location.reload();

            }).catch((error) => {
                console.log(error);
                // An error happened.
            });
        });

        gettingAndRenderingTasks();
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
            todoBox.innerHTML = `<h3 class="text-2xl font-medium text-center text-gray-600">Please Login</h3>`


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

    if (signupPassword.value === confirmPassword.value) {

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
                        const userData = {
                            name: name.value,
                            email: signupEmail.value,
                            uid: user.uid,
                            profilePic: url
                        }
                        addDoc(collection(db, "users"), userData)
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

    } else {
        signupError.innerHTML = 'Password don not match'
    }


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
            signinError.innerHTML = errorMessage;
        });
});





// Getting & Rendring Task
let tasks = [];
async function gettingAndRenderingTasks() {
    tasks.length = 0;

    const q = query(collection(db, "Todo Tasks"), where("uid", '==', auth.currentUser.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

        tasks.push({ ...doc.data(), docId: doc.id });
    });

    ul.innerHTML = ''
    tasks.forEach(item => {

        ul.innerHTML += (`<li  class="flex  justify-between"> <div> <i id="list-icon" class="fa-solid fa-circle-check"></i> &nbsp; ${item.task} </div>   <div> <button  id="edit-btn"><i class="fa-solid fa-file-pen"></i></button> &nbsp; &nbsp;  <button  id="dlt-btn"><i class="fa-solid fa-trash"></i></button> </li> </div> <br>`);
    });

    const loader = document.querySelectorAll('#loader');
    const editBtn = document.querySelectorAll('#edit-btn');
    const dltBtn = document.querySelectorAll('#dlt-btn');

    dltBtn.forEach((btn, index) => {
        btn.addEventListener('click', async () => {

            console.log('dlt called');
            await deleteDoc(doc(db, "Todo Tasks", tasks[index].docId));
            gettingAndRenderingTasks();
        });
    });

    editBtn.forEach((btn, index) => {
        btn.addEventListener('click', async () => {

            console.log('edit called');
            await updateDoc(doc(db, "Todo Tasks", tasks[index].docId), {
                task: prompt('Enter Edited Value')
            });
            gettingAndRenderingTasks();
        });
    });

};


// Adding tasks to DB
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskObj = {
        task: todoTask.value,
        uid: auth.currentUser.uid
    }

    addDoc(collection(db, "Todo Tasks"), taskObj)
        .then(() => {
            todoTask.value = '';
            console.log(doc.ID);
            console.log("todo task added");
        })
        .catch((rej) => {
            console.log(rej);
        });

    gettingAndRenderingTasks();

});







