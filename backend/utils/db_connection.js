import mongoose from "mongoose";

export let DB_CONNECTION = async () => {
  try {
    let db_connection = await mongoose.connect(`${process.env.DB_CONNECTION}`);

    if (db_connection) {
      console.log("db connection is created");
    } else {
      console.log("db connection is refused");
    }
  } catch (error) {
    console.log(error);
  }
};

