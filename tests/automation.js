const { Builder, By, until } = require("selenium-webdriver");

async function runTests() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    console.log("Opening Home Page...");
    await driver.get("http://localhost:3000");

    // ================= REGISTER =================
    console.log("Testing Register...");
    await driver.get("http://localhost:3000/register");

    let uniqueUser = "testuser" + Date.now();
    let password = "Test@123";

    await driver.wait(until.elementLocated(By.name("username")), 5000);

    await driver.findElement(By.name("username")).sendKeys(uniqueUser);
    await driver.findElement(By.name("email")).sendKeys("test@test.com");
    await driver.findElement(By.name("password")).sendKeys(password);

    let registerBtn = await driver.findElement(By.css("button[type='submit']"));

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      registerBtn,
    );
    await driver.sleep(500);
    await driver.executeScript("arguments[0].click();", registerBtn);

    await driver.wait(until.urlContains("login"), 5000);
    console.log("Register Test Passed ✅");

    // ================= LOGIN =================
    console.log("Testing Login...");
    await driver.get("http://localhost:3000/login");

    await driver.wait(until.elementLocated(By.name("username")), 5000);

    await driver.findElement(By.name("username")).sendKeys(uniqueUser);
    await driver.findElement(By.name("password")).sendKeys(password);

    let loginBtn = await driver.findElement(By.css("button[type='submit']"));

    await driver.executeScript("arguments[0].scrollIntoView(true);", loginBtn);
    await driver.sleep(500);
    await driver.executeScript("arguments[0].click();", loginBtn);

    await driver.wait(until.urlContains("/"), 5000);
    console.log("Login Test Passed ✅");

    // ================= ADD CAMP =================
    console.log("Testing Add Camp...");
    await driver.get("http://localhost:3000/campgrounds/new");

    await driver.wait(until.elementLocated(By.name("campground[title]")), 5000);

    await driver
      .findElement(By.name("campground[title]"))
      .sendKeys("Test Camp");
    await driver
      .findElement(By.name("campground[location]"))
      .sendKeys("Himachal");
    await driver
      .findElement(By.name("campground[image]"))
      .sendKeys(
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
      );
    await driver.findElement(By.name("campground[price]")).sendKeys("1200");
    await driver
      .findElement(By.name("campground[description]"))
      .sendKeys("Beautiful automated test campground.");

    let submitBtn = await driver.findElement(By.css("button[type='submit']"));

    await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);
    await driver.sleep(500);
    await driver.executeScript("arguments[0].click();", submitBtn);

    await driver.wait(until.urlContains("campgrounds"), 5000);
    console.log("Add Camp Test Passed ✅");

    // ================= LOGOUT =================
    console.log("Testing Logout...");

    let logoutBtn = await driver.wait(
      until.elementLocated(By.linkText("Log Out")),
      5000,
    );

    await driver.executeScript("arguments[0].scrollIntoView(true);", logoutBtn);
    await driver.sleep(500);
    await driver.executeScript("arguments[0].click();", logoutBtn);

    await driver.wait(until.urlContains("/"), 5000);
    console.log("Logout Test Passed ✅");

    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY 🎉");
  } catch (err) {
    console.error("Test Failed ❌", err);
  } finally {
    await driver.quit();
  }
}

runTests();
