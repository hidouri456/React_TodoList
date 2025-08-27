import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTodoTest() {
 
  const options = new chrome.Options();
  
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    
    await driver.get('http://localhost:5173/');

   
    
    const inputField = await driver.findElement(By.className('todo-input'));
    await inputField.sendKeys('Faire les courses');
    await sleep(2000); 
    await driver.findElement(By.className('todo-add-btn')).click();
    await sleep(2000); 

    
    const newTask = await driver.wait(until.elementLocated(By.className('todo-text')), 5000);
    const taskText = await newTask.getText();
    if (taskText !== 'Faire les courses') {
      throw new Error(`Assertion échouée: Attendu "Faire les courses", mais reçu "${taskText}"`);
    }
    console.log('Ajout de tâche: RÉUSSI - todo.test.js:34');


    
    
    const taskItem = await newTask.findElement(By.xpath('./..')); 
    await taskItem.findElement(By.className('todo-edit-btn')).click();
    await sleep(2000); 

   
    const editInput = await driver.wait(until.elementLocated(By.className('todo-edit-input')), 5000);
    await editInput.clear();
    await editInput.sendKeys('Faire les courses (modifié)');
    await sleep(2000);
    await driver.findElement(By.className('todo-update-btn')).click();

    
    const updatedTask = await driver.wait(until.elementLocated(By.className('todo-text')), 5000);
    await sleep(2000); 
    const updatedText = await updatedTask.getText();
    await sleep(2000); 
    if (updatedText !== 'Faire les courses (modifié)') {
      throw new Error(`Assertion échouée: Attendu "Faire les courses (modifié)", mais reçu "${updatedText}"`);
    }
    console.log('Modification de tâche: RÉUSSI - todo.test.js:58');


    
    
    const updatedTaskItem = await updatedTask.findElement(By.xpath('./..'));
    await sleep(2000); 
    await updatedTaskItem.findElement(By.className('todo-delete-btn')).click();
    await sleep(2000); 

    
    const tasks = await driver.findElements(By.className('todo-item'));
    if (tasks.length !== 0) {
      throw new Error(`Assertion échouée: La liste des tâches devrait être vide, mais contient ${tasks.length} élément(s).`);
    }
    console.log('Suppression de tâche: RÉUSSI - todo.test.js:73');

    console.log('\n✅ Tous les tests sont passés avec succès ! - todo.test.js:75');

  } catch (error) {
    console.error('❌ Un test a échoué: - todo.test.js:78', error.message);
  } finally {
    
    await driver.quit();
  }
}


runTodoTest();
