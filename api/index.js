import express from "express";
import axios from "axios";
import bodyParser from "body-parser"; // can remove this if you don't use it explicitly
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const apikey = process.env.API_KEY;
console.log("PORT:", process.env.PORT);
console.log("API_KEY:", process.env.API_KEY);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));


app.get("/", (req,res)=>{
    res.render("index.ejs", {content: "", weather: "", forecast: ""});
})

app.post("/", async(req, res)=>{
    const searchInput = req.body.searchInput;
    try{
        const geoResponseresult = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {   //ALLOWS YOU GET LON & LAT OF A LOCATION BY CITY NAME, ZIPCODE, FULL ADDRESS ETC...
            params:{
                q: searchInput,  // clients searched location 
                limit: 1,  // limit means number of same name location to be shown on the api call
                appid: apikey, // appid holding your api key for authorization

            }

        });
        if(!geoResponseresult.data.length){
            return res.status(404).send(" OOpss Location Not Found..."); // if api not searched properly or location doesnt exist send error 404
        }

        const {lat, lon} = geoResponseresult.data[0]; // got the lon & lat of the location from the geo api & assigned it a var to use its data to fetch location tempeature

        
            const weatherResult = await axios.get("https://api.openweathermap.org/data/2.5/weather", { // The weather api is used to get the current weather information (like temperature, weather description, humidity, etc.) for a specific location.
                params: {
                    lat, //passed in the longitutude 
                    lon, //passed in the latitude
                    units: "metric", // units i wanted in kent
                    appid: apikey, // my api key was required as usual for aauthorisation

                }
            });

         
            const forecastResult = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
                params: {
                    lat,
                    lon,
                    units: "metric",
                    appid: apikey,
                }
            });
           
            res.render("index.ejs",
            {   content: geoResponseresult.data[0], // rendered all geo datas to my home page returning an array []
               weather: weatherResult.data, // rendered all weather datas to my home page returning an object 
               forecast: forecastResult.data
           });


      

        

       
    }catch(error){
        console.log(error.response?.data || error.message);
        res.status(401).send("something went wrong");
    }
 
});

app.listen(port, ()=>{
    console.log(`server runnimg on port ${port}`);
})

