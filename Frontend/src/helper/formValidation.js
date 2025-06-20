import Regex from "./Regex";

const FormValidation = {
  validateForm: (form, formErrors, validateFunc) => {
    const errorObj = {};
    Object.keys(formErrors).map((x) => {
      let refValue = null;
      const msg = validateFunc(x, form[x], refValue);
      if (msg) errorObj[x] = msg;
    });

    return errorObj;
  },
  resetPass: (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is Required";
        else if (!Regex.EMAIL_REGEXP.test(value))
          return "Enter a valid email address";
        else return "";
      default:
        return "";
    }
  },
  loginForm: (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is Required";
        else if (!Regex.EMAIL_REGEXP.test(value))
          return "Enter a valid email address";
        else return "";
      case "password":
        if (!value) return "Password is Required";
        else return "";
      default:
        return "";
    }
  },
  registerForm: (name, value, password, confirmPassword) => {
    switch (name) {
      case "email":
        if (!value) return "Email is Required";
        else if (!Regex.EMAIL_REGEXP.test(value))
          return "Enter a valid email address";
        else return "";
      case "password":
        if (!value) return "Password is Required";
        else if (!Regex.PASSWORD_REGEX.test(value))
          return "Minimum eight characters, at least one uppercase letter, one lowercase letter,one special character and one number";
        else return "";
      case "confirmPassword": {
        if (!value) return "confirmPassword is Required";
        else if (!Regex.PASSWORD_REGEX.test(value))
          return "Minimum eight characters, at least one uppercase letter, one lowercase letter,one special character and one number";
        else if (value["password"] !== value["confirmPassword"]) {
          return "password is incorrect";
        } else return "";
      }

      case "senderFirstName":
        if (!value) return "senderFirstName is Required";
        else if (!Regex.FULL_NAME_REGEX.test(value))
          return "Enter a valid name ";
        else return "";

      case "senderLastName":
        if (!value) return "senderLastName is Required";
        else if (!Regex.FULL_NAME_REGEX.test(value))
          return "Enter a valid name address";
        else return "";

      case "startingBaseLine":
        if (!value) return "startingBaseLine is Required";
        if (value != 0) {
          return "'Filled only Numeric Value Maximum 0!";
        } else if (!Regex.validNumericRegex.test(value)) {
          return "Filled only Numeric Value Maximum 0";
        } else return "";

      case "incPerDay":
        if (!value) return "incPerDay is Required";
        if (value > 4) {
          return "'Filled only Numeric Value Maximum 50!";
        } else if (!Regex.validNumericRegex.test(value)) {
          return "Filled only Numeric Value Maximum 4";
        } else return "";

    
      case "maxSendPerDay":
        if (!value) return "maxSendPerDay is Required";
        if (value > 30) {
          return "'Filled only Numeric Value Maximum 50!";
        } else if (!Regex.validNumericRegex.test(value)) {
          return "Filled only Numeric Value Maximum 30";
        } else return "";

   
      case "replyRate":
        if (!value) return "replyRate is Required";
        if (value > 40) {
          return "Filled only Numeric Value Maximum 40";
        } else if (!Regex.validNumericRegex.test(value)) {
          return "Filled only Numeric Value";
        }

      default:
        return "";
    }
  },
};
export default FormValidation;
