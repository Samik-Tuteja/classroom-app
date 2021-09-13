const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Createclass = require("../models/Createclass");
const Joiningclass = require("../models/Joiningclass");
const Teachermsg = require("../models/Teachermsg");
const Turnin = require("../models/Turnin");
const { ensureAuthenticated } = require("../config/auth");
const fs = require("fs");
const path = require("path");

router.get("/", ensureAuthenticated, (req, res) => {
  Createclass.find({ teachername: req.user.name })
    .then((teacherdata) => {
      Joiningclass.find({ studentname: req.user.name })
        .then((studentdata) => {
          res.render("dashboard", {
            data: req,
            teacherdata: teacherdata,
            studentdata: studentdata,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/createclass", ensureAuthenticated, (req, res) => {
  res.render("classroom/newclass");
});

router.post("/createclass", (req, res) => {
  User.find({ name: req.user.name })
    .then((dataname) => {
      let newCreateclass = new Createclass({
        classname: req.body.classname,
        teachername: dataname[0].name,
        classn: req.body.classn,
        section: req.body.section,
        skool: req.body.skool,
      });

      newCreateclass.save();
      res.redirect("/classroom");
    })
    .catch((err) => console.log(err));
});

router.get("/joinclass", (req, res) => {
  res.render("classroom/joinedclass");
});

router.post("/joinclass", (req, res) => {
  User.find({ name: req.user.name })
    .then((data) => {
      Createclass.find({ _id: req.body.classcode })
        .then((data1) => {
          let newjoinclass = new Joiningclass({
            studentname: data[0].name,
            teachername: data1[0].teachername,
            classcode: req.body.classcode,
            classname: data1[0].classname,
            classn: data1[0].classn,
            section: data1[0].section,
            skool: req.body.skool,
          });

          newjoinclass.save();
          res.redirect("/classroom");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/joinallclasses", ensureAuthenticated, (req, res) => {
  res.render("classroom/allclasses");
});

router.post("/joinallclasses", (req, res) => {
  User.find({ name: req.user.name })
    .then((dataname) => {
      Createclass.find({
        classn: req.body.classn,
        section: req.body.section,
        skool: req.body.skool,
      })
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            let newjoinclasss = new Joiningclass({
              studentname: dataname[0].name,
              teachername: data[i].teachername,
              classcode: data[i].id,
              classname: data[i].classname,
              classn: req.body.classn,
              section: req.body.section,
              skool: req.body.skool,
            });

            newjoinclasss.save();
            res.redirect("/classroom");
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/:id/postmaterial", async (req, res) => {
  const createclass = await Createclass.findById(req.params.id);
  const user = await User.find({ name: req.user.name });
  res.render("classroom/newmaterial", {
    createclass: createclass,
    user: user,
  });
});

router.get("/:id/newpost", async (req, res) => {
  const createclass = await Createclass.findById(req.params.id);
  const user = User.find({ name: req.user.name });
  res.render("classroom/newpost", {
    createclass: createclass,
    user: user,
  });
});

router.get("/:id", async (req, res) => {
  const createclass = await Createclass.findById(req.params.id);
  const user = await User.find({ name: req.user.name });
  const teachermsgs = await Teachermsg.find({
    classcode: req.params.id,
    teachername: createclass.teachername,
  });
  res.render("classroom/currentclass", {
    createclass: createclass,
    teachermsgs: teachermsgs,
    user: user,
  });
});

router.post("/:id/delete", async (req, res) => {
  await Teachermsg.findByIdAndDelete(req.params.id);
  res.redirect(`/classroom/${req.body.codes}`);
});

router.post("/teachermsg", async (req, res) => {
  User.find({ name: req.user.name })
    .then((dataname) => {
      Createclass.find({ _id: req.body.classcode, teachername: req.user.name })
        .then((data) => {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ];
          const date = new Date();
          const time = monthNames[date.getMonth()] + " " + date.getDate();

          let newTeachermsg = new Teachermsg({
            classcode: req.body.classcode,
            teachername: dataname[0].name,
            message: req.body.message,
            messagename: req.body.messagename,
            file: req.body.file,
            date: time,
          });

          newTeachermsg.save();
          res.redirect(`/classroom/${req.body.classcode}`);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.post("/teachermsg2", async (req, res) => {
  User.find({ name: req.user.name })
    .then((dataname) => {
      Createclass.find({ _id: req.body.classcode, teachername: req.user.name })
        .then((data) => {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ];
          const date = new Date();
          const time = monthNames[date.getMonth()] + " " + date.getDate();

          let newTeachermsg = new Teachermsg({
            classcode: req.body.classcode,
            teachername: dataname[0].name,
            messagename: req.body.messagename,
            message: req.body.message,
            date: time,
          });

          newTeachermsg.save();
          res.redirect(`/classroom/${req.body.classcode}`);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/:id/students", async (req, res) => {
  const createdclass = await Createclass.findById(req.params.id);
  const joinedclass = await Joiningclass.find({ classcode: req.params.id });

  res.render("classroom/students", {
    createdclass: createdclass,
    joinedclass: joinedclass,
  });
});

router.get("/:id/createassignment", async (req, res) => {
  const user = await User.find({ user: req.user.name });f
  const createdclass = await Createclass.findById(req.params.id);
  res.render("classroom/createassignment", {
    createdclass: createdclass,
  });
});

router.post("/postassignment", async (req, res) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date();
  const time = monthNames[date.getMonth()] + " " + date.getDate();

  let newAssignment = new Teachermsg({
    teachername: req.body.teachername,
    classcode: req.body.id,
    message: req.body.message,
    messagename: req.body.messagename,
    duedate: req.body.duedate,
    type: "assignment",
    marks: req.body.marks,
    date: time,
  });

  const regex = /^data:.+\/(.+);base64,(.*)$/;
  const matches = req.body.file.match(regex);
  const ext = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");
  fs.writeFileSync(
    path.join(__dirname, `../media/attachments/${newAssignment._id}.${ext}`),
    buffer
  );

  newAssignment.file = `/attachments/${newAssignment._id}.${ext}`;

  newAssignment.save();
  res.redirect(`/classroom/${req.body.id}`);
});

router.post("/assignmentturnin", async (req, res) => {
  const dhudate = req.body.dhudate;

  var dateInPast = function (firstDate, secondDate) {
    if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
      return true;
    }

    return false;
  };

  const date = new Date();
  currentYear = date.getFullYear();
  currentMonth = date.getMonth() + 1;
  currentDay = date.getDate();
  currentMonth = ("0" + currentMonth).slice(-2);
  currentDay = ("0" + currentDay).slice(-2);

  const todayDate = currentYear + "-" + currentMonth + "-" + currentDay;

  var past = new Date(dhudate);
  var today = new Date();
  dateInPast(past, today);

  dateInPastArrow = (firstDate, secondDate) =>
    firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0);

  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getDate() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getFullYear();

  let newTurnin = new Turnin({
    studentname: req.user.name,
    teachername: req.body.teachername,
    classcode: req.body.classid,
    marks: req.body.marks,
    assignmentcode: req.body.assignmentid,
    date: formatted_date,
    messagename: req.body.messagename,
  });
  const regex = /^data:.+\/(.+);base64,(.*)$/;
  const matches = req.body.file.match(regex);
  const ext = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");
  fs.writeFileSync(
    path.join(__dirname, `../media/attachments/${newTurnin._id}.${ext}`),
    buffer
  );
  newTurnin.file = `/attachments/${newTurnin._id}.${ext}`;

  if (dateInPastArrow(past, today) === false) {
    newTurnin.status = "Turned in";
  } else if (dateInPastArrow(past, today) === true) {
    newTurnin.status = "Turned in late";
  }

  newTurnin.save();
  res.redirect(
    `/classroom/${req.body.classid}/assignment/${req.body.assignmentid}`
  );
});

router.get("/:id/assignment/:assignmentId", async (req, res) => {
  const createdclass = await Createclass.findById(req.params.id);
  const user = await User.find({ name: req.user.name });
  const teachermsgs = await Teachermsg.find({
    classcode: req.params.id,
    _id: req.params.assignmentId,
  });
  const turnin = await Turnin.find({
    studentname: req.user.name,
    classcode: req.params.id,
    assignmentcode: req.params.assignmentId,
  });
  res.render("classroom/assignment", {
    createdclass: createdclass,
    teachermsgs: teachermsgs,
    user: user,
    turnin: turnin,
  });
});

router.get("/:id/assignment/:assignmentId/show", async (req, res) => {
  const createdclass = await Createclass.findById(req.params.id);
  const joinedclass = await Joiningclass.find({ classcode: req.params.id });
  const user = await User.find({ name: req.user.name });
  const teachermsgs = await Teachermsg.find({
    classcode: req.params.id,
    _id: req.params.assignmentId,
  });
  const turnin = await Turnin.find({
    classcode: req.params.id,
    assignmentcode: req.params.assignmentId,
  });
  res.render("classroom/showassignment", {
    createdclass: createdclass,
    teachermsgs: teachermsgs,
    user: user,
    turnin: turnin,
    joinedclass: joinedclass,
  });
});

router.post("/showassignmentpost", async (req, res) => {
  try {
    const result = await Turnin.updateOne(
      {
        studentname: req.body.studentname,
        classcode: req.body.classcode,
        assignmentcode: req.body.assignmentcode,
      },
      {
        $set: {
          returnedmarks: req.body.returnedmarks,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
  res.redirect("/classroom");
});

router.get("/:id/student-records", async (req, res) => {
  const user = await User.find({ name: req.params.name });
  const joinedclass = await Joiningclass.find({ classcode: req.params.id });
  res.render("classroom/studentrecordlist", {
    joinedclass: joinedclass,
  });
});

router.get("/:id/student-records/:studentname", async (req, res) => {
  const user = await User.find({ name: req.user.name });
  const teachermsgs = await Teachermsg.find({
    classcode: req.params.id,
    type: "assignment",
  });
  const turnin = await Turnin.find({
    classcode: req.params.id,
    studentname: req.params.studentname,
  });

  res.render("classroom/studentrecords", {
    teachermsgs: teachermsgs,
    user: user,
    turnin: turnin,
  });
});

module.exports = router;
