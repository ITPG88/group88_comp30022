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
