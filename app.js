const express=require('express');
const path=require('path');
const server=express();

let directory=`${__dirname}/`;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request=require('request');
const fs=require('fs');

const nhentai=require(`./modules/nhentai.js`);

const port=3000;

//setup pug view direction
server.set("view engine", "pug");
server.set("views", path.join(`${__dirname}`, "dist"));

server.use(express.static('dist'));

server.get('/', function(req, res) {
    console.log(req);
    res.render('pug/index.pug');
});

server.get('/result',async function(req,res){
    console.log(req.query.query);
    console.log(req.query.source);
    console.log(req.query.page);
    let nhentaiPageListMax = 25;
    if(req.query.page < 1) {
        req.query.page = 1;
    }
    let querypage = nhentaiPageListMax*(req.query.page - 1);
    let resultLength = 15;
    let result = await nhentai.search(req.query.query, querypage, querypage+resultLength);
    console.log(result);
    res.render('pug/result.pug',{
        result:result
        /*
        result:[{.},{.},{..}]
        {.}=>{
            // the unique id of the book
            bookNumber:"16357"
            //where did this book comes from
            source:"nhentai"
            //this book's title
            title:"boooks"
            //image thumbnail url for this book
            thumbnail:"https://nhentai.net/g/123456/1/"

        }
        */
    });
});

server.get('/detail',function(req,res){
    console.log(req.query.source);
    console.log(req.query.booknumber);
    let title = ''; //string
    let artist = ''; //string
    let time = ''; //string, currently not used
    let tags = []; //string
    let images = []; //string, suppose to be a url
    let thumbnails = []; //string, suppose to be a url
    res.render('pug/detail.pug',{
        title:title,
        artist:artist,
        time:time,
        tags:tags,
        images:images,
        thumbnails:thumbnails
    });
});

server.listen(port);
console.log(`server open on ${port}`);