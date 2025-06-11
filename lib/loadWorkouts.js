// lib/loadWorkouts.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export function loadWorkoutsFromCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(process.cwd(), "data", "workouts.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          title: row.Title,
          description: row.Desc,
          type: row.Type,
          bodyPart: row.BodyPart,
          equipment: row.Equipment,
          level: row.Level,
          rating: row.Rating,
        });
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}
