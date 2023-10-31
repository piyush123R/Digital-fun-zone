const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Register = require("./models/register");
const Todo = require("./models/todo");
const Completed = require("./models/completed");
const imgModel = require("./models/Image");
const Score = require("./models/score");
const Message = require("./models/messages");
const Chat = require("./models/PersonalChat");
const msgCnt = require("./models/unreadmsg");

const app = express();
const fs = require("fs");
const { DateTime } = require("luxon");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const dbURI =
  "mongodb+srv://rajpiyush278:18363779@cluster0.gaedcnp.mongodb.net/cluster0?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(3001, () => {
      console.log("server is listening");
    })
  )
  .catch((err) => console.log("some error occured",err));

app.post("/register", (req, res) => {
  const email = req.body.email;
  Register.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.json("Email already registered");
      } else {
        const newUser = new Register(req.body);
        newUser
          .save()
          .then((result) => res.json("Registration successful"))
          .catch((err) => res.json("Error occured"));
      }
    })
    .catch((err) => res.json(err));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  Register.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json("Login successful");
        } else {
          res.json("Incorrect password");
        }
      } else {
        res.json("No user found");
      }
    })
    .catch((err) => res.json(err));
});

app.get("/getuser", (req, res) => {
  Register.find()
    .then((result) => res.send(result))
    .catch((err) => res.json(err));
});

app.post("/addtodo", (req, res) => {
  const newTodo = new Todo(req.body);

  newTodo
    .save()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

app.get("/getlist", (req, res) => {
  const email = req.query.email;
  Todo.find({ email })
    .then((result) => res.send(result))
    .catch((err) => res.json(err));
});

app.delete("/dellist/:id", (req, res) => {
  const id = req.params.id;
  Todo.findByIdAndDelete(id)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const content = req.body;
  Todo.findByIdAndUpdate(id, content, { new: true })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/deleted", (req, res) => {
  const content = req.body;

  const newCompleted = new Completed(content);
  newCompleted
    .save()
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.get("/getdeleted", (req, res) => {
  const email = req.query.email;
  Completed.find({ email })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  console.log(req.file.filename);

  const newImg = new imgModel({
    fileName: req.file.filename,
    path: req.file.path,
  });

  newImg
    .save()
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.get("/getscore", (req, res) => {
  const email = req.query.email;
  const score = parseFloat(req.query.score);
  const count = parseInt(req.query.count);

  Score.find({ email })
    .then((result) => {
      if (result.length > 0) {
        if (count > 0) {
          const id = result[0]._id;
          Score.findByIdAndUpdate(id, { email, score, count }, { new: true })
            .then((newResult) => res.send(newResult))
            .catch((err) => res.send(err));
        } else res.send(result);
      } else {
        const newScore = new Score({ email, score, count });

        newScore
          .save()
          .then((newResult) => res.send(newResult))
          .catch((err) => res.send(err));
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/getrank", (req, res) => {
  Score.find()
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/savemessage", (req, res) => {
  //  console.log(req.body)
  var content = req.body;
  const newMsg = new Message({
    email: content.newMail,
    message: content.msg,
    time: content.val,
    date: content.date,
  });
  newMsg
    .save()
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
var c = 0;
app.get("/getmessage", (req, res) => {
  c++;
  console.log(c);
  Message.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => res.send(err));
});

app.get("/getcnt", (req, res) => {
  const email = req.query.email;
  const index = req.query.index;
  const score = 51;
  var cnt = 0;
  msgCnt
    .find({ email })
    .then((result) => {
      if (result.length === 0) {
        const newEntry = new msgCnt({ email: email, readMsgCnt: score });
        newEntry
          .save()
          .then((newRes) => {
            Message.find()
              .then((newResult) => {
                  res.json(newResult.length - newRes.readMsgCnt);
      
              })
              .catch((err) => res.send(err));
          })
          .catch((err) => res.send(err));
      }
      else{
      var currentMsgCnt = 0;

      Message.find()
        .then((newRes) => {
          currentMsgCnt = newRes.length - result[0].readMsgCnt;
          const id = result[0]._id;

          if (index === "1") {
            msgCnt
              .findByIdAndUpdate(
                id,
                { email: email, readMsgCnt: newRes.length },
                { new: true }
              )
              .then((result) => res.json(currentMsgCnt))
              .catch((err) => res.send(err));
          } else {
            res.json(newRes.length - result[0].readMsgCnt);
          }
        })
        .catch((err) => res.send(err));
      }
    })
    .catch((err) => res.send(err));
});

app.post("/savechat", (req, res) => {
  const content = req.body;
  const newChat = new Chat({
    email: content.email,
    pair: content.pair,
    message: content.msg,
    time: content.val,
    date: content.date,
  });

  newChat
    .save()
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
var d = 0;
app.get("/getchat", (req, res) => {
  const pair = req.query.pair;
  d++;
  console.log(d);
  Chat.find({ pair: pair })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.get("/checkuser", (req, res) => {
  const email = req.query.newEmail;
  Register.find({ email: email })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});


// app.get("/getchat",async(req,res)=>{
//     const pair=req.query.pair;
//     try{
//     const result=await Chat.find({pair:pair})
//     console.log(result);
//     res.send(result)
//     }
//     catch(err){
//       console.log(err)
//       res.send(err)
//     }
// })


