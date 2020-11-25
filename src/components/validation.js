export const validateConfirmPswd = (confirm_password, password) => {
    let value
    if (!confirm_password) {
      value = {
        confirm_password_error: "Please enter a value",
        validconfirm_password: false
      }
    } 
    else if (confirm_password !== password) {
      value = {
        confirm_password_error: "Password mismatch",
        validconfirm_password: false,
      }
    } 
    else {
      value = {
        confirm_password_error: "",
        validconfirm_password: true
      }
    }
    return value
  };
  export const validatePassword = (password) => {
    const letter = /[a-zA-Z]/;
    const number = /[0-9]/;
    let value
    if (!password) {
      value = {
        pass_error: "Please enter a value",
        validPassword: false,
      }
    } 
    else if (password.length < 8) {
      value = {
        pass_error: "Password strength should be more than 7",
        validPassword: false,
    }
    } 
    else if (!letter.test(password) || !number.test(password)) {
      value = {
        pass_error: "Your password must contain letters and numbers",
        validPassword: false,
      }
    } 
    else {
      value = {
        pass_error: "",
        validPassword: true,
    }
    }
    return value
  };
  
  export const validateTeamName = (team_name) => {
      let value
      if (!team_name) {
        value = {
          tname_error: "Please enter a value",
          validPassword: false,
        }
      } 
      else if (team_name.length < 3) {
        value = {
          tname_error: "Team name should not be lesser than 3 characters",
          validPassword: false,
        }
      } 
      else {
        value = {
          tname_error: "",
          validPassword: true,
        }
      }
      return value
    };
  
    export const validateCoachName = (coach_name) => {
      const letter = /[A-Za-z ]{3,}/
      let value
      if (!coach_name) {
        value = {
          cname_error: "Please enter a value",
          validPassword: false,
        }
      } 
      else if (!letter.test(coach_name)) {
          value = {
            cname_error: "Coach name should have atleast 3 characters and should contains only alphabets and spaces",
            validPassword: false,
          }
        } 
      else {
        value = {
          cname_error: "",
          validPassword: true,
        }
      }
      return value
    };
    export const validateCountryName = (country_name) => {
      const letter = /[A-Za-z ]{3,}/
      let value
      if (!country_name) {
        value = {
          country_error: "Please enter a value",
          validPassword: false,
        }
      } 
      else if (!letter.test(country_name)) {
          value = {
            country_error: "Country name should have atleast 3 characters and should contains only alphabets and spaces",
            validPassword: false,
          }
        } 
      else {
        value = {
          country_error: "",
          validPassword: true,
        }
      }
      return value
    };
  
    export const validatePlayerName = (name) => {
      let value
      if (!name) {
        value = {
          playerNameError: "Please enter a value",
          validname: false,
        }
      } 
      else if (name.length < 3) {
        value = {
          playerNameError: "Team name should not be lesser than 3 characters",
          validname: false,
        }
      } 
      else {
        value = {
          playerNameError: "",
          validname: true,
        }
      }
      return value
    };
  
    export const validatePlayerType = (type) => {
      let value
      if (type === "") {
        value = {
          playertypeError: "Please Select a value",
          validtype: false,
        }
      } 
      else {
        value = {
          playertypeError: "",
          validtype: true,
        }
      }
      return value
    };
  
    export const validateAge = (age) => {
      const number = /[0-9]/;
      let value
      if (!age) {
        value = {
          ageError: "Please enter a value",
          validage: false,
        }
      } 
      else if (!number.test(age)) {
        value = {
          ageError: "Please enter numeric value",
          validage: false,
        }
      }
      else if (age < 16 || age > 40 ) {
        value = {
          ageError: "Please enter age between 16 - 40",
          validage: false,
        }
      }
      else {
        value = {
          ageError: "",
          validage: true,
      }
      }
      return value
    };
  
    export const validateGame = (game) => {
      const number = /[0-9]/;
      let value
      if (!game) {
        value = {
          gameError: "Please enter a value",
          validgame: false,
        }
      } 
      else if (!number.test(game)) {
        value = {
          gameError: "Please enter numeric value",
          validgame: false,
        }
      } 
      else {
        value = {
          gameError: "",
          validgame: true,
      }
      }
      return value
    };
  
    export const validateScore = (score) => {
      const number = /[0-9]/;
      let value
      if (!score) {
        value = {
          scoreError: "Please enter a value",
          validnumber: false,
        }
      } 
      else if (!number.test(score)) {
        value = {
          scoreError: "Please enter numeric value",
          validnumber: false,
        }
      } 
      else {
        value = {
          scoreError: "",
          validnumber: true,
      }
      }
      return value
    };
  