console.log("Hello World!");

let input = parseInt(prompt("Enter a number: "));

for (let i = 0; i <= input; i++) {
    if (i % 3 == 0 && i % 5 != 0) {
    console.log("COUNT :" + i + "Coco");
    }else if (i % 3 == 0 && i % 5 == 0) {
    console.log("COUNT :" + i + " Coco Melon");
    }else if (i % 5 == 0 && i % 3 != 0) {
    console.log("COUNT :" + i + " Melon");
    }else {
    console.log("COUNT :" + i);
    }
}