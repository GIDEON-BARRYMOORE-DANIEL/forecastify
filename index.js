import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
const apiKey = "3c8079c615399d398df5262fc50405d7";

app.get("/", (req,res)=>{
    res.render("index.ejs", {content: ""});
})

app.post("/", async(req, res)=>{
    const searchInput = req.body.searchInput;
    try{
        const result = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
            params:{
                q: searchInput,
                limit: 1,
                appid: apiKey,

            }

        });
        res.render("index.ejs", {content: result.data[0]});
    }catch(error){
        console.log(error.response?.data || error.message);
        res.status(401).send("something went wrong");
    }
 
});

app.listen(port, ()=>{
    console.log(`server runnimg on port ${port}`);
})

