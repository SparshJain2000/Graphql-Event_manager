const assert = require("assert");
const { dateToString } = require("../helpers/date.helper");
const date = "2020-10-10T18:30:00.000Z";
describe("helper functions test", () => {
    it(`should return ${date}`, () => {
        assert.equal(dateToString(new Date(date)), date);
    });
});
