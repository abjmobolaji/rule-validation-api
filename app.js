const express = require('express');
const app = express();
const port = 4000;
const validator = require('./validator');
app.use(express.json());

//Validate JSON Payload 
app.use(validator.validatePayload);

//Base Route
app.get("/", (req, res) => {
    res.json(
      {
          "message": "My Rule-Validation API",
          "status": "success",
          "data": {
            "name": "Fakunle Mobolaji Johnson",
            "github": "@leboshjr",
            "email": "abjmobolaji@gmail.com",
            "mobile": "07039486879",
            "twitter": "@leboshjr"
          }
        }
      )
});

//Rule Validation Route
app.post("/validate-rule", validator.validate, (req, res) => {
    let { rule, data } = req.body;
    var { field, condition, condition_value } = rule;

    //Define Custom Success and Error Validation messages
    const successMessage =  validator.result("success", field, data[field], condition, condition_value);
    const failureMessage =  validator.result("error", field, data[field], condition, condition_value);
    
    //Check the condition given
    switch(condition) {
      //Field Value equals to Condition Value
      case "eq":
          if(data[field] == condition_value) {
              return res.status(200).json(successMessage);
          }
          else {
              return res.status(400).json(failureMessage);
          }
          break;
      
      //Field Value not equal to Condition Value
      case "neq":
          if(data[field] != condition_value) {
              return res.status(200).json(successMessage);
          }
          else {
              return res.status(400).json(failureMessage);
          }
          break;

      //Field Value greater than Condition Value
      case "gt":
          if(data[field] > condition_value) {
              return res.status(200).json(successMessage);
          }
          else {
               return res.status(400).json(failureMessage);
          }
          break;

      //Field Value greater than or equals to Condition Value
      case "gte":
          if(data[field] >= condition_value) {
              return res.status(200).json(successMessage);
          }
          else {
              return res.status(400).json(failureMessage);
          }
          break;

      //Field Value contains Condition Value
      case "contains":
          if(data[field].includes(condition_value)) {
            return res.status(200).json(successMessage);
          }
          else {
              return res.status(400).json(failureMessage);
          }
          break;

      default:
        return res.status(400).json( validator.errorMessage("Invalid condition supplied.")); 

    }
});



app.listen(port, () => { console.log(`Server running on port ${port}`) });