export default function formValidator(formID) {
  const form = document.getElementById(formID);
  if (!form) return;

  // Validate for rules
  const validator = {
    email: (
      inputValue,
      message = "You have entered an invalid email address. Please try again."
    ) => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return emailRegex.test(inputValue) ? undefined : message;
    },

    required: (inputValue, message = "This field is required. Please enter.") =>
      inputValue ? undefined : message,

    max:
      (requiredLength) =>
      (
        inputValue,
        message = `Maximum ${requiredLength} characters is allowed. Please enter less than ${requiredLength} characters.`
      ) =>
        inputValue.length <= requiredLength ? undefined : message,

    // Add new rules here
  };

  /**
   * Object contain all input field with its validate function
   * Ex:
   * formRules {
   *  inputName1: [rule1,rule2],
   *  inputName2: [rule1]
   * }
   */
  let formRules = {};
  // Get all inputs have rules
  const fields = form.querySelectorAll(".form__input-group__input[fieldRules]");
  fields.forEach((field) => {
    // Split rules if input have many rules
    let fieldRules = field.getAttribute("fieldRules").split("&&");
    fieldRules.forEach((rule) => {
      let validateFunc;

      if (rule.includes(":")) {
        // Ex: max:600
        let ruleInfo = rule.split(":");
        validateFunc = validator[ruleInfo[0]](ruleInfo[1]);
      } else {
        validateFunc = validator[rule];
      }

      if (Array.isArray(formRules[field.name])) {
        // Already have rule
        formRules[field.name].push(validateFunc);
      } else {
        // First rule
        formRules[field.name] = [validateFunc];
      }
    });

    field.onblur = handleValidate;
    field.oninput = handleClearError;
  });

  function handleValidate(e) {
    // Get validate function array of an input
    let rules = formRules[e.target.name];
    var errorMessage;

    // Validate with input value
    for (let rule of rules) {
      errorMessage = rule(e.target.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      const inputWrapper = e.target.parentNode;
      const messageNode = inputWrapper.parentNode.querySelector(
        ".form__input-group__error-message"
      );
      messageNode.innerText = errorMessage;
      inputWrapper.classList.add("form__input-group__input-wrapper--error");
    }

    //If input iserror, errorMessage = errMsg -> return false (is not valid )
    return !errorMessage;
  }

  function handleClearError(e) {
    const inputWrapper = e.target.parentNode;
    if (
      inputWrapper.classList.contains("form__input-group__input-wrapper--error")
    ) {
      inputWrapper.classList.remove("form__input-group__input-wrapper--error");
    }
  }

  form.onsubmit = (event) => {
    event.preventDefault();

    let isValid = true;
    for (let field of fields) {
      if (!handleValidate({ target: field })) {
        isValid = false;
      }
    }

    if (isValid) {
      const allFields = form.querySelectorAll("[name]");

      // Save gotten radio/ check box
      let gotCheckedInputName = [];

      //Save data as an object
      let data = Array.from(allFields).reduce(function (
        accumulator,
        currentField
      ) {
        let temp;
        switch (currentField.type) {
          case "radio":
          case "checkbox":
            // Only run 1 times to get radio/check box value
            if (gotCheckedInputName.includes(currentField.name)) break;
            else {
              gotCheckedInputName.push(currentField.name);
              accumulator = {
                ...accumulator,
                // Get value of checked check box as an array
                [currentField.name]: Array.from(
                  form.querySelectorAll(
                    `input[name=${currentField.name}]:checked`
                  )
                ).reduce((values, element) => [...values, element.value], []),
              };
            }
            break;
          default:
            // Input other type
            accumulator = {
              ...accumulator,
              [currentField.name]: currentField.value,
            };
        }
        return accumulator;
      },
      {});
      this.onSubmit(data);
    }
  };
}
