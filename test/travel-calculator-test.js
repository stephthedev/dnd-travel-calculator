var assert = require('assert');
var config = require("config");
var TC = require('../src/travel-calculator.js');

describe("Calculate travel time by land at ", function() {

  describe("normal pace", function() {
    describe('in normal terrain', function() {
      var tests = [
        //Negative tests
        {args: ["-1 str", 0], expected: {days: 0, hours: 0, minutes: 0}},
        {args: [-1, 0], expected: {days: 0, hours: 0, minutes: 0}},

        //Positive tests (minutes)
        {args: [0, 0], expected: {days: 0, hours: 0, minutes: 0}},
        {args: [1, 0], expected: {days: 0, hours: 0, minutes: 20}},
        {args: [2, 0], expected: {days: 0, hours: 0, minutes: 40}},

        //Positive tests (hours)
        {args: [3, 0], expected: {days: 0, hours: 1, minutes: 0}},
        {args: [4, 0], expected: {days: 0, hours: 1, minutes: 20}},
        {args: [5, 0], expected: {days: 0, hours: 1, minutes: 40}},
        {args: [6, 0], expected: {days: 0, hours: 2, minutes: 0}},

        //Just under a day, exactly a day, just over a day
        {args: [23, 0], expected: {days: 0, hours: 7, minutes: 40}},
        {args: [24, 0], expected: {days: 1, hours: 0, minutes: 0}},
        {args: [25, 0], expected: {days: 1, hours: 0, minutes: 20}},

        //A day and an hour
        {args: [27, 0], expected: {days: 1, hours: 1, minutes: 0}},

        {args: [48, 0], expected: {days: 2, hours: 0, minutes: 0}},
        {args: [72, 0], expected: {days: 3, hours: 0, minutes: 0}},
        {args: [96, 0], expected: {days: 4, hours: 0, minutes: 0}}
      ];

      tests.forEach(function(testDatum) {
        it('for ' + testDatum.args[0] + ' miles', function() {
          runTest(testDatum, "normal");
        });
      });
    });

    describe('in difficult terrain', function() {
      var tests = [
        {args: [0, "-1"], expected: {days: 0, hours: 0, minutes: 0}},
        {args: [0, -1], expected: {days: 0, hours: 0, minutes: 0}},
        {args: [0, 0], expected: {days: 0, hours: 0, minutes: 0}},
        {args: [0, 1], expected: {days: 0, hours: 0, minutes: 40}},
        {args: [0, 2], expected: {days: 0, hours: 1, minutes: 20}},
        {args: [0, 3], expected: {days: 0, hours: 2, minutes: 0}},
        {args: [0, 4], expected: {days: 0, hours: 2, minutes: 40}},
        {args: [0, 5], expected: {days: 0, hours: 3, minutes: 20}},
        {args: [0, 6], expected: {days: 0, hours: 4, minutes: 0}},
        {args: [0, 23], expected: {days: 1, hours: 7, minutes: 20}},
        {args: [0, 24], expected: {days: 2, hours: 0, minutes: 0}},
        {args: [0, 25], expected: {days: 2, hours: 0, minutes: 40}},
        {args: [0, 26], expected: {days: 2, hours: 1, minutes: 20}},
        {args: [0, 27], expected: {days: 2, hours: 2, minutes: 0}}
      ];

      tests.forEach(function(testDatum) {
        it('for ' + testDatum.args[1] + ' miles', function() {
          runTest(testDatum, "normal");
        });
      });
    });

    describe('in mixed terrain', function() {
      var tests = [
        {args: [0, 0], expected: {days: 0, hours: 0, minutes: 0}},
        {args: [2, 2], expected: {days: 0, hours: 2, minutes: 0}},
        {args: [24, 12], expected: {days: 2, hours: 0, minutes: 0}},

        //Each combine to total exactly one extra day
        {args: [32, 8], expected: {days: 2, hours: 0, minutes: 0}},
        {args: [36, 18], expected: {days: 3, hours: 0, minutes: 0}}
      ];

      tests.forEach(function(testDatum) {
        it('for ' + testDatum.args[0] + ' normal miles, ' + testDatum.args[1] + ' difficult miles', function() {
          runTest(testDatum, "normal");
        });
      });
    });
  }); //end normal pace tests

  describe("at slow pace", function() {
    var tests = [
      //Positive tests
      {args: [9, 0], expected: {days: 0, hours: 4, minutes: 0}},
      {args: [18, 0], expected: {days: 1, hours: 0, minutes: 0}},
      {args: [27, 0], expected: {days: 1, hours: 4, minutes: 0}},
      {args: [36, 0], expected: {days: 2, hours: 0, minutes: 0}},
    ];

    tests.forEach(function(testDatum) {
      it('for ' + testDatum.args[0] + ' miles', function() {
        runTest(testDatum, "slow");
      });
    });
  }); //end slow pace tests

  describe("at fast pace", function() {
    var tests = [
      //Positive tests
      {args: [15, 0], expected: {days: 0, hours: 4, minutes: 0}},
      {args: [30, 0], expected: {days: 1, hours: 0, minutes: 0}},
      {args: [45, 0], expected: {days: 1, hours: 4, minutes: 0}},
      {args: [60, 0], expected: {days: 2, hours: 0, minutes: 0}},
    ];

    tests.forEach(function(testDatum) {
      it('for ' + testDatum.args[0] + ' miles', function() {
        runTest(testDatum, "fast");
      });
    });
  });
});

