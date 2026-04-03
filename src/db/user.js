const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // no same email
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }, // createdAt ve updatedAt
);

// Security: Hide psw while user info turning into JSON
usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
