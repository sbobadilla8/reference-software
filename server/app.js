const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "temp/");
   },
   filename: function (req, file, cb) {
      cb(null, uuidv4() + path.extname(file.originalname));
   },
});
const upload = multer({ storage: storage });

let key = "Cthulhu R'lyeh Ph'nglui mglw'nafh wgah'nagl fhtagn";
key = crypto.createHash("sha256").update(key).digest("base64").substr(0, 32);

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
   modulusLength: 2048,
});

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

function djb2Hash(str, seed) {
   for (var counter = 0, len = str.length; counter < len; counter++) {
      seed ^= seed << 5;
      seed ^= str.charCodeAt(counter);
   }
   return seed & ~(1 << 31);
}

function getDict(passwd) {
   const dict = {};
   const reverse = {};
   const keys = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",

      " ",

      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",

      ".",
      "/",
      "\\",
      "\n",
      "$",
      "#",
      "@",
      "%",
      "^",
      "*",
      "(",
      ")",
      "_",
      "-",
      "=",
      "+",
      ">",
      "<",
      "?",
      ";",
      ":",
      "'",
      '"',
      "{",
      "}",
      "[",
      "]",
      "|",
      "`",
      "~",
      "!",

      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
   ];

   for (let i = 0; i < keys.length; i++) {
      let key = djb2Hash(passwd, 100 + i);
      dict[keys[i]] = key;
      reverse[key] = keys[i];
   }
   return { dict, reverse };
}

app.post("/encrypt-text", function (req, res, next) {
   let encryptedText = "";
   function encryptText() {
      let text = req.body.text;
      let type = req.body.type;
      let password = req.body.password;

      if (type === "RSA") {
         encryptedText = crypto.publicEncrypt(
            {
               key: publicKey,
               padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
               oaepHash: "sha256",
            },
            Buffer.from(text, "utf8")
         );
         res.send(encryptedText.toString("base64"));
      } else if (type === "ABMV") {
         let { dict } = getDict(password);
         const encoded = [];
         for (let i = 0; i < text.length; i++) {
            encoded.push(dict[text[i]]);
         }
         const encrypted = [];
         let middle = djb2Hash(password, 65535);
         for (let i = 0; i < encoded.length; i++) {
            encrypted.push(encoded[i] ^ middle);
         }
         encryptedText = JSON.stringify(encrypted);
         let base64 = Buffer.from(encryptedText, "utf8").toString("base64");
         res.send(base64);
      }
   }

   encryptText();
});

app.post("/decrypt-text", function (req, res, next) {
   let decryptedText = "";
   function decryptText() {
      let text = req.body.text;
      let type = req.body.type;
      let password = req.body.password;

      if (type === "RSA") {
         decryptedText = crypto.privateDecrypt(
            {
               key: privateKey,
               padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
               oaepHash: "sha256",
            },
            Buffer.from(text, "base64")
         );
      } else if (type === "ABMV") {
         let utf8 = Buffer.from(text, "base64").toString();
         let encrypted = JSON.parse(utf8);
         let middle = djb2Hash(password, 65535);
         const encoded = [];
         for (let i = 0; i < encrypted.length; i++) {
            encoded.push(encrypted[i] ^ middle);
         }
         let { reverse } = getDict(password);
         const decryptedArr = [];
         for (let i = 0; i < encoded.length; i++) {
            decryptedArr.push(reverse[encoded[i]]);
         }
         decryptedText = decryptedArr.join("");
      }
   }

   decryptText();
   res.send(decryptedText.toString("utf8"));
});

app.post("/encrypt-file", upload.single("file"), function (req, res, next) {
   let result;
   function encryptFile() {
      let file = fs.readFileSync(req.file.path);
      let type = req.body.type;
      let password = req.body.password;

      if (type === "AES") {
         const iv = crypto.randomBytes(16);
         const cipher = crypto.createCipheriv(algorithm, key, iv);
         result = Buffer.concat([iv, cipher.update(file), cipher.final()]);
         fs.writeFileSync(`./temp/${req.file.originalname}`, result);
      } else if (type === "ABMV") {
         let text = file.toString("hex");
         let { dict } = getDict(password);
         const encoded = [];
         for (let i = 0; i < text.length; i++) {
            encoded.push(dict[text[i]]);
         }
         const encrypted = [];
         let middle = djb2Hash(password, 65535);
         for (let i = 0; i < encoded.length; i++) {
            encrypted.push(encoded[i] ^ middle);
         }
         let encryptedText = JSON.stringify(encrypted);
         // let base64 = Buffer.from(encryptedText, "utf8").toString("base64");
         result = Buffer.from(encryptedText, "utf8"); // Buffer.from(base64, "utf8")
         fs.writeFileSync(`./temp/${req.file.originalname}`, result);
      }
   }

   encryptFile();
   res.send(req.file.originalname);
});

app.post("/decrypt-file", upload.single("file"), function (req, res, next) {
   let result;
   function decryptFile() {
      let file = fs.readFileSync(req.file.path);
      let type = req.body.type;
      let password = req.body.password;

      if (type === "AES") {
         const iv = file.slice(0, 16);
         const encrypted = file.slice(16);
         const decipher = crypto.createDecipheriv(algorithm, key, iv);
         result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
         fs.writeFileSync(`./temp/${req.file.originalname}`, result);
      } else if (type === "ABMV") {
         let text = file.toString();
         // let utf8 = Buffer.from(text, "base64").toString();
         let encrypted = JSON.parse(text); // JSON.parse(utf8)
         let middle = djb2Hash(password, 65535);
         const encoded = [];
         for (let i = 0; i < encrypted.length; i++) {
            encoded.push(encrypted[i] ^ middle);
         }
         let { reverse } = getDict(password);
         const decryptedArr = [];
         for (let i = 0; i < encoded.length; i++) {
            decryptedArr.push(reverse[encoded[i]]);
         }
         decryptedText = decryptedArr.join("");
         result = Buffer.from(decryptedText, "hex");
         fs.writeFileSync(`./temp/${req.file.originalname}`, result);
      }
   }

   decryptFile();
   res.send(req.file.originalname);
});

app.get("/download", function (req, res) {
   res.download(`./temp/${req.query.path}`);
});

app.get("/", function (req, res) {
   res.send("Welcome!");
});

app.listen(port, () => {
   console.log(`Listening on port: ${port}`);
});
