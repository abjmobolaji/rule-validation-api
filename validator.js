//Template for Validation Error Message
var errorMessage = (message) => {
    return {
        "message": message,
        "status": "error",
        "data": null
    };
}

//Template for Validation Message Result
var result = (status, field, field_value, condition, condition_value) => {
    let message, error;
    if(status === "success") {
        message = `field ${field} successfully validated.`;
        error = false;
    } else {
        message = `field ${field} failed validation.`;
        error = true;
    }   
    return {
        "message" : message,
        "status": status,
        "data": {
          "validation": {
            "error": error,
            "field": field,
            "field_value": field_value,
            "condition": condition,
            "condition_value" : condition_value
          }
        }
      }
}

//Validate JSON Payload
var validatePayload = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400).json( errorMessage("Invalid JSON payload passed."));
    }
    // Pass the error to the next middleware if it wasn't an Invalid JSON payload error
    next(err);
  }

//MiddleWare to Handle Other Validations
var validate = (req, res, next) => {
    var { rule, data } = req.body;

    //Validation for required fields
    if(!rule) return res.status(400).json( errorMessage("rule is required."));
    if(!data) return res.status(400).json( errorMessage("data is required."));

    //Validation for wrong type
    if(typeof(rule) !== "object") return res.status(400).json( errorMessage("rule should be an object."));

    if(!["object", "array", "string"].includes(typeof data)) return res.status(400).json(
        errorMessage("data should be either an object, an array or a string.")
    );

    //Validation for the fields in the rule object
    if(!rule.field) { 
        return res.status(400).json( errorMessage("field is required in rule object."));
    } else if(!rule.condition) {
        return res.status(400).json( errorMessage("condition is required in rule object."));
    } else if(!rule.condition_value) {
        return res.status(400).json( errorMessage("condition_value is required in rule object."));
    }

    //Validation for field specified in the rule object and data passed
    if(data[rule.field] == undefined ) {
        return res.status(400).json( errorMessage(`field ${rule.field} is missing from data.`));
    }

    next();
}

module.exports = {
    validatePayload,
    validate,
    errorMessage,
    result
}