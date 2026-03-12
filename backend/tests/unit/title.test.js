describe("Task object", () => {

  test("task has a title", () => {
    const task = { title: "Test task", status: "todo" }
    expect(task.title).toBe("Test task")
  })