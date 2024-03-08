const express = require("express");
const Admin = require("../models/adminSchema");
const adminRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

adminRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findOne({ staffId: id });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Your route for updating the admin profile
adminRouter.put(
  "/editProfile/:staffId",
  upload.single("profilePic"),
  async (req, res) => {
    const { staffId } = req.params;
    const { firstName, lastName, username } = req.body;

    console.log("Text fields:", req.body);
    console.log("Uploaded file:", req.file);

    try {
      let updatedProfile = {
        firstName,
        lastName,
        username,
      };

      if (req.file) {
        updatedProfile.profilePic = req.file.path;
      }

      const response = await Admin.findOneAndUpdate(
        { staffId: staffId },
        updatedProfile,
        { new: true }
      );

      if (!response) {
        return res.status(404).json({ message: "Admin not found." });
      }

      console.log("Update Response:", response);
      res.status(200).json({ message: "Admin profile updated successfully" });
    } catch (error) {
      console.error("Error updating admin profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//Register user
adminRouter.post("/register", upload.single("profilePic"), async (req, res) => {
  const { staffId, firstName, lastName, username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).send({ error: "Username already exists" });
    }
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      staffId,
      firstName,
      lastName,
      username,
      password: hashedPassword,
      profilePic: req.file.path,
    });

    await newAdmin.save();

    console.log("Admin registered");
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//User login 
adminRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log("Admin not found while trying to login");
      return res.status(401), send({ error: "Invalid username or password" });
    } else {
      console.log("Admin found");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).send({ error: "Invalid username or password" });
    }
    //Create a jwt token
    const token = jwt.sign(
      { username: admin.username, userId: admin._id, staffId:admin.staffId},
      "yourJWTSecret",
      {
        expiresIn: "1h",
      }
    );
     // Set the token as an HTTP-only cookie
     res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 
    console.log("Admin logged in");
    res.send({ token, staffId: admin.staffId });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});



module.exports = adminRouter;
