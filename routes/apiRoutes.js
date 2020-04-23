// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

//let noteData = require("../db/db.json");
const fs = require("fs");
const util = require("util");
const path = require("path");
let id = 0;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let baseDir = path.join(__dirname, "/../db/db.json");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  function readFile() {
    var json = readFileAsync(baseDir, "utf8");
    return json;
  }

  app.get("/api/notes", async function (req, res) {
    try {
      var data = await readFile();
      res.json(JSON.parse(data));
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/api/notes", async function (req, res) {
    var newId;
    try {
      var data = await readFile();
      var newFile = JSON.parse(data);
      if (newFile.length == 0) {
        newId = 1;
      } else {
        var lastElement = newFile.slice(-1);
        newId = lastElement[0].id + 1;
      }
      var newNote = req.body;
      newNote.id = newId;
      newFile.push(newNote);
      writeFileAsync(baseDir, JSON.stringify(newFile)).then(function () {
        res.sendStatus(200);
      });
    } catch (err) {
      console.log(err);
    }
  });

  app.delete("/api/notes/:id", async function (req, res) {
    try {
      var data = await readFile();
      var noteData = JSON.parse(data).filter(
        (note) => note.id != req.params.id
      );
      writeFileAsync(baseDir, JSON.stringify(noteData)).then((err) => {
        if (err) {
          console.log(err);
          throw err;
        }
        res.send("Deleted");
      });
    } catch (err) {
      console.log(err);
    }
  });
};
