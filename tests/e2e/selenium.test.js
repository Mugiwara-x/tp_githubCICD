const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const APP_URL = 'http://localhost:3000';
const TIMEOUT = 10000;

describe('Tests E2E Selenium', () => {
  let driver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless');      
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  //  TEST 1 : Ouvrir l'app 
  it('doit charger la page de login', async () => {
    await driver.get(APP_URL);
    const title = await driver.getTitle();
    expect(title).toBe('Gestionnaire de Tâches');
  });

  //  TEST 2 : Login 
  it('doit se connecter avec les identifiants valides', async () => {
    await driver.get(`${APP_URL}/login`);

    await driver.findElement(By.css('input[type="email"]'))
      .sendKeys('admin@test.com');

    await driver.findElement(By.css('input[type="password"]'))
      .sendKeys('password');

    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains('/dashboard'), TIMEOUT);
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/dashboard');
  });

  //  TEST 3 : Créer une tâche 
  it('doit créer une nouvelle tâche', async () => {
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Nouvelle tâche')]")),
      TIMEOUT
    );
    await driver.findElement(
      By.xpath("//*[contains(text(), 'Nouvelle tâche')]")
    ).click();

    await driver.findElement(By.css('input[name="title"]'))
      .sendKeys('Tâche Selenium');

    await driver.findElement(By.css('button[type="submit"]')).click();
  });

  //  TEST 4 : Vérifier que la tâche apparaît 
  it('doit afficher la tâche créée dans la liste', async () => {
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Tâche Selenium')]")),
      TIMEOUT
    );
    const task = await driver.findElement(
      By.xpath("//*[contains(text(), 'Tâche Selenium')]")
    );
    expect(await task.isDisplayed()).toBe(true);
  });

});