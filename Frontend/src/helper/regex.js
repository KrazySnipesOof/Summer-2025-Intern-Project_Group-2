const Regex = {
  MOBILE_REGEX: /^[6-9]\d{9}$/,
  EMAIL_REGEXP:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  FULL_NAME_REGEX: /^[a-zA-Z ]+$/,
  NAME_REGEX: /^[a-zA-Z]+$/,
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
  NUMERIC_REGEX: /[^0-9]/g,
  validNumericRegex: /^[0-9\b]+$/,
};

export default Regex;
