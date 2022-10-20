const { ValidateEmail } = require('../server/controller/loginController')

describe('Email Validator Tests', () => {
  test('Accepts unimelb student email', () => {
    expect(ValidateEmail('hello@student.unimelb.edu.au')).toBeTruthy()
  })

  test("Doesn't accept other email hosts", () => {
    expect(ValidateEmail('hello@gmail.com')).toBeFalsy()
  })

  test("Doesn't accept random strings", () => {
    expect(ValidateEmail('adfglkjhakdfgjdag')).toBeFalsy()
    expect(ValidateEmail('adfglkjh@akdfgjdag')).toBeFalsy()
  })
})

const request = require('supertest')
const app = require('../app.js')
const mongoDB = require('../server/database/connection')
const mongoose = require('mongoose')

describe('Testing Routes', () => {
  beforeAll((done) => {
    mongoDB.connectDB()
    done()
  })

  afterAll((done) => {
    mongoose.connections.forEach(async (con) => await con.close())
    done()
  })

  describe('GET Responses', () => {
    test('/', () => {
      return request(app).get('/').expect(200)
    })

    test('/login', () => {
      return request(app).get('/login').expect(200)
    })

    test('/home', () => {
      return request(app).get('/home').expect(200)
    })

    test('/signup', () => {
      return request(app).get('/signup').expect(200)
    })
  })
})
