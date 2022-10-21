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
  beforeAll(() => {
    return mongoDB.connectDB()
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
    }, 100000)

    test('/signup', () => {
      return request(app).get('/signup').expect(200)
    })

    test('/subject/:code', () => {
      return request(app).get('/subject/COMP10001').expect(200)
    })
  })

  describe('Redirects - not logged in', () => {
    test('/random-path-that-doesnt-exist goes to 404', () => {
      return request(app)
        .get('/asdfasdf')
        .expect(302)
        .expect('Location', '/error404')
    })

    test('/browse goes back to landing', () => {
      return request(app).get('/browse').expect(302).expect('Location', '/')
    })

    test('/settings goes back to landing', () => {
      return request(app).get('/settings').expect(302).expect('Location', '/')
    })
  })
})
