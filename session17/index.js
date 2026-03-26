// 

// [SECTION] Repeatition Control Structures
// Do loop
/* 
Syntax:

while (condition){
    // code block
    // Iteration

}

*/

let count = 0;

while(count < 5 ){
    console.log("DO LOOP: " + count);
    count++;
}

/* 

// 1st Iteration
let count = 0;

while(count < 5 ){
    console.log("DO LOOP: " + count);
    count++;
}

Result -> Do loop: 0

// 2nd Iteration
let count = 1;

while(1 < 5 ){
    console.log("DO LOOP: " + count);
    count++;
}

Result -> Do loop: 1

// 3rd Iteration
let count = 2;

while(2 < 5 ){
    console.log("DO LOOP: " + 2);
    count++;
}

Result -> Do loop: 2

// 4th Iteration
let count = 3;

while(4 < 5 ){
    console.log("DO LOOP: " + 3);
    count++;
}

Result -> Do loop: 3

// 5th Iteration
let count = 4;

while(count < 5 ){
    console.log("DO LOOP: " + 4);
    count++;
}

Result -> Do loop: 4


// 6th Iteration
let count = 5;

while(count < 5 ){
    console.log("DO LOOP: " + 5);
    count++;
}

*/

// 2. do-while loop

/* 
SYNTAX:

do{
    // Code Block
    // Iteration 
}while(condition)

*/


let score = 0;

do{
    console.log("DO-WHILE LOOP" + score);
    score++;
}while(score < 5)

// 3. For loop

/**
SYNTAX: 
for(initialization; condition; iterator){
    // code block
}
 */



// for(let i = 0; i < 5; i++){
//     console.log("FOR LOOP:" + i);
// }

// for(let i = 0; i < 10; i++ ){
//     if(i % 3 ==0){
//         console.log("COUNT:" + i + "- Divisible by 3.");
//     }else{
//         console.log("COUNT:" + i );
//     }
// }

// continue - break 

// for (let count = 0; count < 20; count++ ){
//     if(count == 15){
//         console.log("Hello its me   : " + count);
//         continue;
//     }
//     console.log("COUNT: " + count);
// }

let isRunning = true;
let accountLocked = 0;
let isLoggedIn = false;
let password = "hello123"

while(isRunning){
    if(accountLocked != 3){
    let input = prompt("Please Enter your password.");
    if(input != password){
        console.log("Incorrect password. Chance: ", 3-accountLocked );
        accountLocked++;
    }else{
        isLoggedIn = true;
        alert("Welcome, User!")
        isRunning = false;
    }
    }else{
        alert("Account is Locked! Please contact admin.")
        isRunning = false;
    }
}



let input = parseInt(prompt("Please Enter your password."));

for(let i = 0; i < input; i++){
    console.log(i);
}