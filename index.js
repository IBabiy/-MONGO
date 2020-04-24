// Parser Shazam
const { Builder, By, Key, util } = require('selenium-webdriver');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Argent:1234567890@cluster0-qj1eo.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

async function pars() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.shazam.com/ru/charts/top-200/world');
        
        let dataObj = {};

        driver.sleep(2000).then(async function() {
            driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[3]/div[1]/div/div/a[1]`)).click();
            for (let i = 1; i < 201; i++) {
                var trackName = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[3]/div[1]/div/ul/li[${i}]/article/div/div[2]/div/div[1]`))).getText();
                var artistName = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[3]/div[1]/div/ul/li[${i}]/article/div/div[2]/div/div[2]`))).getText();
                var trackLink = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[3]/div[1]/div/ul/li[${i}]/article/div/div[2]/div/div[1]/a`))).getAttribute('href');

                dataObj[`Track${i}`] = 
                {
                    TrackName : trackName,
                    ArtistName : artistName,
                    TrackLing : trackLink
                };
            }
            driver.quit();
            client.connect(err => {
                const collection = client.db("Web").collection("ShazamParser");
                collection.insertOne(dataObj, function(err, result) {

                    if (err) {
                        return console.log(err.message);
                    }
                    console.log(result.ops);
                    client.close();
                });
            });
        });

        
    } catch {
        console.log('Error...');
        driver.quit();
    }
}
pars();