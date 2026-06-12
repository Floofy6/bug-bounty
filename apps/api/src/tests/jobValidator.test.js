import test from "node:test";
import assert from "node:assert/strict";
import { createJobSchema, updateJobSchema } from "../validators/job.js";

const validJob = {
  title: "Build marketplace API",
  description: "Create a stable API for marketplace job listings.",
  budgetMin: 100,
  budgetMax: 500,
  categoryId: "software",
  skills: ["node"]
};

test("createJobSchema rejects inverted budget ranges", () => {
  const result = createJobSchema.safeParse({
    ...validJob,
    budgetMin: 500,
    budgetMax: 100
  });

  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues[0].path, ["budgetMax"]);
});

test("updateJobSchema rejects inverted budget ranges when both fields are present", () => {
  const result = updateJobSchema.safeParse({
    budgetMin: 500,
    budgetMax: 100
  });

  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues[0].path, ["budgetMax"]);
});

test("job schemas accept ordered budget ranges", () => {
  assert.equal(createJobSchema.safeParse(validJob).success, true);
  assert.equal(
    updateJobSchema.safeParse({ budgetMin: 100, budgetMax: 500 }).success,
    true
  );
});
