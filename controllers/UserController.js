const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "User already exists. Please Sign in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please sign up first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials. Please fill correct email and password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Your OTP for CANOVA",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.otp = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

const uploadFile = async (req, res) => {
  console.log("Upload route hit")
  try {
    console.log("Upload req - ", req);
    return res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename,
      format: req.file.format,
      resource_type: req.file.resource_type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "File upload failed" });
  }
};

const saveForm = async (req, res) => {
  const {
    formID,
    currentProjectID,
    currentProjectName,
    targetProjectID,
    sharedByEmail,
    currentForm,
  } = req.body;
  console.log("Request body - ", req.body);
  // STEP 1: Find the owner user
  const owner = await UserModel.findOne({ email: sharedByEmail });
  if (!owner) return res.status(404).json({ message: "Owner not found" });
  console.log("Current form - ", currentForm);
  // STEP 2: If owner has no projects at all, create first one
  if (!owner.projects || owner.projects.length === 0) {
    // console.log(currentForm);
    const newProject = {
      projectID: currentProjectID,
      projectName: currentProjectName,
      forms: [currentForm],
    };
    owner?.projects?.forms?.filter((item) => item !== null);
    console.log(owner.projects);
    owner.projects.push(newProject);
    await owner.save();
    return res
      .status(200)
      .json({ message: "Form published (new project created)" });
  }

  // STEP 3: Try finding the form from the current project
  const currentProject = owner.projects.find(
    (p) => p.projectID === currentProjectID
  );

  const form = currentProject?.forms?.find((f) => f?.formID === formID);

  // STEP 4: Remove form from previous project if moved
  if (currentProjectID !== targetProjectID && currentProject) {
    currentProject.forms = currentProject.forms.filter(
      (f) => f.formID !== formID
    );
  }

  // STEP 5: Add or update form in the target project
  let targetProject = owner.projects.find(
    (p) => p.projectID === targetProjectID
  );

  if (!targetProject) {
    targetProject = {
      projectID: targetProjectID,
      projectName: currentProjectName,
      forms: [currentForm],
    };
    owner.projects.push(targetProject);
  } else {
    const existingIndex = targetProject.forms.findIndex(
      (f) => f?.formID === formID
    );
    if (existingIndex !== -1) {
      targetProject.forms[existingIndex] = currentForm;
    } else {
      targetProject.forms.push(currentForm);
    }
  }
  console.log("first");
  await owner.save();
};

const publishForm = async (req, res) => {
  try {
    const {
      sharedType,
      formID,
      formName,
      currentProjectID,
      currentProjectName,
      targetProjectID,
      sharedEmails,
      accessType,
      sharedByEmail,

      currentForm,
    } = req.body;

    // STEP 1: Find the owner user
    const owner = await UserModel.findOne({ email: sharedByEmail });
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    console.log("Current form - ", currentForm);
    // STEP 2: If owner has no projects at all, create first one
    if (!owner.projects || owner.projects.length === 0) {
      console.log(currentForm);
      const newProject = {
        projectID: currentProjectID,
        projectName: currentProjectName,
        forms: [currentForm],
      };
      owner.projects.push(newProject);
      await owner.save();
      return res
        .status(200)
        .json({ message: "Form published (new project created)" });
    }

    // STEP 3: Try finding the form from the current project
    const currentProject = owner.projects.find(
      (p) => p.projectID === currentProjectID
    );

    const form = currentProject?.forms?.find((f) => f?.formID === formID);

    // STEP 4: Remove form from previous project if moved
    if (currentProjectID !== targetProjectID && currentProject) {
      currentProject.forms = currentProject.forms.filter(
        (f) => f?.formID !== formID
      );
    }

    // STEP 5: Add or update form in the target project
    let targetProject = owner.projects.find(
      (p) => p.projectID === targetProjectID
    );

    if (!targetProject) {
      targetProject = {
        projectID: targetProjectID,
        projectName: currentProjectName,
        forms: [currentForm],
      };
      owner.projects.push(targetProject);
    } else {
      const existingIndex = targetProject.forms.findIndex(
        (f) => f?.formID === formID
      );
      if (existingIndex !== -1) {
        targetProject.forms[existingIndex] = currentForm;
      } else {
        targetProject.forms.push(currentForm);
      }
    }

    // STEP 6: Handle access sharing
    if (accessType === "restricted") {
      for (let entry of sharedEmails) {
        const { email, permission } = entry;
        const user = await UserModel.findOne({ email });
        if (!user) continue;

        if (permission === "remove") {
          user.sharedWorks = user.sharedWorks.filter(
            (f) => f.formID !== formID
          );
        } else {
          const sharedObj = {
            sharedBy: sharedByEmail,
            accessType: permission,
            sharedType: sharedType,
            formID,
            formName,
            projectID: targetProjectID,
            projectName: targetProject.projectName,
            formData: [currentForm],
          };

          const alreadyShared = user.sharedWorks.find(
            (w) => w.formID === formID
          );
          if (alreadyShared) {
            alreadyShared.accessType = permission;
          } else {
            user.sharedWorks.push(sharedObj);
          }
        }

        await user.save();
      }
    }

    // STEP 7: Save the owner
    await owner.save();

    return res.status(200).json({ message: "Form published successfully" });
  } catch (error) {
    console.error("Publish error:", error);
    res.status(500).json({ message: "Failed to publish form" });
  }
};

const updateUserData = async (req, res) => {
  try {
    console.log("Updating user data");
    const { name, email, currentEmail } = req.body;

    console.log("Request body:", req.body);

    const user = await UserModel.findOne({ email: currentEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({ message: "User Data Saved Successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  signup,
  sendOtp,
  verifyOtp,
  resetPassword,
  uploadFile,
  publishForm,
  getUser,
  updateUserData,
  saveForm,
  logout,
};
