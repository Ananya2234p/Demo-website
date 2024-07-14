import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

const items=['shirt','pants','earrings','skarf','shoes','dress','necklace'];
const titles=[];
let Hashtags=new Map();
let Selecteds=new Map();
const liked=[];
const cart=[];
app.get("/", (req, res) => {
    res.render("app.ejs",{items});
  });
app.post("/submit",(req,res)=>{
    const selectedIndices = req.body.selected || [];
    console.log("Selected indices:", selectedIndices);
    const selectedItems = selectedIndices.map(index => items[index]);
    console.log("Selected items:", selectedItems);
    res.render("Makeset.ejs",{ selectedItems });
});
app.post("/anotherPage", (req, res) => {
    const { title, hashtags, selectedItems } = req.body;
    console.log("Title:", title);
    console.log("Hashtags:", hashtags);
    console.log("Selected items:", selectedItems);
    const title1 = req.body.title;
    const hashtag=req.body.hashtags;
    console.log("Title:", title1);
    console.log("hashtags:", hashtag);
    titles.push(title1);
    const titleIndex = titles.length - 1;
    Hashtags.set(titleIndex, hashtags); 
    Selecteds.set(titleIndex,selectedItems);
    console.log("Submissions:", titles);
    console.log("Submissions:", Hashtags);
    console.log("Submissions:", Selecteds);
    const HashtagsObject = Object.fromEntries(Hashtags);
    const SelectedsObject = Object.fromEntries(Selecteds);
    res.render("anotherPage.ejs",{titles,Hashtags: HashtagsObject, Selecteds: SelectedsObject});
});
app.post("/newpost",(req,res)=>{
 res.render("app.ejs",{items});
});
app.post("/liked", (req, res) => {
  const likedposts = req.body.liked || [];
  likedposts.forEach(index => {
      const title = titles[index];
      if (!liked.includes(title)) {
          liked.push(title);
      }
  });
  console.log(liked);
  const HashtagsObject = Object.fromEntries(Hashtags);
  const SelectedsObject = Object.fromEntries(Selecteds);
  res.render("liked.ejs", { liked, titles, Hashtags: HashtagsObject, Selecteds: SelectedsObject });
});
app.post("/addcart", (req, res) => {
  const cartIndex = req.body.Cart;
  if (cartIndex !== undefined) {
      const selectedItems = Selecteds.get(parseInt(cartIndex));
      if (selectedItems) {
          cart.push(...selectedItems);
          console.log("Added items to cart:", selectedItems);
          console.log("Current cart:", cart);
          res.status(200).send("Items added to cart successfully.");
      } else {
          res.status(404).send("Selected items not found.");
      }
  } else {
      res.status(400).send("Invalid request: Cart index not provided.");
  }
});
app.post("/cart",(req,res)=>{
  res.render("cart.ejs", {cart});
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });


  