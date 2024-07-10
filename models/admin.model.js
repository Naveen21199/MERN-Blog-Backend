const User = mongoose.model("User", {
  username: String,
  email: String,
  passwordHash: String,
  isAdmin: { type: Boolean, default: false }, // Example field for admin role, adjust as per your needs
});
