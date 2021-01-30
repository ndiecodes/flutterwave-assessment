module.exports = class RuleValidator {
  dataValue = null;
  status = 200;
  data = {};
  constructor({ rule, data }) {
    this.rule = rule;
    this.data = data;
  }

  validateDataValue() {
    /** validate field with numeral input e.g 0 */
    if (!isNaN(this.rule.field)) {
      let value = this.data[this.rule.field];
      if (!value) {
        this.status = 400;
        return false;
      }
      this.dataValue = value;
    }

    /** validate field with string input e.g 'mission.count" */
    var args = this.rule.field.split(".");
    let obj = this.data;
    for (var i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        this.status = 400;
        return false;
      }
      obj = obj[args[i]];
    }
    this.dataValue = obj;
    return true;
  }

  checkConditionIsMet() {
    switch (this.rule.condition) {
      case "eq":
        return this.dataValue === this.rule.condition_value;
      case "neq":
        return this.dataValue !== this.rule.condition_value;
      case "gt":
        return this.dataValue > this.rule.condition_value;
      case "gte":
        return this.dataValue >= this.rule.condition_value;
      case "contains":
        if (
          this.dataValue !== undefined &&
          typeof this.dataValue === "string"
        ) {
          return this.dataValue.includes(this.rule.condition_value);
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  invalidFieldResponse() {
    return {
      message: `field ${this.rule.field} is missing from data.`,
      status: "error",
      data: null,
    };
  }

  errorData() {
    return {
      message: `field ${this.rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: this.rule.field,
          field_value: this.dataValue,
          condition: this.rule.condition,
          condition_value: this.rule.condition_value,
        },
      },
    };
  }
  successData() {
    return {
      message: `field ${this.rule.field} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: this.rule.field,
          field_value: this.dataValue,
          condition: this.rule.condition,
          condition_value: this.rule.condition_value,
        },
      },
    };
  }

  validate() {
    let response = {};
    if (!this.validateDataValue()) {
      return { status: this.status, response: this.invalidFieldResponse() };
    }
    if (!this.checkConditionIsMet()) {
      response = this.errorData();
    } else {
      response = this.successData();
    }

    return { status: this.status, response };
  }
};
