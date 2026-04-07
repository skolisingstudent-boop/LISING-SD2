let friends = [];

function showfriends() {
    if (friends.length <= 0) {
        console.log("you have no friends");
    } else {
        console.log("your friends are: " + friends);
    }
}

function addfriend(name) {
let check = friends.includes(name.toUpperCase());

 if(index == -1){
        let upperName = name.toUpperCase();
        let inedx = friends.indexOf(upperName);
}else{
        friends.push(name.toUpperCase());
        console.log(`You added ${name.toUpperCase()} to your friend list.`);
    }
    }