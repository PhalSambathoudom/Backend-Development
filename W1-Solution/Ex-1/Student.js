import fs from "fs";

const filePath = "./hello.txt";

// // Write to a file (synchronously)
// fs.writeFileSync(filePath, "Hello, Node.js beginner!");

// // Read the file (synchronously)
// const content = fs.readFileSync(filePath, "utf8");
// console.log("File content:", content);

// Write to a file (Asynchronously)
fs.writeFile(filePath, "Hello World", (err) => {
  if (err) throw err;

  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) throw err;
    console.log(content);
  });
});