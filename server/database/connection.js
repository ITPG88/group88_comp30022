const mongoose = require('mongoose')

exports.connectDB = async () => {
  try {
    // Attempt to connect to database
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    con.connection.useDb('subjectReviewDB')
    con.connection.getClient().db('SubjectReviewDB')
    mongoose.connection.on('connected', () => console.log(`MongoDB connected : ${con.connection.host}\n`))
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