describe("Calculate travel time by sea ", function() {
  describe("via galley", function() {
    let tests = [
      //1 hour
      {args: {totalMiles: 4}, expected: {days: 0, hours: 1, minutes: 0}},
      //12 hours
      {args: {totalMiles: 48}, expected: {days: 0, hours: 12, minutes: 0}},
      //1 day
      {args: {totalMiles: 96}, expected: {days: 1, hours: 0, minutes: 0}},
      //1 week
      {args: {totalMiles: 672}, expected: {days: 7, hours: 0, minutes: 0}},
      //30 days
      {args: {totalMiles: 2880}, expected: {days: 30, hours: 0, minutes: 0}},
      //1000 miles
      {args: {totalMiles: 1000}, expected: {days: 10, hours: 10, minutes: 0}},
    ];

    tests.forEach(function(testDatum) {
      it('for ' + testDatum.args.totalMiles + ' miles', function() {
        runSeaTest(testDatum, "galley");
      });
    });
  });

  describe("via keelboat", function() {
    let tests = [
      //1 hour
      {args: {totalMiles: 3}, expected: {days: 0, hours: 1, minutes: 0}},
      //12 hours
      {args: {totalMiles: 36}, expected: {days: 0, hours: 12, minutes: 0}},
      //1 day
      {args: {totalMiles: 72}, expected: {days: 1, hours: 0, minutes: 0}},
      //1 week
      {args: {totalMiles: 504}, expected: {days: 7, hours: 0, minutes: 0}},
      //30 days
      {args: {totalMiles: 2160}, expected: {days: 30, hours: 0, minutes: 0}},
      //1000 miles
      {args: {totalMiles: 1000}, expected: {days: 13, hours: 21, minutes: 20}},
    ];

    tests.forEach(function(testDatum) {
      it('for ' + testDatum.args.totalMiles + ' miles', function() {
        runSeaTest(testDatum, "keelboat");
      });
    });
  });

  describe("via longship", function() {
    let tests = [
      //1 hour
      {args: {totalMiles: 5}, expected: {days: 0, hours: 1, minutes: 0}},
      //12 hours
      {args: {totalMiles: 60}, expected: {days: 0, hours: 12, minutes: 0}},
      //1 day
      {args: {totalMiles: 120}, expected: {days: 1, hours: 0, minutes: 0}},
      //1 week
      {args: {totalMiles: 840}, expected: {days: 7, hours: 0, minutes: 0}},
      //30 days
      {args: {totalMiles: 3600}, expected: {days: 30, hours: 0, minutes: 0}},
      //1000 miles
      {args: {totalMiles: 1000}, expected: {days: 8, hours: 8, minutes: 0}},
    ];

    tests.forEach(function(testDatum) {
      it('for ' + testDatum.args.totalMiles + ' miles', function() {
        runSeaTest(testDatum, "longship");
      });
    });
  });

  describe("via rowboat", function() {
    let tests = [
      //1 hour
      {args: {totalMiles: 3}, expected: {days: 0, hours: 1, minutes: 0}},
      //12 hours
      {args: {totalMiles: 36}, expected: {days: 1, hours: 4, minutes: 0}},
      //1 day
      {args: {totalMiles: 24}, expected: {days: 1, hours: 0, minutes: 0}},
      //1 week
      {args: {totalMiles: 168}, expected: {days: 7, hours: 0, minutes: 0}},
      //30 days
      {args: {totalMiles: 720}, expected: {days: 30, hours: 0, minutes: 0}},
      //1000 miles
      {args: {totalMiles: 1000}, expected: {days: 41, hours: 5, minutes: 20}},
    ];

    tests.forEach(function(testDatum) {
      it('for ' + testDatum.args.totalMiles + ' miles', function() {
        runSeaTest(testDatum, "rowboat");
      });
    });
  });
});

function runTest(testDatum, pace) {
  var timeTaken = TC.calculateTravelTimeByLand(testDatum.args[0], testDatum.args[1], pace);
  assert.equal(testDatum.expected.days, timeTaken.days, "Unexpected days");
  assert.equal(testDatum.expected.hours, timeTaken.hours, "Unexpected hours");
  assert.equal(testDatum.expected.minutes, timeTaken.minutes, "Unexpected minutes");
}

function runSeaTest(testDatum, boatType) {
  var timeTaken = TC.calculateTravelTimeBySea(testDatum.args.totalMiles, boatType);
  assert.equal(testDatum.expected.days, timeTaken.days, "Unexpected days");
  assert.equal(testDatum.expected.hours, timeTaken.hours, "Unexpected hours");
  assert.equal(testDatum.expected.minutes, timeTaken.minutes, "Unexpected minutes");
}