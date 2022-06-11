process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDB");

let pickles = { name: "Pickles", price: 6.77 };

beforeEach(function () {
  items.push(pickles);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
//  items.length = 0;
  items = [];
});

describe("GET /items", () => {
    test("Get all items", async () => {
      const res = await request(app).get("/items");
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ items: [pickles] })
    })
  })

  describe("GET /items/:name", () => {
    test("Get item by name", async () => {
      const res = await request(app).get(`/items/${pickles.name}`);
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ items: pickles })
    })
    test("Responds with 404 for invalid item", async () => {
      const res = await request(app).get(`/items/hamburger`);
      expect(res.statusCode).toBe(404)
    })
  })

  describe("POST /items", () => {
    test("Create an item", async function() {
      const res = await request(app).post("/items").send({item: { name: 'popsicle', price: 1.45 }});
console.log(res.body); // { item: { name: 'popsicle', price: 1.45 } }

    expect(res.statusCode).toBe(201);
    expect(res.body.item).toEqual({ name: 'popsicle', price: 1.45 });
//    expect(res.body.item.name).toEqual("popsicle");
    })
    test("Responds with 400 if name is missing", async () => {
      const res = await request(app).post("/items").send({});
      expect(res.statusCode).toBe(400);
    })
  })

  describe("PATCH /items/:name", function() {
    test("Update a single item", async function() {
      const resp = await request(app)
        .patch(`/items/${pickles.name}`)
        .send({
          name: "hamburger"
        });
      expect(resp.statusCode).toBe(200);
    
      expect(resp.body.item).toEqual({
        name: "hamburger", price: 6.77
      });
    });
  
    test("Responds with 404 if id invalid", async function() {
      const resp = await request(app).patch(`/items/0`).send({ name: "hamburger" });
      expect(resp.statusCode).toBe(404);
    });
  });

  describe("DELETE /items/:name", function() {
    test("Delete an item", async function() {
      const resp = await request(app).delete(`/items/${pickles.name}`);
//console.log(resp.body); // { message: 'Deleted' }
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ message: "Deleted" });
    });
  
    test("Deleting absent item", async function() {
      const resp = await request(app).delete(`/items/hamburger`);
console.log(resp.body);// { error: 'Item not found' }
      expect(resp.statusCode).toBe(404);
      
    });
  });