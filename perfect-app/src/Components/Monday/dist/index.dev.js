"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertMonday = insertMonday;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

////
var API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIwOTg1Mjc4OCwidWlkIjoxMjM1MTE2MCwiaWFkIjoiMjAyMi0xMi0xNlQxNDoxNDowMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NTU0OTk4OCwicmduIjoidXNlMSJ9.o73_nLLPlmYf2nxrGbrfJxSJOUm5KJ_dgVxfzFjx65s';

function insertMonday(customer_name, label, totalCost, timestamp, product_items, created_by, phone, patient_email, downP, remarks) {
  var mutation1, response;
  return regeneratorRuntime.async(function insertMonday$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          mutation1 = "\n    mutation {\n      create_item(\n        board_id: 3970694330,\n        item_name: \"".concat(customer_name, "\",\n        column_values: \"{\n          \\\"text0\\\": \\\"").concat(remarks, "\\\",\n          \\\"color\\\": {\n            \\\"label\\\": \\\"").concat(label, "\\\"\n          },\n          \\\"date\\\": {\n            \\\"date\\\": \\\"").concat(timestamp, "\\\"\n          },\n          \\\"numeric\\\": \\\"").concat(totalCost, "\\\",\n          \\\"text29\\\": \\\"").concat(product_items, "\\\",\n          \\\"text54\\\": \\\"").concat(phone, "\\\",\n          \\\"text7\\\": \\\"").concat(created_by, "\\\",\n          \\\"text2\\\": \\\"").concat(patient_email, "\\\",\n          \\\"numeric9\\\": \\\"").concat(downP, "\\\"\n        }\"\n      ) {\n        id\n      }\n    }\n  ");
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("https://api.monday.com/v2", {
            query: mutation1,
            variables: {}
          }, {
            headers: {
              "Content-Type": "application/json",
              Authorization: API_KEY
            }
          }));

        case 4:
          response = _context.sent;
          console.log(JSON.stringify(response.data, null, 2));
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
}