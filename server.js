const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 5000
dotenv.config()
const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("mongodb is connected"))
  .catch(()=>console.log("error in connecting mongodb"))

const movieSchema = new mongoose.Schema({
    title:{type:String,required:true},
    director:{type:String,required:true},
    genre:{type:String,required:true},
    releaseYear:{type:Number},
    availableCopies:{type:Number,required:true}
})
const movie = mongoose.model("movie",movieSchema)

app.get("/",(req,res)=>{
    res.send("welcome to the movie management API")
})

app.post("/api/movie",async(req,res)=>{
    try{
        const[title,director,genre,releaseYear,availableCopies]=req.body
       
        if(!title ||!director ||!genre ||!releaseYear || availableCopies==null){
            return res.status(400).json({message:"missing required field"})
        }
        const newMovie = new movie({title,director,genre,releaseYear,availableCopies})
        await newMovie.save()
        res.status(201).json(newMovie)
    }catch(error){
        res.status(500).json({message:"internal server error"})
    }
})

app.get("/api/movie/:id",async(req,res)=>{
    try{
        const {id}=req.params
        const movie = await movie.findById(id)
        if(!movie)return res.status(404).json({message:"movie not found"})
        res.json(movie)
    }catch(error){
        res.status(500).json({message:"internal server error"})
    }
})

app.put("/api/updateMovie/:id",async(req,res)=>{
    try{
        const {id}=req.params
        const updateMovie = await movie.findByIdAndUpdate(id,req.body,{new:true})
        if(!updateMovie)return res.status(404).json({message:"movie not found"})
        res.json(updateMovie)
    }catch(error){
        res.status(500).json({message:"internal server error"})
    }
})

app.delete("/api/deleteMovie/:id",async(req,res)=>{
    try{
        const {id}= req.params
        const deleteMovie = await movie.findByIdAndDelete(id)
        if(!deleteMovie) return res.status(404).json({message:"movie not found"})
        res.json({message:"deleted successfully"})
    }catch(error){
        res.status(500).json({message:"internal server error"})
    }
})

app.listen(PORT,()=>{console.log(`server is running on http://localhost:${PORT}`)})