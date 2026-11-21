import { test, expect } from "@playwright/test"

test("Iron Man watched checkbox sends a PATCH and updates the UI", async ({ page }) => {
  await page.goto("/")

  const checkbox = page.getByRole("checkbox", {
    name: "Watched Iron Man",
  })
  await expect(checkbox).toBeVisible()

  const originalValue = await checkbox.isChecked()
  const nextValue = !originalValue

  const [response] = await Promise.all([
    page.waitForResponse(
      (request) =>
        request.url().includes("/api/movies/1") &&
        request.request().method() === "PATCH",
    ),
    checkbox.click(),
  ])

  const body = await response.json()
  console.log("Watched checkbox PATCH:", {
    requested: nextValue,
    status: response.status(),
    response: body,
  })

  expect(response.status()).toBe(200)
  expect(body.watched).toBe(nextValue)
  await expect(checkbox).toBeChecked({ checked: nextValue })

  await checkbox.click()
})
